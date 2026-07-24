import { OnRedirectHandler } from '@ory/client-fetch'

import { OryFlowType } from './container'
import { OryErrorHandler } from './event'

export type ValidationErrorHandler<T> = (body: T) => void | Promise<void>

export interface FlowErrorHandlerProps<T> {
  onRestartFlow: (useFlowId?: string) => void
  onValidationError: ValidationErrorHandler<T>
  onRedirect: OnRedirectHandler
  config: { sdk: { url: string } }
  flowType: OryFlowType
  onError?: OryErrorHandler
}
