import { UiTextTypeEnum } from '@ory/client-fetch'
import { useEffect } from 'react'
import { useController, useFormContext } from 'react-hook-form'

import {
  BlockOptionsInput,
  BlockPropsInput,
  MessageProps,
  UiNodeInput,
} from '../types'
import { resolvePlaceholder } from '../i18n'

import { useInputTranslation } from './useInputTranslation'

import { useFormState } from '.'

export function useInput(node: UiNodeInput): {
  props: BlockPropsInput
  options: BlockOptionsInput
} {
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

  useEffect(() => {
    if (attr.value) {
      setValue(attr.name, attr.value)
    }
  }, [attr.value, attr.name, setValue])

  const disabled = attr.disabled || !isReady || isSubmitting

  const { t, label, formattedLabel } = useInputTranslation(node)
  const placeholder = label ? resolvePlaceholder(label, t) : ''

  const fieldError = errors[name]
  const validationMessages: MessageProps[] =
    fieldError && typeof fieldError.message === 'string'
      ? [{ id: 0, type: UiTextTypeEnum.Error, text: fieldError.message }]
      : []

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
