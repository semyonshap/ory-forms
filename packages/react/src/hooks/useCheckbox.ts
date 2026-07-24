import { useTranslation } from 'react-i18next'
import { useController, useFormContext } from 'react-hook-form'
import { ComponentType, useCallback, useMemo } from 'react'

import { UiNodeInput } from '../types'
import { normalizeKeys } from '../utils'
import { useFlowStoreShallow } from '../context'
import { useInputTranslation } from './useTranslation'

export function useCheckbox(node: UiNodeInput) {
  const { formState } = useFormContext()
  const { isReady } = formState
  const {
    oryFormState: { isSubmitting },
    system,
  } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
    system: state.components.Icons.System,
  }))

  const { t } = useTranslation()
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])

  const attr = node.attributes
  const isGrantScope = attr.name === 'grant_scope'
  const disabled = attr.disabled || !isReady || isSubmitting

  const controller = useController({
    name: attr.name,
    defaultValue: isGrantScope ? [] : attr.value,
    disabled: attr.disabled,
  })
  const { field } = controller

  let label: string
  let description: string | undefined
  let icon: ComponentType | undefined
  let checked: boolean
  let onCheckedChange: (next: boolean | 'indeterminate') => void

  if (isGrantScope) {
    const scope = attr.value as string

    label = t(`consent.scope.${scope}.title`, { defaultValue: scope })
    description = t(`consent.scope.${scope}.description`, { defaultValue: '' })
    icon = IconsSystem?.[scope] as ComponentType | undefined

    checked = Array.isArray(field.value) && field.value.includes(scope)
    onCheckedChange = useCallback(
      (next: boolean | 'indeterminate') => {
        const current: string[] = Array.isArray(field.value) ? field.value : []
        field.onChange(next === true ? [...current, scope] : current.filter((s) => s !== scope))
      },
      [field, scope],
    )
  } else {
    const { formattedLabel } = useInputTranslation(node)

    label = formattedLabel

    checked = field.value === true
    onCheckedChange = useCallback(
      (next: boolean | 'indeterminate') => {
        field.onChange(next === true)
      },
      [field],
    )
  }

  return {
    props: {
      checked,
      onCheckedChange,
      disabled,
      onBlur: field.onBlur,
      name: field.name,
      ref: field.ref,
    },
    options: { label, description, icon },
  }
}
