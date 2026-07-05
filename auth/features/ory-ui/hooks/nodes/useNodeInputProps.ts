import { useCallback } from "react"
import { useController, useFormContext } from "react-hook-form"
import { UiNodeInputAttributes } from "@ory/client-fetch"
import { useFlowStoreShallow } from "../../context"
import { triggerToWindowCall } from "../../lib/nodes"

export function useNodeInputProps(attributes: UiNodeInputAttributes) {
  const {
    formState: { isReady },
  } = useFormContext()
  const {
    oryFormState: { isSubmitting },
  } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
  }))

  const { name, type, maxlength, autocomplete, onclickTrigger } = attributes

  const controller = useController({
    name: name,
    control: undefined,
    disabled: attributes.disabled,
    shouldUnregister: true,
  })

  const onClick = useCallback(() => {
    if (onclickTrigger) {
      triggerToWindowCall(onclickTrigger)
    }
  }, [onclickTrigger])

  const disabled = attributes.disabled || !isReady || isSubmitting

  return {
    ...controller.field,
    id: name,
    type,
    onClick,
    maxLength: maxlength,
    autoComplete: autocomplete,
    disabled,
  }
}
