import { useCallback, useEffect } from "react"
import { useDebounceValue } from "usehooks-ts"
import { useFormContext } from "react-hook-form"

import { UiNodeInput } from "../../types"
import { triggerToWindowCall } from "../../utils"
import { useFlowStoreShallow } from "../../context"

export function useNodeButton(node: UiNodeInput) {
  const {
    setValue,
    formState: { isReady },
  } = useFormContext()

  const { oryFormState } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
  }))

  const [clicked, setClicked] = useDebounceValue(false, 100)

  const attr = node.attributes

  const onClick = useCallback(() => {
    setValue(attr.name, attr.value)
    setClicked(true)
    if (attr.onclickTrigger) {
      triggerToWindowCall(attr.onclickTrigger)
    }
  }, [attr, setValue, setClicked])

  const disabled =
    attr.disabled ||
    !isReady ||
    !oryFormState.isReady ||
    oryFormState.isSubmitting

  const isSubmitting = clicked && oryFormState.isSubmitting

  useEffect(() => {
    if (!oryFormState.isSubmitting && clicked) {
      setClicked(false)
    }
  }, [oryFormState.isSubmitting, setClicked, clicked])

  return {
    onClick,
    disabled,
    isSubmitting,
  }
}
