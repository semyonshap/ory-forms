import { useCallback } from 'react'

import { useFlowStoreShallow } from '../context'

export function useTransientPayload() {
  const { transientPayload, setTransientPayload } = useFlowStoreShallow(
    (s) => ({
      transientPayload: s.transientPayload,
      setTransientPayload: s.setTransientPayload,
    }),
  )

  const setCaptchaToken = useCallback(
    (token: string) => {
      setTransientPayload({
        ...transientPayload,
        captcha_turnstile_response: token,
      })
    },
    [transientPayload, setTransientPayload],
  )

  const setTransientField = useCallback(
    (key: string, value: unknown) => {
      setTransientPayload({ ...transientPayload, [key]: value })
    },
    [transientPayload, setTransientPayload],
  )

  const getTransientPayload = useCallback(() => {
    return transientPayload ?? {}
  }, [transientPayload])

  return {
    transientPayload,
    setCaptchaToken,
    setTransientField,
    getTransientPayload,
  }
}
