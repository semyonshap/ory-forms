import {
  AuthenticatorAssuranceLevel,
  OAuth2ConsentRequest,
  OAuth2LogoutRequest,
  Session,
} from '@ory/client-fetch'
import { FormState, OryError, OryFlowType } from '.'

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

export type HeaderOAuth2ConsentOptions = {
  flowType: OryFlowType.OAuth2Consent
  flow: {
    consent_request: OAuth2ConsentRequest
    session: Session
  }
}

export type HeaderOAuth2LogoutOptions = {
  flowType: OryFlowType.OAuth2Logout
  flow: {
    logout_request: OAuth2LogoutRequest
  }
}

export type HeaderNavigationOptions = {
  flowType: OryFlowType.Navigation
  flow: {
    session: Session | null
  }
}

export type HeaderErrorOptions = {
  flowType: OryFlowType.Error
  flow: {
    error: OryError
  }
}

export type HeaderOptions =
  | HeaderLoginOptions
  | HeaderRegistrationOptions
  | HeaderOAuth2ConsentOptions
  | HeaderOAuth2LogoutOptions
  | HeaderNavigationOptions
  | HeaderErrorOptions
  | {
      flowType: OryFlowType.Verification | OryFlowType.Recovery | OryFlowType.Settings
    }
