import { useCallback } from "react"
import { useController, useFormContext } from "react-hook-form"

import { UiNodeInput } from "../types"
import { resolvePlaceholder } from "../i18n"
import { useFlowStoreShallow } from "../context"
import { triggerToWindowCall } from "../lib/nodes"
import { useInputTranslation } from "./useTranslation"
import { useNodeInputSetup } from "./useInputSetup"
import { UiNodeInputAttributesTypeEnum } from "@ory/client-fetch"

export function useInput(node: UiNodeInput) {
  const {
    control,
    formState: { isReady },
  } = useFormContext()
  const {
    oryFormState: { isSubmitting },
  } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
  }))

  useNodeInputSetup(node)

  const attr = node.attributes

  const { name, type, maxlength, autocomplete, onclickTrigger } = attr

  const controller = useController({
    name,
    control,
    disabled: attr.disabled,
    shouldUnregister: true,
  })

  const onClick = useCallback(() => {
    if (onclickTrigger) {
      triggerToWindowCall(onclickTrigger)
    }
  }, [onclickTrigger])

  const disabled = attr.disabled || !isReady || isSubmitting

  const { t, label, formattedLabel } = useInputTranslation(node)
  const placeholder = label ? resolvePlaceholder(label, t) : ""

  const readOnly = type === UiNodeInputAttributesTypeEnum.Text

  return {
    props: {
      ...controller.field,
      value: controller.field.value ?? "",
      id: name,
      type,
      onClick,
      maxLength: maxlength,
      autoComplete: autocomplete,
      disabled,
      placeholder,
      readOnly,
    },
    options: {
      label: formattedLabel,
    },
  }
}
