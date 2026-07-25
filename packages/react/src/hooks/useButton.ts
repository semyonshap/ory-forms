import { useDebounceValue } from 'usehooks-ts'
import { useFormContext } from 'react-hook-form'
import { ComponentType, useCallback, useEffect, useMemo } from 'react'
import { UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import { normalizeKeys } from '../utils'
import { useFlowStoreShallow, useFormState } from '../context'
import { triggerToWindowCall } from '../lib/nodes'
import {
  VariantsInput,
  OryFlowType,
  UiNodeInput,
  BlockPropsButton,
  BlockOptionsButton,
} from '../types'

import { useOnload, useInputTranslation } from '.'

export function useButton(node: UiNodeInput): {
  props: BlockPropsButton
  options: BlockOptionsButton
} {
  const {
    setValue,
    formState: { isReady },
  } = useFormContext()

  useOnload(node)

  const { flowContainer, providers, system } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
  }))
  const oryFormState = useFormState()

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

  const {
    formState: { isSubmitting },
  } = useFormContext()

  const disabled = attr.disabled || !isReady || !oryFormState.isReady || isSubmitting

  useEffect(() => {
    if (!isSubmitting && clicked) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked, clicked])

  // Ui Button
  const IconsProviders = useMemo(() => normalizeKeys(providers ?? {}), [providers])
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])

  const { formattedLabel } = useInputTranslation(node)

  let icon: ComponentType | undefined

  const type: VariantsInput =
    attr.type === UiNodeInputAttributesTypeEnum.Submit ? 'submit' : 'button'

  let htmlType: BlockPropsButton['type'] = type
  const variant = node.data?.variant

  switch (variant) {
    case 'method': {
      icon = system ? IconsSystem?.[node.group] : undefined
      break
    }
    case 'resend': {
      htmlType = 'button'
      break
    }
    case 'oidc': {
      htmlType = 'button'
      const iconKey = (node.attributes.value as string).split('-')[0]
      icon = IconsProviders?.[iconKey]
      break
    }
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
      variant: variant || type,
      isSubmitting,
      label: formattedLabel,
      description: node.data?.description,
      icon,
    },
  }
}
