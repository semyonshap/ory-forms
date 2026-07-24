import { useDebounceValue } from 'usehooks-ts'
import { useFormContext } from 'react-hook-form'
import { ComponentType, useCallback, useEffect, useMemo } from 'react'
import { UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import { normalizeKeys } from '../utils'
import { useFlowStoreShallow } from '../context'
import { triggerToWindowCall } from '../lib/nodes'
import { InputVariants, OryFlowType, UiNodeInput } from '../types'

import { useOnload, useInputTranslation } from '.'

export function useButton(node: UiNodeInput) {
  const {
    setValue,
    formState: { isReady },
  } = useFormContext()

  useOnload(node)

  const { flowContainer, oryFormState, providers, system } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
    oryFormState: state.formState,
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
  }))

  const { flowType } = flowContainer

  const [clicked, setClicked] = useDebounceValue(false, 100)

  const attr = node.attributes

  const onClick = useCallback(() => {
    setValue(attr.name, attr.value)

    node.data?.onClick?.()

    if (flowType === OryFlowType.Settings) {
      setValue('method', node.group)
    }

    if (node.data?.variant === 'sso') {
      setValue('provider', node.attributes.value)
    }

    setClicked(true)

    if (attr.onclickTrigger) {
      triggerToWindowCall(attr.onclickTrigger)
    }
  }, [node, attr, setValue, setClicked, flowType])

  const disabled = attr.disabled || !isReady || !oryFormState.isReady || oryFormState.isSubmitting

  const isSubmitting = clicked && oryFormState.isSubmitting

  useEffect(() => {
    if (!oryFormState.isSubmitting && clicked) {
      setClicked(false)
    }
  }, [oryFormState.isSubmitting, setClicked, clicked])

  // Ui Button
  const IconsProviders = useMemo(() => normalizeKeys(providers ?? {}), [providers])
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])

  const { formattedLabel } = useInputTranslation(node)

  let icon: ComponentType | undefined

  const type: InputVariants =
    attr.type === UiNodeInputAttributesTypeEnum.Submit ? 'submit' : 'button'

  let htmlType = type

  if (node.data?.type === 'method') {
    icon = system ? IconsSystem?.[node.group] : undefined
  } else if (node.data?.type === 'resend') {
    htmlType = 'button'
  } else if (node.data?.variant === 'sso') {
    htmlType = 'button'
    const iconKey = (node.attributes.value as string).split('-')[0]
    icon = IconsProviders?.[iconKey]
  }

  return {
    props: {
      type: htmlType,
      name: node.attributes.name,
      value: node.attributes.value,
      onClick,
      disabled,
    },
    options: {
      type: node.data?.type || node.data?.variant || type,
      isSubmitting,
      label: formattedLabel,
      description: node.data?.description,
      icon,
    },
  }
}
