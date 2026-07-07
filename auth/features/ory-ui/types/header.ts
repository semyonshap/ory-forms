import {
  AuthenticatorAssuranceLevel,
  OAuth2ConsentRequest,
  Session,
} from "@ory/client-fetch"
import { FormState, OryFlowType } from "."

export type HeaderLoginOptions = {
  flowType: OryFlowType.Login
  flow: {
    refresh?: boolean
    requested_aal?: AuthenticatorAssuranceLevel
  }
  formState?: FormState
}

export type HeaderRegistrationOptions = {
  flowType: OryFlowType.Registration
  formState?: FormState
}

export type HeaderOAuth2ConsentRequestOptions = {
  flowType: OryFlowType.OAuth2Consent
  flow: {
    consent_request: OAuth2ConsentRequest
    session: Session
  }
}

export type HeaderOptions =
  | HeaderLoginOptions
  | HeaderRegistrationOptions
  | HeaderOAuth2ConsentRequestOptions
  | {
      flowType:
        | OryFlowType.Error
        | OryFlowType.Verification
        | OryFlowType.Recovery
        | OryFlowType.Settings
    }
