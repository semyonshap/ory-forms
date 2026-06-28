"use client"

import { I18nextProvider } from "react-i18next"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import libraryI18n from "../i18n"
import { FlowInputProps } from "../types"
import { FlowContent } from "./flowContent"
import { Toaster } from "@/components/ui/sonner"
import { FormProvider, useForm } from "react-hook-form"
import { useFlow } from "../hooks/useFlow"

const queryClient = new QueryClient()

export function Flow({ config, flow, options }: FlowInputProps) {
  const { setFlowContainer, formState, dispatchFormState } = useFlow(flow)

  const { form, nodes, isSubmitting, dispatchSubmit } = useForm(
    flow,
    config,
    options?.only,
  )

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={libraryI18n}>
        <FormProvider {...form}>
          <form
            action={flow.flow.ui.action}
            method={flow.flow.ui.method}
            className="space-y-4"
          >
            <FlowContent />
            <Toaster />
          </form>
        </FormProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}
