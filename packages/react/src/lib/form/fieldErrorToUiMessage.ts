import { UiTextTypeEnum } from '@ory/client-fetch'
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

import { MessageProps } from '../../types'

type FieldErrorLike =
  FieldError | Merge<FieldError, FieldErrorsImpl> | undefined

export function fieldErrorToUiMessage(
  error: FieldErrorLike,
): MessageProps[] | undefined {
  if (!error) return undefined

  const message =
    'message' in error && typeof error.message === 'string'
      ? error.message
      : undefined

  if (!message) return undefined

  return [{ id: 0, type: UiTextTypeEnum.Error, text: message }]
}
