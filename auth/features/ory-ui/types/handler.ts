import {
  ContinueWith,
  ErrorBrowserLocationChangeRequired,
  GenericErrorContent,
  OnRedirectHandler,
  SelfServiceFlowExpiredError,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from "@ory/client-fetch"
import { OryFlowContainer } from "./container"
import {
  OryErrorHandler,
  OrySuccessHandler,
  OryValidationErrorHandler,
} from "./event"

export type OnSubmitHandlerProps<
  T extends
    | UpdateLoginFlowBody
    | UpdateRegistrationFlowBody
    | UpdateVerificationFlowBody
    | UpdateRecoveryFlowBody
    | UpdateSettingsFlowBody,
> = {
  setFlowContainer: (flowContainer: OryFlowContainer) => void
  body: T
  onRedirect: OnRedirectHandler
  onSuccess?: OrySuccessHandler
  onValidationError?: OryValidationErrorHandler
  onError?: OryErrorHandler
}