import { createStore } from 'zustand'
import { createContext } from 'react'

import { parseStateFromFlow } from '../lib/form/formState'
import { createFlowStateSlice, FlowStateSlice } from './flowStateSlice'
import { createFlowInputSlice, FlowInputSlice } from './flowInputSlice'
import {
  OryConfiguration,
  OryFlowContainer,
  OryComponents,
  UiNodeFixed,
  MessageProps,
  TransientPayload,
} from '../types'

export interface FlowStoreState extends FlowStateSlice, FlowInputSlice {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  messages: MessageProps[]
  webauthnScriptStatus?: 'loading' | 'loaded' | 'failed'

  setFlowContainer: (flow: OryFlowContainer) => void
  setWebauthnScriptStatus: (
    status: 'loading' | 'loaded' | 'failed',
  ) => void
  setMessages: (messages: MessageProps[]) => void
}

export type FlowStore = ReturnType<typeof createFlowStore>

export const createFlowStore = (initProps: {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  transientPayload?: TransientPayload
  extraNodes?: UiNodeFixed[]
  onSuccess?: FlowInputSlice['onSuccess']
  onValidationError?: FlowInputSlice['onValidationError']
  onError?: FlowInputSlice['onError']
  onRedirect?: FlowInputSlice['onRedirect']
}) => {
  const store = createStore<FlowStoreState>()((set, get, api) => ({
    config: initProps.config,
    components: initProps.components,
    flowContainer: initProps.flowContainer,
    ...createFlowInputSlice(initProps)(set, get, api),
    ...createFlowStateSlice(parseStateFromFlow(initProps.flowContainer))(
      set,
      get,
      api,
    ),
    messages: [],
    webauthnScriptStatus: undefined,
    setFlowContainer: (flow) => {
      set({
        messages: [],
        flowContainer: flow,
        loadingInputs: new Set(),
        overrideState: undefined,
        webauthnScriptStatus: undefined,
      })
    },
    setMessages: (messages) => set({ messages }),
    setWebauthnScriptStatus: (status) =>
      set({ webauthnScriptStatus: status }),
  }))
  return store
}

export const FlowStoreContext = createContext<FlowStore | null>(null)
