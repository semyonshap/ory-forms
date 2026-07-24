import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'

export function useTransientPayload() {
  const { setValue, watch } = useFormContext()

  const transientPayload = watch('transient_payload') as Record<string, unknown> | undefined

  const setCaptchaToken = useCallback(
    (token: string) => {
      setValue('transient_payload.captcha_turnstile_response', token, {
        shouldDirty: false,
        shouldValidate: false,
      })
    },
    [setValue],
  )

  const setTransientField = useCallback(
    (key: string, value: unknown) => {
      setValue(`transient_payload.${key}`, value, {
        shouldDirty: false,
        shouldValidate: false,
      })
    },
    [setValue],
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
