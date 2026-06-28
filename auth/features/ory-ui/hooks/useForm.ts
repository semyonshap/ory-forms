import { useCallback, useEffect, useMemo, useRef } from "react"
import { useForm as useRHForm } from "react-hook-form"
import { FlowMethod, OryClientConfiguration, OryFlowContainer } from "../types"
import { useFormSubmit } from "./submit/useFormSubmit"
import { isUiNodeInputAttributes } from "@ory/client-fetch"

export function useForm(
  flow: OryFlowContainer,
  config: OryClientConfiguration,
  only?: FlowMethod,
) {
  const nodes = useMemo(() => {
    return flow.flow.ui.nodes.filter(
      ({ group }) => !only || group === "default" || group === only,
    )
  }, [flow, only])

  const defaultValues = useMemo(() => {
    const values: Record<string, unknown> = {}
    nodes.forEach((node) => {
      if (isUiNodeInputAttributes(node.attributes)) {
        const { type, name, value } = node.attributes
        if (type !== "button" && type !== "submit") {
          values[name] = value ?? ""
        }
      }
    })
    return values
  }, [nodes])

  const form = useRHForm({ defaultValues })
  const submitterRef = useRef<{ name: string; value: string } | null>(null)
  const { onSubmit, isPending } = useFormSubmit(config, flow)

  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues])

  const onFormSubmit = useCallback(
    async (data: Record<string, unknown>, event?: React.BaseSyntheticEvent) => {
      if (isPending) return

      const submitter = (event?.nativeEvent as SubmitEvent)
        ?.submitter as HTMLButtonElement | null
      if (submitter?.name) data[submitter.name] = submitter.value

      if (submitterRef.current) {
        data[submitterRef.current.name] = submitterRef.current.value
        submitterRef.current = null
      }

      await onSubmit(data)
    },
    [isPending, onSubmit],
  )

  const handleSubmit = form.handleSubmit(onFormSubmit)

  const dispatchSubmit = useCallback(
    (submitter?: { name: string; value: string }) => {
      if (submitter) submitterRef.current = submitter
      handleSubmit()
    },
    [handleSubmit],
  )

  return {
    form,
    nodes,
    isSubmitting: isPending,
    handleSubmit,
    dispatchSubmit,
  }
}
