import {
  FlowType,
  LoginFlow,
  OAuth2ConsentRequest,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  UiContainer,
  VerificationFlow,
} from "@ory/client-fetch"
import { FormState } from "."
import { Dispatch } from "react"

export type LoginFlowContainer = {
  flowType: FlowType.Login
  flow: LoginFlow
}

export type RegistrationFlowContainer = {
  flowType: FlowType.Registration
  flow: RegistrationFlow
}

export type RecoveryFlowContainer = {
  flowType: FlowType.Recovery
  flow: RecoveryFlow
}

export type VerificationFlowContainer = {
  flowType: FlowType.Verification
  flow: VerificationFlow
}

export type SettingsFlowContainer = {
  flowType: FlowType.Settings
  flow: SettingsFlow
}

export type ConsentFlow = {
  created_at: Date
  expires_at: Date
  id: "UNSET"
  issued_at: Date
  state: "show_form" | "rejected" | "accepted"
  active: "oauth2_consent"
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
}

export type ConsentFlowContainer = {
  flowType: FlowType.OAuth2Consent
  flow: ConsentFlow
}

export type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
  | ConsentFlowContainer

export type OryFlowContainerWithState = OryFlowContainer & {
  formState: FormState
}
