import type { FlowStoreState } from './oryStore'

import { StateCreator } from 'zustand'
import { OnRedirectHandler } from '@ory/client-fetch'

import {
  TransientPayload,
  UiNodeFixed,
  OrySuccessHandler,
  OryValidationErrorHandler,
  OryErrorHandler,
} from '../types'

export interface FlowInputSlice {
  onSuccess?: OrySuccessHandler
  onValidationError?: OryValidationErrorHandler
  onError?: OryErrorHandler
  onRedirect: OnRedirectHandler
  transientPayload: TransientPayload
  extraNodes: UiNodeFixed[]
  setTransientField: (key: string, value: unknown) => void
}

export const createFlowInputSlice =
  (initProps: {
    transientPayload?: TransientPayload
    extraNodes?: UiNodeFixed[]
    onSuccess?: OrySuccessHandler
    onValidationError?: OryValidationErrorHandler
    onError?: OryErrorHandler
    onRedirect?: OnRedirectHandler
  }): StateCreator<FlowStoreState, [], [], FlowInputSlice> =>
  (set, get) => ({
    onSuccess: initProps.onSuccess,
    onValidationError: initProps.onValidationError,
    onError: initProps.onError,
    onRedirect:
      initProps.onRedirect ?? ((url) => window.location.assign(url)),
    transientPayload: initProps.transientPayload ?? {},
    extraNodes: initProps.extraNodes ?? [],
    setTransientField: (key, value) =>
      set({
        transientPayload: { ...get().transientPayload, [key]: value },
      }),
  })
