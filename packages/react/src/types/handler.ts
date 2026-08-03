import {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from '@ory/client-fetch'

import { OryFlowContainer } from './container'
import {
  OryErrorHandler,
  OrySuccessHandler,
  OryValidationErrorHandler,
} from './event'

export interface OnSubmitHandlerProps<T> {
  body: T
  onRedirect: OnRedirectHandler
  onSuccess?: OrySuccessHandler
  onValidationError?: OryValidationErrorHandler
  onError?: OryErrorHandler
}

export type OnSubmitHandlerPropsWithFlow<
  T extends
    | UpdateLoginFlowBody
    | UpdateRegistrationFlowBody
    | UpdateVerificationFlowBody
    | UpdateRecoveryFlowBody
    | UpdateSettingsFlowBody,
> = OnSubmitHandlerProps<T> & {
  setFlowContainer: (flowContainer: OryFlowContainer) => void
}
