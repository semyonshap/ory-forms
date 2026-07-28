import { useDebounceValue } from 'usehooks-ts'
import { useFormContext } from 'react-hook-form'
import { ComponentType, useCallback, useEffect, useMemo } from 'react'
import { UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import { normalizeKeys } from '../utils'
import { useFlowStoreShallow, useFormState } from '../context'
import { triggerToFunction, triggerToWindowCall } from '../lib/nodes'
import {
  VariantsInput,
  UiNodeInput,
  BlockPropsButton,
  BlockOptionsButton,
} from '../types'

import { useOnload, useInputTranslation, useWebAuthn } from '.'

export function useButton(node: UiNodeInput): {
  props: BlockPropsButton
  options: BlockOptionsButton
} {
  const {
    setValue,
    formState: { isReady },
  } = useFormContext()

  useOnload(node)

  const scriptReady = useWebAuthn(node)

  const { providers, system } = useFlowStoreShallow((state) => ({
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
  }))
  const oryFormState = useFormState()

  const [clicked, setClicked] = useDebounceValue(false, 100)

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      const { group, attributes: attr, data } = node

      setValue(attr.name, attr.value)
      setValue('method', group)

      setClicked(true)

      data?.onClick?.()

      const variant = data?.variant

      if (
        variant === 'sso' ||
        variant === 'resend' ||
        variant === 'oidc'
      ) {
        event.currentTarget.closest('form')?.requestSubmit()
      }

      if (attr.onclickTrigger) {
        const fn = triggerToFunction(attr.onclickTrigger)
        if (fn) {
          const result = fn() as unknown
          if (result instanceof Promise) {
            result.then(() =>
              event.currentTarget.closest('form')?.requestSubmit(),
            )
          }
        } else {
          triggerToWindowCall(attr.onclickTrigger)
        }
      }
    },
    [node, setValue, setClicked],
  )

  const {
    formState: { isSubmitting },
  } = useFormContext()

  const { group, attributes: attr } = node
  const variant = node.data?.variant

  const disabled =
    attr.disabled ||
    !isReady ||
    !oryFormState.isReady ||
    isSubmitting ||
    scriptReady.isDisabled

  useEffect(() => {
    if (!isSubmitting && clicked) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked, clicked])

  const IconsProviders = useMemo(
    () => normalizeKeys(providers ?? {}),
    [providers],
  )
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])

  const { formattedLabel } = useInputTranslation(node)

  let icon: ComponentType | undefined

  const type: VariantsInput =
    attr.type === UiNodeInputAttributesTypeEnum.Submit
      ? 'submit'
      : 'button'

  let htmlType: BlockPropsButton['type'] = type

  switch (variant) {
    case 'method': {
      htmlType = 'button'
      icon = system ? IconsSystem?.[group] : undefined
      break
    }
    case 'resend': {
      htmlType = 'button'
      break
    }
    case 'oidc':
    case 'sso': {
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
      isSubmitting: clicked && isSubmitting,
      label: formattedLabel,
      description: node.data?.description,
      icon,
    },
  }
}
