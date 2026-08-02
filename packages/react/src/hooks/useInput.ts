import { useEffect } from 'react'
import { useController, useFormContext } from 'react-hook-form'

import { useFormState } from '.'
import { resolvePlaceholder } from '../i18n'
import { fieldErrorToUiMessage } from '../lib'
import { useFlowStoreShallow } from '../context'
import { useInputTranslation } from './useInputTranslation'
import {
  BlockOptionsInput,
  BlockPropsInput,
  MessageProps,
  UiNodeInput,
} from '../types'

export function useInput(node: UiNodeInput): {
  props: BlockPropsInput
  options: BlockOptionsInput
} {
  const { setTransientField } = useFlowStoreShallow((state) => ({
    setTransientField: state.setTransientField,
  }))

  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext()
  const { isReady, isSubmitting } = useFormState()

  const attr = node.attributes

  const { name, type, maxlength, autocomplete } = attr

  const controller = useController({
    name,
    control,
    disabled: attr.disabled,
    shouldUnregister: true,
  })

  const transient = node.data?.transient
  useEffect(() => {
    if (attr.value) {
      if (transient) setTransientField(attr.name, attr.value)
      else setValue(attr.name, attr.value)
    }
  }, [attr.value, attr.name, transient, setValue, setTransientField])

  const disabled = attr.disabled || !isReady || isSubmitting

  const { t, label, formattedLabel } = useInputTranslation(node)
  const placeholder = label ? resolvePlaceholder(label, t) : ''

  const fieldError = errors[name]
  const validationMessages = fieldErrorToUiMessage(fieldError) ?? []

  const nodeMessages = node.messages
  const allMessages: MessageProps[] =
    nodeMessages.length > 0 ? nodeMessages : validationMessages

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
      style: node.data?.style,
    },
    options: {
      label: formattedLabel,
      messages: allMessages.length > 0 ? allMessages : undefined,
    },
  }
}
