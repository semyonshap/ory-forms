import { useTranslation } from 'react-i18next'
import { useController } from 'react-hook-form'
import { ComponentType, useCallback, useMemo } from 'react'

import { useFormState } from '.'
import { normalizeKeys } from '../utils'
import { useFlowStoreShallow } from '../context'
import { useInputTranslation } from './useInputTranslation'
import {
  BlockOptionsCheckbox,
  BlockPropsCheckbox,
  UiNodeInput,
} from '../types'

export function useCheckbox(node: UiNodeInput): {
  props: BlockPropsCheckbox
  options: BlockOptionsCheckbox
} {
  const { system } = useFlowStoreShallow((state) => ({
    system: state.components.Icons.System,
  }))
  const { isReady, isSubmitting } = useFormState()

  const { t } = useTranslation()
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])
  const { formattedLabel } = useInputTranslation(node)

  const attr = node.attributes
  const isGrantScope = attr.name === 'grant_scope'
  const disabled = attr.disabled || !isReady || isSubmitting

  const controller = useController({
    name: attr.name,
    defaultValue: isGrantScope ? [] : attr.value,
    disabled: attr.disabled,
  })
  const { field } = controller

  const scope = isGrantScope ? (attr.value as string) : undefined
  const onChange = useCallback(
    (next: boolean) => {
      if (isGrantScope && scope) {
        const current: string[] = Array.isArray(field.value)
          ? field.value
          : []
        field.onChange(
          next === true
            ? [...current, scope]
            : current.filter((s) => s !== scope),
        )
      } else {
        field.onChange(next === true)
      }
    },
    [field, scope, isGrantScope],
  )

  let label: string
  let description: string | undefined
  let checked: boolean
  let icon: ComponentType | undefined

  if (isGrantScope && scope) {
    label = t(`consent.scope.${scope}.title`, { defaultValue: scope })
    description = t(`consent.scope.${scope}.description`, {
      defaultValue: '',
    })
    icon = IconsSystem?.[scope] as ComponentType | undefined
    checked = Array.isArray(field.value) && field.value.includes(scope)
  } else {
    label = formattedLabel
    checked = field.value === true
  }

  return {
    props: {
      ...field,
      checked,
      onChange,
      disabled,
    },
    options: { label, description, icon },
  }
}
