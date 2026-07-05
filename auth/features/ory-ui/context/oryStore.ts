import { createStore } from "zustand"
import { createContext, Dispatch } from "react"
import { UseFormReturn } from "react-hook-form"
import {
  OryConfiguration,
  OryFlowContainer,
  FormState,
  FormStateAction,
  OryComponents,
} from "../types"

export interface FlowStoreState {
  config: OryConfiguration
  components: OryComponents
  flowContainer: OryFlowContainer
  setFlowContainer: Dispatch<OryFlowContainer>
  formState: FormState
  dispatchFormState: Dispatch<FormStateAction>
}

export type FlowStore = ReturnType<typeof createFlowStore>

export const createFlowStore = (
  initProps: Omit<
    FlowStoreState,
    | "setFlowContainer"
    | "dispatchFormState"
    | "dispatchSubmit"
    | "context"
    | "setContext"
  >,
) => {
  return createStore<FlowStoreState>(() => ({
    ...initProps,
    setFlowContainer: () => {},
    dispatchFormState: () => {},
    dispatchSubmit: () => {},
  }))
}

export const FlowStoreContext = createContext<FlowStore | null>(null)
