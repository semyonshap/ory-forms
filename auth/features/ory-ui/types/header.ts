import {
  AuthenticatorAssuranceLevel,
  OAuth2ConsentRequest,
  Session,
} from "@ory/client-fetch"
import { FormState, OryFlowType } from "."

export type CardHeaderTextOptions =
  | {
      flowType: OryFlowType.Login
      flow: {
        refresh?: boolean
        requested_aal?: AuthenticatorAssuranceLevel
      }
      formState?: FormState
    }
  | {
      flowType: OryFlowType.Registration
      formState?: FormState
    }
  | {
      flowType: OryFlowType.OAuth2Consent
      flow: {
        consent_request: OAuth2ConsentRequest
        session: Session
      }
    }
  | {
      flowType:
        | OryFlowType.Error
        | OryFlowType.Verification
        | OryFlowType.Recovery
        | OryFlowType.Settings
    }
