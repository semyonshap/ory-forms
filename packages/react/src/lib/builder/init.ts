import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { groupBy } from 'lodash-es'

import {
  excludedAuthMethods,
  BuildContext,
  BuilderSorter,
  excludedAuthGroups,
  FormNode,
  OryFlowType,
  TransientPayload,
} from '../../types'
import {} from '../nodes/presets'
import {
  groupNodes,
  isNodeVisible,
  createDivGroup,
  BuildDivider,
  BuildCaptcha,
  BuildTransientPayload,
} from '../nodes'

import { BuildAuthMethodList } from './authMethods'
import { NodeDataBuilder } from './data'
import { buildFooter } from './footer'
import { SettingsBuilder } from './settings'

export function Builder(
  ctx: BuildContext,
  { nodeSorter, groupSorter }: BuilderSorter,
  transientPayload: TransientPayload,
) {
  const sortNodes = (a: UiNode, b: UiNode) =>
    nodeSorter(a, b, { flowType })
  const sortGroups = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) =>
    groupSorter(a, b)

  const { config, flowContainer, formState, t } = ctx
  const { captcha } = config.project

  const { flow, flowType } = flowContainer
  const flowNodes = flow.ui.nodes
  if (!flowNodes) return []

  const nodes = NodeDataBuilder({ nodes: flowNodes })

  if (
    captcha &&
    captcha.includes(flowType) &&
    !transientPayload.captcha_turnstile_response
  ) {
    nodes.push(BuildCaptcha())
  }

  if (Object.keys(transientPayload).length > 0) {
    nodes.push(BuildTransientPayload(transientPayload))
  }

  nodes.sort(sortNodes)

  let result: FormNode[] = []

  const grouped = groupBy(nodes, (node) => {
    const group = node.group
    if (group === UiNodeGroupEnum.Captcha) return 'captcha'

    const visible = isNodeVisible(node)
    const isSso =
      (group === UiNodeGroupEnum.Oidc || group === UiNodeGroupEnum.Saml) &&
      visible

    if (isSso) return 'sso'
    if (!visible) return 'hidden'
    return 'visible'
  })

  const ssoNodes = grouped.sso ?? []
  const hiddenNodes = grouped.hidden ?? []
  const visibleNodes = grouped.visible ?? []
  const captchaNodes = grouped.captcha ?? []

  const { groups: visibleGroups, groupsNodes: visibleGroupsNodes } =
    groupNodes({ nodes })

  const { groups: authMethods } = groupNodes({
    nodes,
    excludeGroups: excludedAuthMethods,
    excludeHidden: false,
  })

  switch (formState.current) {
    case 'provide_identifier': {
      const withoutPasskey = visibleNodes.filter(
        (node) => node.group !== UiNodeGroupEnum.Passkey,
      )

      if (ssoNodes.length > 0) {
        result.push(...ssoNodes)
        if (withoutPasskey.length > 0) {
          result.push(BuildDivider())
        }
      }

      result.push(
        ...[...hiddenNodes, ...withoutPasskey, ...captchaNodes].sort(
          sortNodes,
        ),
      )

      break
    }
    case 'method_active': {
      const selectedNodes = visibleNodes.filter(
        (node) => node.group === formState.method,
      )

      const profileNodes = visibleNodes.filter(
        (node) =>
          node.group === UiNodeGroupEnum.Default ||
          node.group === UiNodeGroupEnum.Profile,
      )

      result = [
        ...profileNodes,
        ...captchaNodes,
        ...selectedNodes,
        ...hiddenNodes,
      ].sort(sortNodes)
      break
    }
    case 'select_method': {
      const authMethodAdditionalNodes = visibleNodes.filter((node) =>
        excludedAuthGroups.includes(node.group),
      )

      result = [...authMethodAdditionalNodes, ...ssoNodes, ...hiddenNodes]

      const methodButtons = BuildAuthMethodList({
        groups: authMethods,
        ctx,
      })

      if (methodButtons) result.push(BuildDivider(), ...methodButtons)

      break
    }
    case 'settings': {
      const sortedGroupKeys = visibleGroups.sort(sortGroups)
      const { groupsNodes: hiddenGroupsNodes } = groupNodes({
        nodes: hiddenNodes,
        excludeHidden: false,
        excludeScripts: false,
      })

      const settingsNodes: FormNode[] = []

      for (let i = 0; i < sortedGroupKeys.length; i++) {
        const key = sortedGroupKeys[i]
        const groupNodes = visibleGroupsNodes[key] ?? []
        const hiddenNodesByGroup = [
          ...(hiddenGroupsNodes[UiNodeGroupEnum.Default] ?? []),
          ...(hiddenGroupsNodes[key] ?? []),
        ]
        groupNodes.push(...hiddenNodesByGroup)

        if (groupNodes.length > 0) {
          if (i > 0) {
            settingsNodes.push(
              ...createDivGroup({
                id: `settings-divider-${key}`,
                data: { variant: 'settings-divider' },
                children: [BuildDivider()],
              }),
            )
          }
          settingsNodes.push(...SettingsBuilder(key, groupNodes, t, nodes))
        }
      }

      settingsNodes.push(
        ...Object.entries(hiddenGroupsNodes).flatMap(
          ([group, groupNodes]) =>
            sortedGroupKeys.includes(group as UiNodeGroupEnum)
              ? []
              : groupNodes,
        ),
      )

      result = settingsNodes
      break
    }
    default:
      result = nodes
  }

  if (flowType !== OryFlowType.Settings) {
    result.push(...buildFooter(ctx, authMethods))

    result = createDivGroup({
      id: 'form-card',
      data: {
        type: 'Card',
      },
      children: result,
    })
  }

  return result
}
