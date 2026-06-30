import { createStore } from "zustand"
import { createContext, Dispatch } from "react"
import { UseFormReturn } from "react-hook-form"
import {
  OryConfiguration,
  OryFlowContainer,
  FormState,
  FormStateAction,
  FormValues,
  FlowContainerSetter,
  FormNode,
  OryComponents,
} from "../types"
import { defaultGroupSorter, defaultNodeSorter } from "../utils"

export interface FlowStoreState {
  config: OryConfiguration
  components: OryComponents
  flow: OryFlowContainer
  setFlowContainer: FlowContainerSetter
  nodes: FormNode[]
  form: UseFormReturn<FormValues> | null
  formState: FormState
  dispatchFormState: Dispatch<FormStateAction>
}

export type FlowStore = ReturnType<typeof createFlowStore>

export const createFlowStore = (
  initProps: Omit<
    FlowStoreState,
    "setFlowContainer" | "dispatchFormState" | "dispatchSubmit" | "components"
  >,
) => {
  return createStore<FlowStoreState>((set) => ({
    ...initProps,
    components: {
      nodeSorter: defaultNodeSorter,
      groupSorter: defaultGroupSorter,
    },
    setFlowContainer: () => {},
    dispatchFormState: () => {},
    dispatchSubmit: () => {},
  }))
}

export const FlowStoreContext = createContext<FlowStore | null>(null)
