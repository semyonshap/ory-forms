import { FormProvider, UseFormReturn } from "react-hook-form"
import { createContext, PropsWithChildren, useContext, useState } from "react"

import { useForm } from "../hooks/useForm"
import { FlowStoreContext } from "./oryStore"
import { FormContext, FormValues } from "../types"

export interface OryFormContextValue {
  methods: UseFormReturn<FormValues> | null
}

export const OryFormContext = createContext<OryFormContextValue | null>(null)

export function OryFormProvider({ children }: PropsWithChildren) {
  const store = useContext(FlowStoreContext)
  if (!store) {
    throw new Error("OryFormProvider must be used within OryFlowProvider")
  }

  const { methods } = useForm()

  return (
    <OryFormContext.Provider value={{ methods }}>
      <FormProvider {...methods}>{children}</FormProvider>
    </OryFormContext.Provider>
  )
}
