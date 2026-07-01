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

  const handleClick = useCallback(() => {
    setValue(node.attributes.name, node.attributes.value)
    setClicked(true)
    if (node.attributes.onclickTrigger) {
      triggerToWindowCall(node.attributes.onclickTrigger)
    }
  }, [node.attributes, setValue, setClicked])

  const disabled =
    node.attributes.disabled ||
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
    handleClick,
    disabled,
    isSubmitting,
  }
}
