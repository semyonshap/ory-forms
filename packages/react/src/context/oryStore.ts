import { createStore } from 'zustand'
import { createContext } from 'react'
import { UiNode } from '@ory/client-fetch'

import { parseStateFromFlow } from '../lib/form/formState'
import { createFlowStateSlice, FlowStateSlice } from './flowStateSlice'
import { createFlowInputSlice, FlowInputSlice } from './flowInputSlice'
import {
  OryConfiguration,
  OryFlowContainer,
  OryComponents,
  SetExtraNodes,
  MessageProps,
  FormValues,
} from '../types'

export interface FlowStoreState extends FlowStateSlice, FlowInputSlice {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  messages: MessageProps[]
  flowNodes: UiNode[]
  webauthnScriptStatus?: 'loading' | 'loaded' | 'failed'

  setFlowContainer: (flow: OryFlowContainer) => void
  setFlowNodes: (nodes: UiNode[]) => void
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
  transientPayload?: FormValues
  setExtraNodes?: SetExtraNodes
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
    flowNodes: [],
    webauthnScriptStatus: undefined,
    setFlowContainer: (flow) => {
      set({
        messages: [],
        flowContainer: flow,
        flowNodes: [],
        loadingInputs: new Set(),
        overrideState: undefined,
        webauthnScriptStatus: undefined,
      })
    },
    setFlowNodes: (nodes) => set({ flowNodes: nodes }),
    setMessages: (messages) => set({ messages }),
    setWebauthnScriptStatus: (status) =>
      set({ webauthnScriptStatus: status }),
  }))
  return store
}

export const FlowStoreContext = createContext<FlowStore | null>(null)
