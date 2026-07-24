import { createStore } from 'zustand'
import { createContext, Dispatch } from 'react'

import {
  OryConfiguration,
  OryFlowContainer,
  FormState,
  FormStateAction,
  OryComponents,
} from '../types'
import { updateFormState, initFormState } from '../lib/form'

export interface FlowStoreState {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  formState: FormState
  setFlowContainer: (flow: OryFlowContainer) => void
  dispatchFormState: Dispatch<FormStateAction>
}

export type FlowStore = ReturnType<typeof createFlowStore>

export const createFlowStore = (
  initProps: Omit<FlowStoreState, 'formState' | 'setFlowContainer' | 'dispatchFormState'>,
) => {
  return createStore<FlowStoreState>((set) => ({
    ...initProps,
    formState: initFormState(initProps.flowContainer),

    setFlowContainer: (flow) => {
      set((state) => ({
        ...state,
        flowContainer: flow,
        formState: updateFormState(state.formState, {
          type: 'action_flow_update',
          flow,
        }),
      }))
    },

    dispatchFormState: (action) => {
      set((state) => ({
        ...state,
        formState: updateFormState(state.formState, action),
      }))
    },
  }))
}

export const FlowStoreContext = createContext<FlowStore | null>(null)
