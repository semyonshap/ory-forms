import type { FlowStoreState } from './oryStore'

import { StateCreator } from 'zustand'
import { UiNodeGroupEnum } from '@ory/client-fetch'

import { FlowFormState } from '../types'

export interface FlowStateSlice {
  flowFormState: FlowFormState
  selectedMethod?: UiNodeGroupEnum
  overrideState?: FlowFormState
  overrideSubmitting: boolean
  loadingInputs: Set<UiNodeGroupEnum>
  setFlowFormState: (state: FlowFormState) => void
  selectMethod: (method?: UiNodeGroupEnum) => void
  setOverrideState: (state?: FlowFormState) => void
  setOverrideSubmitting: (submitting: boolean) => void
  inputLoading: (group: UiNodeGroupEnum) => void
  inputReady: (input: UiNodeGroupEnum) => void
}

export const createFlowStateSlice =
  (
    initialFlowFormState: FlowFormState,
  ): StateCreator<FlowStoreState, [], [], FlowStateSlice> =>
  (set) => {
    return {
      flowFormState: initialFlowFormState,
      selectedMethod: undefined,
      overrideState: undefined,
      overrideSubmitting: false,
      loadingInputs: new Set(),

      setFlowFormState: (state) => set({ flowFormState: state }),
      selectMethod: (method) =>
        set({ selectedMethod: method, overrideState: undefined }),
      setOverrideState: (state) => set({ overrideState: state }),
      setOverrideSubmitting: (submitting) =>
        set({ overrideSubmitting: submitting }),
      inputLoading: (group) =>
        set((state) => {
          const next = new Set(state.loadingInputs)
          next.add(group)
          return { loadingInputs: next }
        }),
      inputReady: (input) =>
        set((state) => {
          const next = new Set(state.loadingInputs)
          next.delete(input)
          return { loadingInputs: next }
        }),
    }
  }
