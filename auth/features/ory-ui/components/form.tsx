import { FormEvent } from "react"
import { useFlowStoreShallow, useOryFormContext } from "../context"
import { useFormSubmit } from "../hooks"

export function Form({ children }: { children: React.ReactNode }) {
  const {
    flowContainer: { flow },
  } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
  }))

  const { methods } = useOryFormContext()

  const onSubmit = useFormSubmit()

  return (
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      onSubmit={methods?.handleSubmit(onSubmit, console.error)}
    >
      {children}
    </form>
  )
}
