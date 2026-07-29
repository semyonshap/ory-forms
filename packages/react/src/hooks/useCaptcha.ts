import { useCallback, useEffect } from 'react'

import { useFlowStoreShallow } from '../context'
import { BlockOptionsCaptcha, UiNodeInput } from '../types'

import { useTransientPayload } from '.'

export function useCaptcha(_node: UiNodeInput): {
  options: BlockOptionsCaptcha
} {
  const { setCaptchaToken } = useTransientPayload()
  const { inputLoading, inputReady, setMessages } = useFlowStoreShallow(
    (s) => ({
      inputLoading: s.inputLoading,
      inputReady: s.inputReady,
      setMessages: s.setMessages,
    }),
  )

  useEffect(() => {
    inputLoading('captcha')
  }, [inputLoading])

  const onBeforeInteractive = useCallback(() => {
    inputReady('captcha')
  }, [inputReady])

  const onExpire = useCallback(() => {
    setCaptchaToken('')
    inputLoading('captcha')
  }, [setCaptchaToken, inputLoading])

  const onSuccess = useCallback(
    (token: string) => {
      setCaptchaToken(token)
      inputReady('captcha')
    },
    [setCaptchaToken, inputReady],
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
      onSuccess,
      onError,
      onExpire,
      onBeforeInteractive,
    },
  }
}
