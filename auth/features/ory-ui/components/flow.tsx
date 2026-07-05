"use client"

import { I18nextProvider } from "react-i18next"

import libraryI18n from "../i18n"
import { FlowInputProps } from "../types"
import { Toaster } from "@/components/ui/sonner"
import { OryFlowProvider } from "../context"
import { CardWrapper } from "./wrappers"
import { Form } from "./form"

export function Flow({ flow, config, components }: FlowInputProps) {
  return (
    <I18nextProvider i18n={libraryI18n}>
      <OryFlowProvider config={config} flow={flow} components={components}>
        <Form>
          <CardWrapper />
          <Toaster />
        </Form>
      </OryFlowProvider>
    </I18nextProvider>
  )
}
