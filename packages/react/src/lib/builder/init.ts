import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { groupBy } from 'lodash-es'

import {
  BuildContext,
  BuilderLogoutFlow,
  BuilderSorter,
  BuildFormContext,
  excludedAuthGroups,
  FormNode,
  OryFlowType,
} from '../../types'
import {
  BuildLogout,
  showLogout,
  BuildChooseMethod,
  BuildForgotPassword,
  BuildSelectAnother as BuildSelectMethod,
  BuildGoBackCode,
  BuildRecover,
  BuildSignIn,
  BuildSignUp,
  BuildDivider,
  BuildCaptcha,
} from '../nodes/presets'
import { getNodeGroupsWithVisibleNodes, nodesToAuthMethodGroups } from '../nodes/groups'
import { findScreenSelectionButton, isNodeVisible } from '../nodes/filters'
import { createDivGroup } from '../nodes/factory'
import { toAuthMethodPickerOptions } from '../nodes/filters'

import { BuildAuthMethodList } from './authMethods'
import { NodeDataBuilder } from './data'
import { SettingsBuilder } from './settings'

export function Builder(
  ctx: BuildContext,
  formCtx: BuildFormContext,
  logoutCtx: BuilderLogoutFlow,
  { nodeSorter, groupSorter }: BuilderSorter,
) {
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })
  const sortGroups = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => groupSorter(a, b)

  const { config, flowContainer, formState, t } = ctx
  const { setOverrideState, selectMethod } = formCtx
  const { captcha, registration_enabled } = config.project

  const { flow, flowType } = flowContainer
  const flowNodes = flow.ui.nodes
  if (!flowNodes) return []

  const nodes = NodeDataBuilder({
    nodes: flowNodes,
    formCtx,
    flowContainer,
  })

  if (captcha && captcha.includes(flowType)) {
    nodes.push(BuildCaptcha())
  }

  nodes.sort(sortNodes)

  let result: FormNode[] = []

  const authMethods = nodesToAuthMethodGroups(nodes)
  const visibleGroups = getNodeGroupsWithVisibleNodes(nodes)
  const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)

  const grouped = groupBy(nodes, (node) => {
    const group = node.group
    if (group === UiNodeGroupEnum.Captcha) return 'captcha'

    const visible = isNodeVisible(node)
    const isSso = (group === UiNodeGroupEnum.Oidc || group === UiNodeGroupEnum.Saml) && visible

    if (isSso) return 'sso'
    if (!visible) return 'hidden'
    return 'visible'
  })

  const ssoNodes = grouped.sso ?? []
  const hiddenNodes = grouped.hidden ?? []
  const visibleNodes = grouped.visible ?? []
  const captchaNodes = grouped.captcha ?? []

  switch (formState.current) {
    case 'provide_identifier': {
      if (ssoNodes.length > 0) {
        result.push(...ssoNodes)
        if (visibleNodes) {
          result.push(BuildDivider())
        }
      }

      result.push(...hiddenNodes, ...[...visibleNodes, ...captchaNodes].sort(sortNodes))

      switch (flowType) {
        case OryFlowType.Login: {
          if (showLogout(flow, formState, authMethods)) {
            const logout = BuildLogout(ctx, logoutCtx)
            result.push(...logout)
          } else {
            if (registration_enabled) {
              const signUp = BuildSignUp(ctx)
              result.push(...signUp)
            }
          }
          break
        }
        case OryFlowType.Registration: {
          if (registration_enabled) {
            const signIn = BuildSignIn(ctx)
            result.push(...signIn)
          }
          break
        }
      }
      break
    }
    case 'method_active': {
      const selectedNodes = visibleNodes.filter((node) => node.group === formState.method)

      const profileNodes = visibleNodes.filter(
        (node) => node.group === UiNodeGroupEnum.Default || node.group === UiNodeGroupEnum.Profile,
      )

      result = [...profileNodes, ...captchaNodes, ...selectedNodes, ...hiddenNodes].sort(sortNodes)

      switch (flowType) {
        case OryFlowType.Login: {
          if (authMethods.length > 1) {
            const chooseMethod = BuildChooseMethod({
              ...ctx,
              onClick: () => {
                setOverrideState({ current: 'select_method' })
              },
            })
            result.push(chooseMethod)
          } else if (authMethods.length === 1 && authMethods[0] === 'code') {
            const goBack = BuildGoBackCode(ctx)
            result.push(goBack)
          }
          break
        }
        case OryFlowType.Registration: {
          const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
          if (screenSelectionNode && Object.entries(authMethodBlocks).length >= 2) {
            const selectMethod = BuildSelectMethod({
              ...ctx,
              onClick: () => {
                setOverrideState({ current: 'select_method' })
              },
            })
            result.push(selectMethod)
          }
          break
        }
      }
      break
    }
    case 'select_method': {
      const authMethodAdditionalNodes = nodes.filter(
        (node) => isNodeVisible(node) && excludedAuthGroups.includes(node.group),
      )

      result = [...authMethodAdditionalNodes, ...ssoNodes, ...hiddenNodes]

      const methodButtons = BuildAuthMethodList({
        groups: authMethodBlocks,
        selectMethod,
        ctx,
      })

      if (methodButtons) result.push(BuildDivider(), ...methodButtons)

      break
    }
    case 'settings': {
      const groupKeys = Object.keys(visibleGroups) as UiNodeGroupEnum[]
      const sortedGroupKeys = groupKeys.sort(sortGroups)

      const settingsNodes: FormNode[] = [...hiddenNodes]

      for (let i = 0; i < sortedGroupKeys.length; i++) {
        const key = sortedGroupKeys[i]
        const nodes = visibleGroups[key]
        if (nodes) {
          if (i > 0) {
            settingsNodes.push(
              ...createDivGroup({
                id: `settings-divider-${key}`,
                data: { variant: 'settings-divider' },
                children: [BuildDivider()],
              }),
            )
          }
          settingsNodes.push(...SettingsBuilder(key, nodes, t, visibleGroups))
        }
      }

      result = settingsNodes
      break
    }
    default:
      result = nodes
  }

  if (flowType !== OryFlowType.Settings) {
    result = createDivGroup({
      id: 'form-card',
      data: {
        type: 'Card',
      },
      children: result,
    })
  }

  switch (flowType) {
    case OryFlowType.Login: {
      if (!flow.refresh) {
        const recover = BuildRecover(ctx)
        if (recover) {
          result.push(recover)
        } else {
          const forgot = BuildForgotPassword(ctx)
          if (forgot) {
            result.push(forgot)
          }
        }
      }
    }
  }

  return result
}
