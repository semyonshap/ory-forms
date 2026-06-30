import {
  AuthenticatorAssuranceLevel,
  FlowType,
  OAuth2ConsentRequest,
  Session,
} from "@ory/client-fetch"
import { FormState } from "."

export type CardHeaderTextOptions =
  | {
      flowType: FlowType.Login
      flow: {
        refresh?: boolean
        requested_aal?: AuthenticatorAssuranceLevel
      }
      formState?: FormState
    }
  | {
      flowType: FlowType.Registration
      formState?: FormState
    }
  | {
      flowType: FlowType.OAuth2Consent
      flow: {
        consent_request: OAuth2ConsentRequest
        session: Session
      }
    }
  | {
      flowType:
        | FlowType.Error
        | FlowType.Verification
        | FlowType.Recovery
        | FlowType.Settings
    }
