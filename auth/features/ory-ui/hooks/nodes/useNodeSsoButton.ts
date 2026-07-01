import { useCallback, useEffect } from "react"
import { useDebounceValue } from "usehooks-ts"
import { useFormContext } from "react-hook-form"

import { UiNodeInput } from "../../types"
import { useFlowStoreShallow } from "../../context"

export function extractProvider(
  context: object | undefined,
): string | undefined {
  if (
    context &&
    typeof context === "object" &&
    "provider" in context &&
    typeof context.provider === "string"
  ) {
    return context.provider
  }
  return undefined
}

export function useNodeSsoButton(node: UiNodeInput) {
  const { oryFormState } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
  }))
  const {
    setValue,
    formState: { isReady },
  } = useFormContext()

  const [clicked, setClicked] = useDebounceValue(false, 100)

  useEffect(() => {
    if (!oryFormState.isSubmitting && clicked) {
      setClicked(false)
    }
  }, [oryFormState.isSubmitting, setClicked, clicked])

  const handleClick = useCallback(() => {
    setValue("provider", node.attributes.value)
    setValue("method", node.group)
    setClicked(true)
  }, [setValue, node.attributes.value, node.group, setClicked])

  const disabled =
    node.attributes.disabled ||
    !isReady ||
    !oryFormState.isReady ||
    oryFormState.isSubmitting

  const isSubmitting = clicked && oryFormState.isSubmitting
  const provider = extractProvider(node.meta.label?.context) ?? ""

  return {
    handleClick,
    disabled,
    isSubmitting,
    provider,
  }
}
