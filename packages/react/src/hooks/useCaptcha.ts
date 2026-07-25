import { useCallback, useEffect, useState } from 'react'

import { BlockOptionsCaptcha, UiNodeInput } from '../types'
import { useFlowStoreShallow } from '../context'
import { useTransientPayload } from './useTransientPayload'

export function useCaptcha(node: UiNodeInput): {
  options: BlockOptionsCaptcha
} {
  const { setCaptchaToken } = useTransientPayload()
  const { inputLoading, inputReady } = useFlowStoreShallow((s) => ({
    inputLoading: s.inputLoading,
    inputReady: s.inputReady,
  }))

  const [isInteractive, setInteractive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  useEffect(() => {
    inputLoading('captcha')
  }, [inputLoading])

  const resetWidget = useCallback(() => {
    inputLoading('captcha')
  }, [inputLoading])

  const onBeforeInteractive = useCallback(() => {
    setInteractive(true)
    inputReady('captcha')
  }, [inputReady])

  const onExpire = useCallback(() => {
    resetWidget()
  }, [resetWidget])

  const onSuccess = useCallback(
    (token: string) => {
      setCaptchaToken(token)
      inputReady('captcha')
    },
    [setCaptchaToken, inputReady],
  )

  const onError = useCallback(() => {
    console.error('Captcha Error')
    setErrorMessage('Security verification failed. Please try again later.')
  }, [])

  return {
    options: {
      isInteractive,
      errorMessage,
      resetWidget,
      callbacks: { onSuccess, onError, onExpire, onBeforeInteractive },
    },
  }
}
