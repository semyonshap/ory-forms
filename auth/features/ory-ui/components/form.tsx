import { useFlowStoreShallow } from "../context"
import { useOryForm, useFormSubmit } from "../hooks"
import { FormProvider } from "react-hook-form"

export function Form({ children }: { children: React.ReactNode }) {
  const {
    flowContainer: { flow },
  } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
  }))

  const { methods } = useOryForm()

  const onSubmit = useFormSubmit()

  return (
    <FormProvider {...methods}>
      <form
        action={flow.ui.action}
        method={flow.ui.method}
        onSubmit={methods?.handleSubmit(onSubmit, console.error)}
      >
        {children}
      </form>
    </FormProvider>
  )
}
