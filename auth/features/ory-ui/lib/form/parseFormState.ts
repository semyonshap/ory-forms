import { UiNode } from "@ory/client-fetch"

import { isChoosingMethod, nodesToAuthMethodGroups } from "../nodes"
import { FlowFormState, OryFlowContainer, OryFlowType } from "../../types"

function findMethodWithMessage(nodes?: UiNode[]) {
  return nodes
    ?.filter((n) => !["default", "identifier_first"].includes(n.group))
    ?.find((node) => node.messages?.length > 0)
}

export function parseStateFromFlow(flow: OryFlowContainer): FlowFormState {
  switch (flow.flowType) {
    case OryFlowType.Registration:
    case OryFlowType.Login: {
      const methodWithMessage = findMethodWithMessage(flow.flow.ui.nodes)
      if (flow.flow.active == "link_recovery") {
        return { current: "method_active", method: "link" }
      } else if (flow.flow.active == "code_recovery") {
        return { current: "method_active", method: "code" }
      } else if (methodWithMessage) {
        return { current: "method_active", method: methodWithMessage.group }
      } else if (flow.flow.ui.messages?.some((m) => m.id === 1010016)) {
        return { current: "select_method" }
      } else if (
        flow.flow.active &&
        !["default", "identifier_first"].includes(flow.flow.active)
      ) {
        return { current: "method_active", method: flow.flow.active }
      } else if (isChoosingMethod(flow)) {
        const authMethods = nodesToAuthMethodGroups(flow.flow.ui.nodes)
        if (
          authMethods.length === 1 &&
          !["code", "passkey"].includes(authMethods[0])
        ) {
          return { current: "method_active", method: authMethods[0] }
        }
        return { current: "select_method" }
      }
      return { current: "provide_identifier" }
    }
    case OryFlowType.Recovery:
    case OryFlowType.Verification:
      if (flow.flow.active === "code" || flow.flow.active === "link") {
        if (flow.flow.state === "choose_method") {
          return { current: "provide_identifier" }
        }
        return { current: "method_active", method: flow.flow.active }
      }
      break
    case OryFlowType.Settings:
      return { current: "settings" }
    case OryFlowType.OAuth2Consent:
      return { current: "method_active", method: "oauth2_consent" }
  }
  console.warn(
    `[Ory/Elements React] Encountered an unknown form state on ${flow.flowType} flow with ID ${flow.flow.id}`,
  )
  throw new Error("Unknown form state")
}
