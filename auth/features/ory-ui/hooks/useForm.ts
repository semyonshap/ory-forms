import { useCallback } from "react"
import { useForm as useRHForm } from "react-hook-form"
import { useFormSubmit } from "./form/useFormSubmit"
import { UiNodeGroupEnum } from "@ory/client-fetch"
import { useFlowStoreShallow } from "../context"
import { useNodes } from "./nodes/useNodes"
import { useFormAutofocus } from "./form/useFormAutofocus"
import { computeDefaultValues, resolveLoginHint } from "../utils/form"

export function useForm() {
  const { formState, flowContainer } = useFlowStoreShallow((state) => ({
    flowContainer: state.flow,
    formState: state.formState,
  }))

  const { nodes } = useNodes()

  const defaultNodes = nodes
    ? flowContainer.flow.ui.nodes
        .filter((node) => node.group === UiNodeGroupEnum.Default)
        .concat(nodes)
    : flowContainer.flow.ui.nodes

  const loginHint = resolveLoginHint(flowContainer)
  const form = useRHForm({
    defaultValues: computeDefaultValues(
      {
        active: flowContainer.flow.active,
        ui: { nodes: defaultNodes },
      },
      loginHint,
    ),
  })

  const { onSubmit } = useFormSubmit()

  const onFormSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      if (formState.isSubmitting) return

      const payload =
        formState.current === "method_active" && formState.method === "code"
          ? { ...data, method: "code" }
          : data

      await onSubmit(payload)
    },
    [formState.isSubmitting, formState, onSubmit],
  )

  useFormAutofocus(
    nodes,
    formState.isReady,
    flowContainer.flowType,
    form.setFocus,
  )

  const handleSubmit = form.handleSubmit(onFormSubmit)

  return {
    form,
    nodes,
    handleSubmit,
  }
}
