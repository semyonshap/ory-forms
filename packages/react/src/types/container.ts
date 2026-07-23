import {
  LoginFlow,
  OAuth2ConsentRequest,
  OAuth2LogoutRequest,
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
  OAuth2Logout = "oauth2_logout",
  Error = "error",
  Navigation = "navigation",
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

export type OAuth2ConsentFlowContainer = {
  flowType: OryFlowType.OAuth2Consent
  flow: OAuth2ConsentFlow
}

export type OAuth2LogoutFlowContainer = {
  flowType: OryFlowType.OAuth2Logout
  flow: OAuth2LogoutFlow
}

export type NavigationFlowContainer = {
  flowType: OryFlowType.Navigation
  flow: NavigationFlow
}

export type ErrorFlowContainer = {
  flowType: OryFlowType.Error
  flow: ErrorFlow
}

export type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
  | NavigationFlowContainer
  | OAuth2ConsentFlowContainer
  | OAuth2LogoutFlowContainer
  | ErrorFlowContainer

export type OryFlowContainerWithState = OryFlowContainer & {
  formState: FormState
}

export type OAuth2ConsentFlow = {
  id: "UNSET"
  active: "oauth2_consent"
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
}

export type OAuth2LogoutFlow = {
  id: "UNSET"
  active: "oauth2_logout"
  ui: UiContainer
  return_to?: string
  logout_request: OAuth2LogoutRequest
}

export type NavigationFlow = {
  id: "UNSET"
  active: "navigation"
  ui: UiContainer
  session: Session | null
  return_to?: string
}

export type ErrorFlow = {
  id: string
  active: "error"
  ui: UiContainer
  error: OryError
  session: Session | null
  return_to?: string
}

export type OryError = {
  code: number
  message?: string
  status?: string
  reason?: string
  id?: string
  timestamp?: Date
  correlationId?: string
}
