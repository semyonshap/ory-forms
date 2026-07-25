import { createStore } from 'zustand'
import { createContext } from 'react'
import { UiNodeGroupEnum } from '@ory/client-fetch'

import { OryConfiguration, OryFlowContainer, OryComponents } from '../types'

export interface FlowStoreState {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  selectedMethod?: UiNodeGroupEnum
  loadingInputs: Set<UiNodeGroupEnum>
  setFlowContainer: (flow: OryFlowContainer) => void
  selectMethod: (method: UiNodeGroupEnum) => void
  clearMethod: () => void
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
    loadingInputs: new Set(),

    setFlowContainer: (flow) => {
      const { selectedMethod } = get()
      if (selectedMethod) {
        set({ flowContainer: flow, loadingInputs: new Set() })
      } else {
        set({ flowContainer: flow })
      }
    },

    selectMethod: (method) => set({ selectedMethod: method }),

    clearMethod: () => set({ selectedMethod: undefined }),

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
