import { UiNode } from "@ory/client-fetch"
import { I18nextProvider } from "react-i18next"
import { createContext, useContext, ReactNode } from "react"
import { FormProvider, UseFormReturn } from "react-hook-form"

import libraryI18n from "../i18n"
import { useFlow } from "../hooks/useFlow"
import { useForm } from "../hooks/useForm"
import {
  FlowInputProps,
  FormState,
  FormStateAction,
  OryClientConfiguration,
  OryFlowContainer,
} from "../types"

type FlowFormContextValue = {
  config: OryClientConfiguration
  form: UseFormReturn<Record<string, unknown>>
  flow: OryFlowContainer
  setFlowContainer: (flow: OryFlowContainer) => void
  nodes: UiNode[]
  dispatchSubmit: (submitter?: { name: string; value: string }) => void
  formState: FormState
  dispatchFormState: React.Dispatch<FormStateAction>
}

const FlowFormContext = createContext<FlowFormContextValue | null>(null)

export function useFlowFormContext() {
  const ctx = useContext(FlowFormContext)
  if (!ctx)
    throw new Error("useFlowFormContext must be used inside FlowFormProvider")
  return ctx
}

type FlowFormProviderProps = FlowInputProps & {
  children: ReactNode
}

export function FlowFormProvider({
  config,
  flow,
  options,
  children,
}: FlowFormProviderProps) {
  const { setFlowContainer, formState, dispatchFormState } = useFlow(flow)

  const { form, nodes, isSubmitting, dispatchSubmit } = useForm(
    flow,
    config,
    options?.only,
  )

  return (
    <FlowFormContext.Provider
      value={{
        config,
        form,
        flow,
        setFlowContainer,
        nodes,
        dispatchSubmit,
        formState,
        dispatchFormState,
      }}
    >
        <FormProvider {...form}>{children}</FormProvider>
    </FlowFormContext.Provider>
  )
}
