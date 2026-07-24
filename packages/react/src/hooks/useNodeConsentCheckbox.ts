import { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { UiNodeInput } from '../types'

export function useNodeConsentCheckbox(node: UiNodeInput) {
  const attributes = node.attributes
  const { setValue, watch, formState } = useFormContext()
  const scopes = watch('grant_scope')

  const checked = useMemo(() => {
    if (Array.isArray(scopes)) {
      return scopes.includes(attributes.value as string)
    }
    return false
  }, [scopes, attributes.value])

  const handleChange = useCallback(
    (checked: boolean) => {
      const currentScopes = watch('grant_scope')
      if (Array.isArray(currentScopes)) {
        if (checked) {
          setValue('grant_scope', Array.from(new Set([...currentScopes, attributes.value])))
        } else {
          setValue(
            'grant_scope',
            currentScopes.filter((scope: string) => scope !== attributes.value),
          )
        }
      }
    },
    [watch, setValue, attributes.value],
  )

  const disabled = attributes.disabled || !formState.isReady

  return {
    handleChange,
    disabled,
    checked,
  }
}
