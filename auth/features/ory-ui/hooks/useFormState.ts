import { useReducer, useState } from "react"
import { FlowType, UiNode, UiNodeGroupEnum } from "@ory/client-fetch"

import {
  FlowFormState,
  FormState,
  FormStateAction,
  OryFlowContainer,
} from "../types"
import { isChoosingMethod } from "../utils/flow"
import { nodesToAuthMethodGroups } from "../utils/nodes"

function findMethodWithMessage(nodes?: UiNode[]) {
  return nodes
    ?.filter((n) => !["default", "identifier_first"].includes(n.group))
    ?.find((node) => node.messages?.length > 0)
}

function parseStateFromFlow(flow: OryFlowContainer): FlowFormState {
  switch (flow.flowType) {
    case FlowType.Registration:
    case FlowType.Login: {
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
    case FlowType.Recovery:
    case FlowType.Verification:
      if (flow.flow.active === "code" || flow.flow.active === "link") {
        if (flow.flow.state === "choose_method") {
          return { current: "provide_identifier" }
        }
        return { current: "method_active", method: flow.flow.active }
      }
      break
    case FlowType.Settings:
      return { current: "settings" }
    case FlowType.OAuth2Consent:
      return { current: "method_active", method: "oauth2_consent" }
  }
  console.warn(
    `[Ory/Elements React] Encountered an unknown form state on ${flow.flowType} flow with ID ${flow.flow.id}`,
  )
  throw new Error("Unknown form state")
}

export function useFormState(initialFlow: OryFlowContainer) {
  const initialAction = parseStateFromFlow(initialFlow)
  const [selectedMethod, setSelectedMethod] = useState<
    UiNodeGroupEnum | undefined
  >()
  const [isRedirecting, setRedirecting] = useState(false)
  const [loadingInputs, setLoadingInputs] = useState<Set<UiNodeGroupEnum>>(
    new Set(),
  )

  const formStateReducer = (
    state: FormState,
    action: FormStateAction,
  ): FormState => {
    switch (action.type) {
      case "action_flow_update": {
        if (selectedMethod) {
          setLoadingInputs(new Set())
          return {
            current: "method_active",
            method: selectedMethod,
            isReady: state.isReady,
            isSubmitting: state.isSubmitting,
          }
        }
        const flowFormState = parseStateFromFlow(action.flow)
        return {
          ...flowFormState,
          isReady: state.isReady,
          isSubmitting: state.isSubmitting,
        }
      }
      case "action_select_method": {
        setSelectedMethod(action.method)
        return {
          current: "method_active",
          method: action.method,
          isReady: state.isReady,
          isSubmitting: state.isSubmitting,
        }
      }
      case "action_clear_active_method": {
        return {
          current: "select_method",
          isReady: state.isReady,
          isSubmitting: state.isSubmitting,
        }
      }
      case "form_input_loading": {
        setLoadingInputs((prev) => new Set(prev).add(action.group))
        return {
          ...state,
          isReady: false,
          isSubmitting: state.isSubmitting,
        }
      }
      case "form_input_ready": {
        const newLoadingInputs = new Set(loadingInputs)
        newLoadingInputs.delete(action.input)
        setLoadingInputs(newLoadingInputs)
        return {
          ...state,
          isReady: newLoadingInputs.size === 0,
          isSubmitting: state.isSubmitting,
        }
      }
      case "form_submit_start":
        return {
          ...state,
          isSubmitting: true,
        }
      case "form_submit_end":
        return {
          ...state,
          isSubmitting: isRedirecting,
        }
      case "page_redirect":
        setRedirecting(true)
        return {
          ...state,
          isSubmitting: true,
        }
      default:
        return state
    }
  }

  const [formState, dispatch] = useReducer(formStateReducer, {
    ...initialAction,
    isReady: true,
    isSubmitting: false,
  })

  return { formState, dispatchFormState: dispatch }
}
