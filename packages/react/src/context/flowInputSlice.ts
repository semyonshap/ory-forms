import type { FlowStoreState } from './oryStore'

import { StateCreator } from 'zustand'
import { OnRedirectHandler } from '@ory/client-fetch'

import {
  FormValues,
  SetExtraNodes,
  OrySuccessHandler,
  OryValidationErrorHandler,
  OryErrorHandler,
} from '../types'

export interface FlowInputSlice {
  onSuccess?: OrySuccessHandler
  onValidationError?: OryValidationErrorHandler
  onError?: OryErrorHandler
  onRedirect: OnRedirectHandler
  transientPayload?: FormValues
  setExtraNodes?: SetExtraNodes
  setTransientField: (key: string, value: FormValues[string]) => void
}

export const createFlowInputSlice =
  (initProps: {
    transientPayload?: FormValues
    setExtraNodes?: SetExtraNodes
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
    transientPayload: initProps.transientPayload,
    setExtraNodes: initProps.setExtraNodes,
    setTransientField: (key, value) =>
      set({
        transientPayload: { ...get().transientPayload, [key]: value },
      }),
  })
