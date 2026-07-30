import { UiNode } from '@ory/client-fetch'
import { useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { fieldErrorToUiMessage } from '../lib'
import { useFlowStoreShallow } from '../context'
import { BlockOptionsCaptcha, isUiNodeInput } from '../types'

export function useCaptcha(node: UiNode): {
  options: BlockOptionsCaptcha
} {
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const { inputLoading, inputReady, setMessages, setTransientField } =
    useFlowStoreShallow((s) => ({
      inputLoading: s.inputLoading,
      inputReady: s.inputReady,
      setMessages: s.setMessages,
      setTransientField: s.setTransientField,
    }))

  const name = isUiNodeInput(node) ? node.attributes.name : undefined

  const id = 'captcha_turnstile_response'

  const validationMessages = fieldErrorToUiMessage(errors[id]) ?? []

  useEffect(() => {
    inputLoading('captcha')
  }, [inputLoading])

  const onBeforeInteractive = useCallback(() => {
    if (name) setValue(name, '')
    setTransientField(id, '')
    inputReady('captcha')
  }, [setValue, inputReady, setTransientField])

  const onExpire = useCallback(() => {
    if (name) setValue(name, '')
    setTransientField(id, '')
    inputLoading('captcha')
  }, [setValue, inputLoading, setTransientField])

  const onSuccess = useCallback(
    (token: string) => {
      if (name) setValue(name, token)
      setTransientField(id, token)
      inputReady('captcha')
    },
    [setValue, inputReady, setTransientField],
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
      messages: validationMessages,
      onSuccess,
      onError,
      onExpire,
      onBeforeInteractive,
    },
  }
}
