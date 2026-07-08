import {
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

export enum OryFlowType {
  Login = "login",
  Registration = "registration",
  Recovery = "recovery",
  Verification = "verification",
  Settings = "settings",
  OAuth2Consent = "oauth2_consent",
  Error = "error",
}

export type LoginFlowContainer = {
  flowType: OryFlowType.Login
  flow: LoginFlow
}

export type RegistrationFlowContainer = {
  flowType: OryFlowType.Registration
  flow: RegistrationFlow
}

export type RecoveryFlowContainer = {
  flowType: OryFlowType.Recovery
  flow: RecoveryFlow
}

export type VerificationFlowContainer = {
  flowType: OryFlowType.Verification
  flow: VerificationFlow
}

export type SettingsFlowContainer = {
  flowType: OryFlowType.Settings
  flow: SettingsFlow
}

export type ConsentFlow = {
  id: "UNSET"
  active: "oauth2_consent"
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
}

export type ConsentFlowContainer = {
  flowType: OryFlowType.OAuth2Consent
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
