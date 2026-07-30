import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'

import { BuildFooter } from './footer'
import { BuildNodeData } from './data'
import { SettingsBuilder } from './settings'
import { BuildAuthMethodList } from './authMethods'
import {
  BuildDivider,
  BuildCaptcha,
  BuildTransientPayload,
} from './presets'
import {
  groupNodes,
  isNodeVisible,
  createDivGroup,
  getNodesByGroups,
} from '../nodes'
import {
  BuildContext,
  BuilderSorter,
  FormNode,
  OryFlowType,
  TransientPayload,
  UiNodeFixed,
} from '../../types'

export function BuildLayout(
  ctx: BuildContext,
  { nodeSorter, groupSorter }: BuilderSorter,
  transientPayload: TransientPayload,
  extraNodes: UiNodeFixed[],
) {
  const sortNodes = (a: UiNode, b: UiNode) =>
    nodeSorter(a, b, { flowType })
  const sortGroups = (a: UiNodeGroupEnum, b: UiNodeGroupEnum) =>
    groupSorter(a, b)

  const { config, flowContainer, formState, t } = ctx
  const { captcha } = config.project

  const { flow, flowType } = flowContainer
  
  const flowNodes = flow.ui.nodes
  flowNodes.push(...extraNodes)

  if (!flowNodes) return []

  const nodes = BuildNodeData(flowNodes)

  const hasCaptchaNode = flowNodes.some(
    (n) => n.group === UiNodeGroupEnum.Captcha,
  )

  const captchaToken = transientPayload.captcha_turnstile_response

  if (
    captcha &&
    captcha.includes(flowType) &&
    !hasCaptchaNode &&
    !captchaToken
  ) {
    nodes.push(BuildCaptcha())
  }

  if (Object.keys(transientPayload).length > 0) {
    nodes.push(BuildTransientPayload(transientPayload))
  }

  let result: FormNode[] = []

  const hiddenNodes = nodes.filter((n) => !isNodeVisible(n))

  // Visible Groups
  const { groups: visibleGroups, groupsNodes: visibleGroupsNodes } =
    groupNodes({ nodes, excludeHidden: true, excludeScripts: true })

  const ssoNodes = getNodesByGroups({
    groupsNodes: visibleGroupsNodes,
    groups: [UiNodeGroupEnum.Oidc, UiNodeGroupEnum.Saml],
  })

  // Hidden Groups

  const { groupsNodes: hiddenGroupsNodes } = groupNodes({
    nodes: hiddenNodes,
  })

  const { groups: authMethods } = groupNodes({
    nodes,
    excludeGroups: [
      UiNodeGroupEnum.Oidc,
      UiNodeGroupEnum.Saml,
      UiNodeGroupEnum.Default,
      UiNodeGroupEnum.IdentifierFirst,
      UiNodeGroupEnum.Profile,
      UiNodeGroupEnum.Captcha,
    ],
    excludeScripts: true,
  })

  switch (formState.current) {
    case 'provide_identifier': {
      const selectedNodes = getNodesByGroups({
        groupsNodes: visibleGroupsNodes,
        groups: [
          UiNodeGroupEnum.Passkey,
          UiNodeGroupEnum.Oidc,
          UiNodeGroupEnum.Saml,
        ],
        exclude: true,
      })

      if (ssoNodes.length > 0) {
        result.push(...ssoNodes)
        if (selectedNodes.length > 0) {
          result.push(BuildDivider())
        }
      }

      result.push(...[...hiddenNodes, ...selectedNodes].sort(sortNodes))

      break
    }
    case 'method_active': {
      if (formState.method === UiNodeGroupEnum.Password) {
        const profileNodes = getNodesByGroups({
          groupsNodes: visibleGroupsNodes,
          groups: [UiNodeGroupEnum.Default, UiNodeGroupEnum.Profile],
        })

        result.push(...profileNodes)
      }

      const selectedNodes = getNodesByGroups({
        groupsNodes: visibleGroupsNodes,
        groups: [formState.method],
      })

      result.push(...selectedNodes, ...hiddenNodes)
      result.sort(sortNodes)
      break
    }
    case 'select_method': {
      const selectedHidden = getNodesByGroups({
        groupsNodes: hiddenGroupsNodes,
        groups: [UiNodeGroupEnum.Captcha],
        exclude: true,
      })
      result = [...ssoNodes, ...selectedHidden]

      const methodButtons = BuildAuthMethodList({
        authMethods,
        ctx,
      })

      if (methodButtons) result.push(BuildDivider(), ...methodButtons)

      break
    }
    case 'settings': {
      const sortedGroupKeys = visibleGroups.sort(sortGroups)
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
      result = nodes.sort(sortNodes)
  }

  if (flowType !== OryFlowType.Settings) {
    result.push(...BuildFooter(ctx, authMethods))

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
