"use client"

import { I18nextProvider } from "react-i18next"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import libraryI18n from "../i18n"
import { FlowInputProps } from "../types"
import { FlowContent } from "./flowContent"
import { Toaster } from "@/components/ui/sonner"
import { OryFlowProvider, OryFormProvider } from "../context"

const queryClient = new QueryClient()

export function Flow({ config, flow, components }: FlowInputProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={libraryI18n}>
        <OryFlowProvider config={config} flow={flow} components={components}>
          <OryFormProvider>
            <form
              action={flow.flow.ui.action}
              method={flow.flow.ui.method}
              className="space-y-4"
            >
              <FlowContent />
              <Toaster />
            </form>
          </OryFormProvider>
        </OryFlowProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}
