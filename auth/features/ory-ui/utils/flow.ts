import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { isUiNodeGroupEnum } from "./nodes"
import { Dispatch } from "react"
import {
  FormStateAction,
  GroupedNodes,
  LoginFlowContainer,
  RegistrationFlowContainer,
} from "../types"

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
  if (flow.flowType === FlowType.Login) {
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

export function getFinalNodes(
  uniqueGroups: GroupedNodes,
  selectedGroup: UiNodeGroupEnum | undefined,
): UiNode[] {
  const selectedNodes: UiNode[] = selectedGroup
    ? (uniqueGroups[selectedGroup] ?? [])
    : []

  return [
    ...(uniqueGroups?.identifier_first ?? []),
    ...(uniqueGroups?.default ?? []),
    ...(uniqueGroups?.captcha ?? []),
  ]
    .flat()
    .filter(
      (node) => "type" in node.attributes && node.attributes.type === "hidden",
    )
    .concat(selectedNodes)
}

export const handleAfterFormSubmit =
  (dispatchFormState: Dispatch<FormStateAction>) => (method: unknown) => {
    if (typeof method !== "string" || !isUiNodeGroupEnum(method)) {
      return
    }

    if (isGroupImmediateSubmit(method)) {
      dispatchFormState({
        type: "action_select_method",
        method: method,
      })
    }
  }

function isGroupImmediateSubmit(group: string): boolean {
  return group === "code"
}
