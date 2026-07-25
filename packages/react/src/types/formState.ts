import { UiNodeGroupEnum } from '@ory/client-fetch'

export type FlowFormState =
  | { current: 'method_active'; method: UiNodeGroupEnum }
  | { current: 'select_method' }
  | { current: 'provide_identifier' }
  | { current: 'success_screen' }
  | { current: 'settings' }
  | { current: 'navigation' }
  | { current: 'error' }

export type FormState = FlowFormState & {
  isReady: boolean
}
