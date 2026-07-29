import { createStore } from 'zustand'
import { createContext } from 'react'
import { UiNodeGroupEnum } from '@ory/client-fetch'

import {
  OryConfiguration,
  OryFlowContainer,
  OryComponents,
  FlowFormState,
  MessageProps,
  TransientPayload,
} from '../types'

export interface FlowStoreState {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  overrideState?: FlowFormState
  selectedMethod?: UiNodeGroupEnum
  loadingInputs: Set<UiNodeGroupEnum>
  messages: MessageProps[]
  transientPayload: TransientPayload
  webauthnScriptStatus?: 'loading' | 'loaded' | 'failed'

  setFlowContainer: (flow: OryFlowContainer) => void
  setWebauthnScriptStatus: (
    status: 'loading' | 'loaded' | 'failed',
  ) => void
  setOverrideState: (state?: FlowFormState) => void
  selectMethod: (method?: UiNodeGroupEnum) => void
  inputLoading: (group: UiNodeGroupEnum) => void
  inputReady: (input: UiNodeGroupEnum) => void
  setMessages: (messages: MessageProps[]) => void
  setTransientPayload: (payload: TransientPayload) => void
}

export type FlowStore = ReturnType<typeof createFlowStore>

export const createFlowStore = (initProps: {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  transientPayload?: TransientPayload
}) => {
  return createStore<FlowStoreState>((set) => ({
    ...initProps,
    selectedMethod: undefined,
    overrideState: undefined,
    loadingInputs: new Set(),
    messages: [],
    transientPayload: initProps.transientPayload ?? {},
    webauthnScriptStatus: undefined,

    setFlowContainer: (flow) => {
      set({
        overrideState: undefined,
        messages: [],
        flowContainer: flow,
        loadingInputs: new Set(),
        webauthnScriptStatus: undefined,
      })
    },

    selectMethod: (method) =>
      set({ selectedMethod: method, overrideState: undefined }),

    setOverrideState: (state) => {
      set({ overrideState: state })
    },

    inputLoading: (group) => {
      set((state) => {
        const next = new Set(state.loadingInputs)
        next.add(group)
        return { loadingInputs: next }
      })
    },

    inputReady: (input) => {
      set((state) => {
        const next = new Set(state.loadingInputs)
        next.delete(input)
        return { loadingInputs: next }
      })
    },

    setMessages: (messages) => set({ messages }),

    setTransientPayload: (payload) => set({ transientPayload: payload }),

    setWebauthnScriptStatus: (status) =>
      set((state) => {
        if (
          status === 'failed' &&
          state.webauthnScriptStatus !== 'failed'
        ) {
          return {
            webauthnScriptStatus: status,
            messages: [
              {
                id: 11,
                text: 'Could not load Passkey libraries. Please try again later.',
                type: 'error',
              },
            ],
          }
        }
        return { webauthnScriptStatus: status }
      }),
  }))
}

export const FlowStoreContext = createContext<FlowStore | null>(null)
