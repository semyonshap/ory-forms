import {
  FlowType,
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client-fetch"

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

export type OAuth2ConsentFlowContainer = {
  flowType: FlowType.OAuth2Consent
  flow: SettingsFlow
}

export type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
  | OAuth2ConsentFlowContainer
