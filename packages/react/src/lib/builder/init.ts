import { isUiNodeScriptAttributes, UiNode, UiNodeGroupEnum } from '@ory/client-fetch'

import {
  BuildContext,
  BuilderLogoutFlow,
  BuilderSorter,
  BuildRHFContext,
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
} from '../nodes/presets'
import {
  getFinalNodes,
  getNodeGroupsWithVisibleNodes,
  nodesToAuthMethodGroups,
} from '../nodes/groups'
import {
  findScreenSelectionButton,
  isNodeVisible,
  withoutSingleSignOnNodes,
} from '../nodes/filters'
import { createDivGroup } from '../nodes/factory'
import { getFunctionalNodes, toAuthMethodPickerOptions } from '../nodes/filters'

import { BuildAuthMethodList } from './authMethods'
import { NodeDataBuilder } from './nodeData'
import { SettingsBuilder } from './settings'

export function Builder(
  { config, flowContainer, formState, t }: BuildContext,
  formCtx: BuildRHFContext,
  logoutCtx: BuilderLogoutFlow,
  { selectMethod, clearMethod, nodeSorter, groupSorter }: BuilderSorter,
) {
  const ctx: BuildContext = { config, flowContainer, formState, t }
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })
  const sortGroups = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => groupSorter(a, b)

  const { flow, flowType } = flowContainer

  const flowNodes = flow.ui.nodes

  if (!flowNodes) return []

  // console.log(flowNodes)

  const nodes = NodeDataBuilder({
    nodes: flowNodes,
    formCtx,
    flowContainer,
  })

  let result: FormNode[] = []

  const authMethods = nodesToAuthMethodGroups(nodes)
  const visibleGroups = getNodeGroupsWithVisibleNodes(nodes)
  const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)

  switch (formState.current) {
    case 'provide_identifier': {
      const nonSsoNodes = withoutSingleSignOnNodes(nodes).sort(sortNodes)
      const ssoNodes = nodes
        .filter(isNodeVisible)
        .filter(
          (node) => node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml,
        )

      if (ssoNodes.length > 0) {
        result.push(...ssoNodes)
        if (nonSsoNodes.some(isNodeVisible)) {
          result.push(BuildDivider())
        }
      }

      result.push(...nonSsoNodes)

      switch (flowType) {
        case OryFlowType.Login: {
          if (showLogout(flow, formState, authMethods)) {
            const logout = BuildLogout(ctx, logoutCtx)
            result.push(...logout)
          } else {
            if (config.project.registration_enabled) {
              const signUp = BuildSignUp(ctx)
              result.push(...signUp)
            }
          }
          break
        }
        case OryFlowType.Registration: {
          if (config.project.registration_enabled) {
            const signIn = BuildSignIn(ctx)
            result.push(...signIn)
          }
          break
        }
      }
      break
    }
    case 'method_active': {
      const finalNodes = getFinalNodes(visibleGroups, formState.method)

      const hiddenNodes = nodes.filter(
        (n) =>
          n.group !== UiNodeGroupEnum.Captcha &&
          ((n.attributes.node_type === 'input' && n.attributes.type === 'hidden') ||
            isUiNodeScriptAttributes(n.attributes)),
      )

      const profileNodes = nodes
        .filter(isNodeVisible)
        .filter(
          (node) =>
            node.group === UiNodeGroupEnum.Default || node.group === UiNodeGroupEnum.Profile,
        )

      const combined = [...profileNodes, ...finalNodes, ...hiddenNodes]
      result = Array.from(new Set(combined)).sort(sortNodes)

      switch (flowType) {
        case OryFlowType.Login: {
          if (authMethods.length > 1) {
            const chooseMethod = BuildChooseMethod({
              ...ctx,
              onClick: () => {
                clearMethod()
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
                clearMethod()
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
      const authMethodAdditionalNodes = getFunctionalNodes(nodes).sort(sortNodes)

      const ssoNodes = nodes
        .filter(isNodeVisible)
        .filter(
          (node) => node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml,
        )

      const hiddenNodes = nodes.filter(
        (n) =>
          n.group !== UiNodeGroupEnum.Captcha &&
          ((n.attributes.node_type === 'input' && n.attributes.type === 'hidden') ||
            isUiNodeScriptAttributes(n.attributes)),
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
      const settingsNodes: FormNode[] = []

      for (const key of sortedGroupKeys) {
        const nodes = visibleGroups[key]
        if (nodes) {
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
