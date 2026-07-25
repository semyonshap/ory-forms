import { createStore } from 'zustand'
import { createContext } from 'react'
import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'

import { OryConfiguration, OryFlowContainer, OryComponents, FlowFormState } from '../types'

export interface FlowStoreState {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  overrideState?: FlowFormState
  selectedMethod?: UiNodeGroupEnum
  loadingInputs: Set<UiNodeGroupEnum>
  extraNodes: UiNode[]

  setFlowContainer: (flow: OryFlowContainer) => void
  setOverrideState: (state?: FlowFormState) => void
  selectMethod: (method?: UiNodeGroupEnum) => void
  setExtraNodes: (nodes: UiNode[]) => void
  inputLoading: (group: UiNodeGroupEnum) => void
  inputReady: (input: UiNodeGroupEnum) => void
}

export type FlowStore = ReturnType<typeof createFlowStore>

export const createFlowStore = (initProps: {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
}) => {
  return createStore<FlowStoreState>((set, get) => ({
    ...initProps,
    selectedMethod: undefined,
    overrideState: undefined,
    loadingInputs: new Set(),
    extraNodes: [],

    setFlowContainer: (flow) => {
      const { selectedMethod } = get()
      set({ overrideState: undefined, extraNodes: [] })

      if (selectedMethod) {
        set({ flowContainer: flow, loadingInputs: new Set() })
      } else {
        set({ flowContainer: flow })
      }
    },

    selectMethod: (method) => set({ selectedMethod: method, overrideState: undefined }),

    setExtraNodes: (nodes) => set({ extraNodes: nodes }),

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
  }))
}

export const FlowStoreContext = createContext<FlowStore | null>(null)
