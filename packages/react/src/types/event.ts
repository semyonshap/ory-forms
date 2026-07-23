import {
  ErrorFlowReplaced,
  GenericError,
  Identity,
  LoginFlow,
  OAuth2ConsentRequest,
  RecoveryFlow,
  RegistrationFlow,
  SelfServiceFlowExpiredError,
  Session,
  SettingsFlow,
  VerificationFlow,
} from "@ory/client-fetch"
import { OryFlowType } from "./container"

export type OryLoginSuccessEvent = {
  flowType: OryFlowType.Login
  flow: LoginFlow
  session: Session
  method: string
}

export type OryRegistrationSuccessEvent = {
  flowType: OryFlowType.Registration
  flow: RegistrationFlow
  identity: Identity
  session?: Session
  method: string
}

export type OryVerificationSuccessEvent = {
  flowType: OryFlowType.Verification
  flow: VerificationFlow
  method: string
}

export type OryRecoverySuccessEvent = {
  flowType: OryFlowType.Recovery
  flow: RecoveryFlow
  method: string
}

export type OrySettingsSuccessEvent = {
  flowType: OryFlowType.Settings
  flow: SettingsFlow
  method: string
}

export type OryConsentSuccessEvent = {
  flowType: OryFlowType.OAuth2Consent
  consentRequest: OAuth2ConsentRequest
}

export type OrySuccessEvent =
  | OryLoginSuccessEvent
  | OryRegistrationSuccessEvent
  | OryVerificationSuccessEvent
  | OryRecoverySuccessEvent
  | OrySettingsSuccessEvent
  | OryConsentSuccessEvent

export type OryValidationErrorEvent =
  | { flowType: OryFlowType.Login; flow: LoginFlow }
  | { flowType: OryFlowType.Registration; flow: RegistrationFlow }
  | { flowType: OryFlowType.Verification; flow: VerificationFlow }
  | { flowType: OryFlowType.Recovery; flow: RecoveryFlow }
  | { flowType: OryFlowType.Settings; flow: SettingsFlow }

export type OryErrorEvent =
  | {
      type: "flow_expired"
      flowType: OryFlowType
      body: SelfServiceFlowExpiredError
    }
  | { type: "csrf_error"; flowType: OryFlowType; body: GenericError }
  | { type: "flow_not_found"; flowType: OryFlowType }
  | { type: "flow_replaced"; flowType: OryFlowType; body: ErrorFlowReplaced }
  | {
      type: "consent_error"
      flowType: OryFlowType.OAuth2Consent
      consentRequest: OAuth2ConsentRequest
    }

export type OrySuccessHandler = (event: OrySuccessEvent) => void | Promise<void>

export type OryValidationErrorHandler = (
  event: OryValidationErrorEvent,
) => void | Promise<void>

export type OryErrorHandler = (event: OryErrorEvent) => void | Promise<void>
