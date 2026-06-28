import { createContext } from "zustand/context"
import { createStore, useStore as useZustandStore } from "zustand"
import { UiNode } from "@ory/client-fetch"
import { UseFormReturn } from "react-hook-form"
import {
  OryClientConfiguration,
  OryFlowContainer,
  FormState,
  FormStateAction,
} from "../types"

export interface FlowStoreState {
  config: OryClientConfiguration
  flow: OryFlowContainer
  setFlowContainer: (flow: OryFlowContainer) => void
  nodes: UiNode[]
  form: UseFormReturn<Record<string, unknown>> | null
  formState: FormState
  dispatchFormState: React.Dispatch<FormStateAction>
  dispatchSubmit: (submitter?: { name: string; value: string }) => void
}
