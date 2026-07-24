import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
} from '@ory/client-fetch'

import {
  allGroupEnums,
  authMethodPickerExcludedGroups,
  excludedAuthGroups,
  GroupedNodes,
  isUiNodeInput,
  LoginFlowContainer,
  OryFlowType,
  RegistrationFlowContainer,
  UiNodeInput,
} from '../../types'

export function toAuthMethodPickerOptions(visibleGroups: GroupedNodes): UiNodeGroupEnum[] {
  return Object.values(UiNodeGroupEnum)
    .filter((group) => visibleGroups[group]?.length)
    .filter((group) => !authMethodPickerExcludedGroups.includes(group))
}

export function findCodeIdentifierNode(nodes: UiNode[]): UiNodeInput | undefined {
  return nodes.find((n): n is UiNodeInput => {
    if (!isUiNodeInput(n)) return false
    return (
      (n.group === UiNodeGroupEnum.IdentifierFirst && n.attributes.name === 'identifier') ||
      (n.group === UiNodeGroupEnum.Code && n.attributes.name === 'address')
    )
  })
}

export function findScreenSelectionButton(nodes: UiNode[]) {
  return nodes.find(
    (n): n is UiNodeInput =>
      isUiNodeInput(n) && n.attributes.type === 'submit' && n.attributes.name === 'screen',
  )
}

export function hasCodeField(nodes: UiNode[]): boolean {
  return nodes.some((node) => 'name' in node.attributes && node.attributes.name === 'code')
}

export function isSsoNode(node: UiNode): boolean {
  return node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml
}

export function isResendNode(node: UiNode): boolean {
  if (!isUiNodeInput(node)) return false

  const name = node.attributes.name
  return (
    name === 'resend' ||
    (['email', 'recovery_confirm_address'].includes(name) && node.attributes.type === 'submit')
  )
}

export function isCodeSent(
  nodes: UiNode[],
  formState?: { current?: string; method?: string },
): boolean {
  const codeNode = nodes.find(
    (n) =>
      isUiNodeInput(n) &&
      n.group === 'code' &&
      n.attributes.name === 'code' &&
      n.attributes.type === 'text',
  )

  return !!codeNode && formState?.current === 'method_active' && formState?.method === 'code'
}

export function withoutSingleSignOnNodes(nodes: UiNode[]): UiNode[] {
  return nodes.filter(
    (node) => node.group !== UiNodeGroupEnum.Oidc && node.group !== UiNodeGroupEnum.Saml,
  )
}

export function isUiNodeGroupEnum(method: string): method is UiNodeGroupEnum {
  return allGroupEnums.includes(method as UiNodeGroupEnum)
}

export function isNodeVisible(node: UiNode): node is UiNodeInput {
  if (isUiNodeScriptAttributes(node.attributes)) return false
  if (isUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === 'hidden') return false
  }
  return true
}

function isScreenSelectionNode(node: UiNode): boolean {
  if (
    'name' in node.attributes &&
    node.attributes.name === 'screen' &&
    'value' in node.attributes &&
    node.attributes.value === 'previous'
  ) {
    return true
  }
  if (
    node.group === UiNodeGroupEnum.IdentifierFirst &&
    'name' in node.attributes &&
    node.attributes.name === 'identifier' &&
    node.attributes.type === 'hidden'
  ) {
    return true
  }
  return false
}

export function isChoosingMethod(flow: LoginFlowContainer | RegistrationFlowContainer): boolean {
  if (flow.flowType === OryFlowType.Login) {
    if (flow.flow.requested_aal === 'aal2') {
      return true
    }
    if (flow.flow.refresh && !flow.flow.ui.nodes.some((n) => n.group === 'code')) {
      return true
    }
  }
  return flow.flow.ui.nodes.some(isScreenSelectionNode)
}

export function getFunctionalNodes(nodes: UiNode[]): UiNode[] {
  return nodes.filter((node) => {
    if (!isNodeVisible(node)) {
      return false
    }

    return excludedAuthGroups.includes(node.group)
  })
}

export function getNodeId({ attributes }: UiNode) {
  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.type === 'submit' && attributes.value) {
      return `${attributes.name}:${attributes.value}`
    }
    if (attributes.type === 'checkbox' && attributes.value) {
      return `${attributes.name}:${attributes.value}`
    }
    return attributes.name
  } else {
    return attributes.id
  }
}
