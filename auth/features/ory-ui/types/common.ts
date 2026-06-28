import {
  LoginFlow,
  RecoveryFlow,
  RegistrationFlow,
  SettingsFlow,
  UiNodeGroupEnum,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
  VerificationFlow,
} from "@ory/client-fetch"
import { OryClientConfiguration } from "./config"
import { OryFlowContainer } from "./container"

export type FlowInputOptions = {
  only?: FlowMethod
}

export type FlowInputProps = {
  config: OryClientConfiguration
  flow: OryFlowContainer
  options?: FlowInputOptions
}

export type AnyFlow =
  | LoginFlow
  | RegistrationFlow
  | RecoveryFlow
  | VerificationFlow
  | SettingsFlow

export type FlowTypes =
  | LoginFlow
  | RegistrationFlow
  | SettingsFlow
  | VerificationFlow
  | RecoveryFlow

export type FlowValues = Partial<
  | UpdateLoginFlowBody
  | UpdateRegistrationFlowBody
  | UpdateRecoveryFlowBody
  | UpdateSettingsFlowBody
  | UpdateVerificationFlowBody
>

export type FlowMethod =
  | "oidc"
  | "password"
  | "profile"
  | "totp"
  | "webauthn"
  | "passkey"
  | "link"
  | "lookup_secret"
