import { useEffect } from 'react'
import { useController, useFormContext } from 'react-hook-form'

import { InputOptions, InputProps, UiNodeInput } from '../types'
import { resolvePlaceholder } from '../i18n'
import { useFlowStoreShallow } from '../context'

import { useInputTranslation } from './useTranslation'
import { useOnload } from './useOnload'

export function useInput(node: UiNodeInput): {
  props: InputProps
  options: InputOptions
} {
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

  const { name, type, maxlength, autocomplete } = attr

  const controller = useController({
    name,
    control,
    disabled: attr.disabled,
    shouldUnregister: true,
  })

  useEffect(() => {
    if (attr.value) {
      setValue(attr.name, attr.value)
    }
  }, [attr.value, attr.name, setValue])

  const disabled = attr.disabled || !isReady || isSubmitting

  const { t, label, formattedLabel } = useInputTranslation(node)
  const placeholder = label ? resolvePlaceholder(label, t) : ''

  return {
    props: {
      ...controller.field,
      value: controller.field.value ?? '',
      id: name,
      placeholder,
      type,
      maxLength: maxlength,
      autoComplete: autocomplete,
      disabled,
      readOnly: node.data?.readOnly,
    },
    options: {
      label: formattedLabel,
    },
  }
}
