import { FormProvider } from "react-hook-form"
import React, { useContext, useEffect } from "react"

import { useForm } from "../hooks/useForm"
import { FlowStoreContext } from "./oryStore"

interface OryFormProviderProps {
  children: React.ReactNode
}

export function OryFormProvider({ children }: OryFormProviderProps) {
  const store = useContext(FlowStoreContext)
  if (!store) {
    throw new Error("OryFormProvider must be used within OryFlowProvider")
  }

  const { form, nodes } = useForm()

  useEffect(() => {
    store.setState({
      form,
      nodes,
    })
  }, [form, nodes])

  return <FormProvider {...form}>{children}</FormProvider>
}
