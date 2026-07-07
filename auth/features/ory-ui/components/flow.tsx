"use client"

import { I18nextProvider } from "react-i18next"
import { FormProvider, useFormContext } from "react-hook-form"

import libraryI18n from "../i18n"
import { RenderWrapper } from "./wrappers"
import { FlowInputProps } from "../types"
import { OryFlowProvider } from "../context"
import { Toaster } from "@/components/ui/sonner"
import { useFlowStoreShallow } from "../context"
import { useOryForm, useFormSubmit } from "../hooks"

export function Flow({ flow, config, components }: FlowInputProps) {
  const { methods } = useOryForm(flow)

  return (
    <I18nextProvider i18n={libraryI18n}>
      <OryFlowProvider config={config} flow={flow} components={components}>
        <FormProvider {...methods}>
          <Form>
            <RenderWrapper />
            <Toaster />
          </Form>
        </FormProvider>
      </OryFlowProvider>
    </I18nextProvider>
  )
}

function Form({ children }: { children: React.ReactNode }) {
  const {
    flowContainer: { flow },
  } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
  }))

  const methods = useFormContext()
  const onSubmit = useFormSubmit(methods)

  return (
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      onSubmit={methods.handleSubmit(onSubmit, console.error)}
    >
      {children}
    </form>
  )
}
