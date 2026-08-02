import { UiNode } from '@ory/client-fetch'
import { useFormContext } from 'react-hook-form'
import { useCallback, useEffect, useMemo } from 'react'

import { fieldErrorToUiMessage } from '../lib'
import { useFlowStoreShallow } from '../context'
import { BlockOptionsCaptcha, isUiNodeInput } from '../types'

const DEFAULT_TRANSIENT_ID = 'captcha_turnstile_response'

export function useCaptcha(node: UiNode): {
  options: BlockOptionsCaptcha
} {
  const {
    clearErrors,
    formState: { errors },
  } = useFormContext()

  const {
    transientPayload,
    inputLoading,
    inputReady,
    setMessages,
    setTransientField,
  } = useFlowStoreShallow((s) => ({
    transientPayload: s.transientPayload,
    inputLoading: s.inputLoading,
    inputReady: s.inputReady,
    setMessages: s.setMessages,
    setTransientField: s.setTransientField,
  }))

  const { name, id } = useMemo(() => {
    if (!isUiNodeInput(node))
      return { name: undefined, id: DEFAULT_TRANSIENT_ID }

    const name = node.attributes.name
    const id = node.data?.transient ? name : DEFAULT_TRANSIENT_ID

    return { name, id }
  }, [node])

  const validationMessages = name
    ? fieldErrorToUiMessage(errors[name])
    : []

  const hasValidationError = Boolean(validationMessages?.length)

  const token = (transientPayload?.[id] as string) ?? ''

  useEffect(() => {
    if (hasValidationError && token) setTransientField(id, '')
  }, [hasValidationError, id, token, setTransientField])

  useEffect(() => {
    if (!token) inputLoading('captcha')
  }, [token, inputLoading])

  const onBeforeInteractive = useCallback(() => {
    setTransientField(id, '')
    inputReady('captcha')
  }, [id, setTransientField, inputReady])

  const onExpire = useCallback(() => {
    setTransientField(id, '')
    inputLoading('captcha')
  }, [id, setTransientField, inputLoading])

  const onSuccess = useCallback(
    (newToken: string) => {
      setTransientField(id, newToken)
      if (name) clearErrors(name)
      inputReady('captcha')
    },
    [id, name, setTransientField, clearErrors, inputReady],
  )

  const onError = useCallback(() => {
    setMessages([
      {
        id: 10,
        text: 'Security verification failed. Please try again later.',
        type: 'error' as const,
      },
    ])
  }, [setMessages])

  return {
    options: {
      token,
      messages: validationMessages,
      onSuccess,
      onError,
      onExpire,
      onBeforeInteractive,
    },
  }
}
