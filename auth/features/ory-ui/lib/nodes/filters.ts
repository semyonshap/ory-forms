import {
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
} from "@ory/client-fetch"

import {
  allGroupEnums,
  authMethodPickerExcludedGroups,
  excludedAuthGroups,
  GroupedNodes,
  LoginFlowContainer,
  OryFlowType,
  RegistrationFlowContainer,
  UiNodeInput,
} from "../../types"
import { findNode } from "./finder"

export function toAuthMethodPickerOptions(
  visibleGroups: GroupedNodes,
): UiNodeGroupEnum[] {
  return Object.values(UiNodeGroupEnum)
    .filter((group) => visibleGroups[group]?.length)
    .filter((group) => !authMethodPickerExcludedGroups.includes(group))
}

export function findCodeIdentifierNode(
  nodes: UiNode[],
): UiNodeInput | undefined {
  return (findNode(nodes, {
    group: "identifier_first",
    node_type: "input",
    name: "identifier",
  }) ??
    findNode(nodes, {
      group: "code",
      node_type: "input",
      name: "address",
    })) as UiNodeInput | undefined
}

export function findScreenSelectionButton(
  nodes: UiNode[],
): { attributes: UiNodeInputAttributes } | undefined {
  return nodes.find(
    (node) =>
      node.attributes.node_type === "input" &&
      node.attributes.type === "submit" &&
      node.attributes.name === "screen",
  ) as { attributes: UiNodeInputAttributes }
}

export function hasSingleSignOnNodes(nodes: UiNode[]): boolean {
  return nodes.some(
    (node) =>
      node.group === UiNodeGroupEnum.Oidc ||
      node.group === UiNodeGroupEnum.Saml,
  )
}

export function hasCodeField(nodes: UiNode[]): boolean {
  return nodes.some(
    (node) => "name" in node.attributes && node.attributes.name === "code",
  )
}

export function isSsoNode(node: UiNode): boolean {
  return (
    node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml
  )
}

export function isResendNode(node: UiNode): boolean {
  if (!("attributes" in node)) return false
  const attrs = node.attributes
  if (!("name" in attrs)) return false

  const name = attrs.name
  return (
    name === "resend" ||
    (["email", "recovery_confirm_address"].includes(name) &&
      attrs.type === "submit")
  )
}

export function isCodeSent(
  nodes: UiNode[],
  formState?: { current?: string; method?: string },
): boolean {
  const codeNode = findNode(nodes, {
    node_type: "input",
    group: "code",
    name: "code",
    type: "text",
  })
  return (
    !!codeNode &&
    formState?.current === "method_active" &&
    formState?.method === "code"
  )
}

export function withoutSingleSignOnNodes(nodes: UiNode[]): UiNode[] {
  return nodes.filter(
    (node) =>
      node.group !== UiNodeGroupEnum.Oidc &&
      node.group !== UiNodeGroupEnum.Saml,
  )
}

export function isUiNodeGroupEnum(method: string): method is UiNodeGroupEnum {
  return allGroupEnums.includes(method as UiNodeGroupEnum)
}

export function isNodeVisible(node: UiNode): node is UiNodeInput {
  if (isUiNodeScriptAttributes(node.attributes)) return false
  if (isUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === "hidden") return false
  }
  return true
}

export function isIgnoredInputNode(node: UiNodeInput): boolean {
  return (
    ("name" in node.attributes && node.attributes.name === "screen") ||
    node.group === UiNodeGroupEnum.Oauth2Consent
  )
}

function isScreenSelectionNode(node: UiNode): boolean {
  if (
    "name" in node.attributes &&
    node.attributes.name === "screen" &&
    "value" in node.attributes &&
    node.attributes.value === "previous"
  ) {
    return true
  }
  if (
    node.group === UiNodeGroupEnum.IdentifierFirst &&
    "name" in node.attributes &&
    node.attributes.name === "identifier" &&
    node.attributes.type === "hidden"
  ) {
    return true
  }
  return false
}

export function isChoosingMethod(
  flow: LoginFlowContainer | RegistrationFlowContainer,
): boolean {
  if (flow.flowType === OryFlowType.Login) {
    if (flow.flow.requested_aal === "aal2") {
      return true
    }
    if (
      flow.flow.refresh &&
      !flow.flow.ui.nodes.some((n) => n.group === "code")
    ) {
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
    if (attributes.type === "submit" && attributes.value) {
      return `${attributes.name}:${attributes.value}`
    }
    return attributes.name
  } else {
    return attributes.id
  }
}
