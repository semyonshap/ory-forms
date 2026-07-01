import { useCallback } from "react"
import { useFormContext } from "react-hook-form"
import { UiNodeInputAttributes } from "@ory/client-fetch"
import { useFlowStoreShallow } from "../../context"
import { triggerToWindowCall } from "../../utils"

export function useNodeInput(attributes: UiNodeInputAttributes) {
  const {
    formState: { isReady },
  } = useFormContext()
  const {
    oryFormState: { isSubmitting },
  } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
  }))

  const handleClick = useCallback(() => {
    if (attributes.onclickTrigger) {
      triggerToWindowCall(attributes.onclickTrigger)
    }
  }, [attributes.onclickTrigger])

  const disabled = attributes.disabled || !isReady || isSubmitting

  return { handleClick, disabled }
}
