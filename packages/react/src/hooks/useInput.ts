import { useEffect } from 'react'
import { useController, useFormContext } from 'react-hook-form'

import { UiNodeInput } from '../types'
import { resolvePlaceholder } from '../i18n'
import { useFlowStoreShallow } from '../context'
import { useInputTranslation } from './useTranslation'
import { useOnload } from './useOnload'

export function useInput(node: UiNodeInput) {
  const {
    setValue,
    control,
    formState: { isReady },
  } = useFormContext()
  const {
    oryFormState: { isSubmitting },
  } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
  }))

  useOnload(node)

  const attr = node.attributes

  const { name, type, maxlength, autocomplete, onclickTrigger } = attr

  const controller = useController({
    name,
    control,
    disabled: attr.disabled,
    shouldUnregister: true,
  })

  /* const onClick = useCallback(() => {
    if (onclickTrigger) {
      triggerToWindowCall(onclickTrigger)
    }
  }, [onclickTrigger]) */

  useEffect(() => {
    if (attr.value) {
      setValue(attr.name, attr.value)
    }
  }, [attr.value])

  const disabled = attr.disabled || !isReady || isSubmitting

  const { t, label, formattedLabel } = useInputTranslation(node)
  const placeholder = label ? resolvePlaceholder(label, t) : ''

  return {
    props: {
      ...controller.field,
      value: controller.field.value ?? '',
      id: name,
      type,
      maxLength: maxlength,
      autoComplete: autocomplete,
      disabled,
      placeholder,
      readOnly: node.data?.readOnly,
    },
    options: {
      label: formattedLabel,
    },
  }
}
