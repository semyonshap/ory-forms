import { UiNodeGroupEnum } from "@ory/client-fetch"
import { OryFlowContainer } from "./container"

export type FormStateSelectMethod = { current: "select_method" }
export type FormStateProvideIdentifier = { current: "provide_identifier" }
export type FormStateMethodActive = {
  current: "method_active"
  method: UiNodeGroupEnum
}

export type FlowFormState =
  | FormStateSelectMethod
  | FormStateProvideIdentifier
  | FormStateMethodActive
  | { current: "success_screen" }
  | { current: "settings" }

type CommonFormStateProperties = {
  isSubmitting: boolean
  isReady: boolean
  selectedMethod?: UiNodeGroupEnum
  loadingInputs: Set<UiNodeGroupEnum>
  isRedirecting: boolean
}

export type FormState = FlowFormState & CommonFormStateProperties

export type FormStateAction =
  | {
      type: "action_flow_update"
      flow: OryFlowContainer
    }
  | {
      type: "action_select_method"
      method: UiNodeGroupEnum
    }
  | {
      type: "action_clear_active_method"
    }
  | {
      type: "form_input_loading"
      group: UiNodeGroupEnum
    }
  | {
      type: "form_input_ready"
      input: UiNodeGroupEnum
    }
  | {
      type: "form_submit_start"
    }
  | {
      type: "form_submit_end"
    }
  | {
      type: "page_redirect"
    }
