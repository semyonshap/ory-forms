import { useDebounceValue } from 'usehooks-ts'
import { useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { UiNodeInputAttributesTypeEnum } from '@ory/client-fetch'

import { useFormState } from '.'
import { webauthnGroups } from '../types/const'
import { useFlowStoreShallow } from '../context'
import { triggerToFunction, triggerToWindowCall } from '../lib/nodes'
import { useInputTranslation, useButtonIcon, useFormSubmit } from '.'
import {
  UiNodeInput,
  BlockPropsButton,
  BlockOptionsButton,
} from '../types'

export function useButton(node: UiNodeInput): {
  props: BlockPropsButton
  options: BlockOptionsButton
} {
  const formMethods = useFormContext()
  const { setValue, getValues } = formMethods

  const onSubmit = useFormSubmit(formMethods)

  const {
    selectMethod,
    setOverrideState,
    setTransientField,
    webauthnScriptStatus,
  } = useFlowStoreShallow((state) => ({
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
    setOverrideState: state.setOverrideState,
    selectMethod: state.selectMethod,
    webauthnScriptStatus: state.webauthnScriptStatus,
    setTransientField: state.setTransientField,
  }))

  const { isReady, isSubmitting } = useFormState()

  const [clicked, setClicked] = useDebounceValue(false, 100)

  const { group, attributes: attr, data } = node
  const { name, value, onclickTrigger } = attr
  const variant = data?.variant
  const transient = node.data?.transient

  const type = ['resend', 'sso'].includes(variant || '')
    ? 'button'
    : attr.type === UiNodeInputAttributesTypeEnum.Submit
      ? 'submit'
      : 'button'

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      setClicked(true)

      setValue('method', group)

      if (transient) setTransientField(name, value)
      else setValue(name, value)

      if (type === 'button') {
        if (name === 'select-another-method')
          setOverrideState({ current: 'select_method' })
        if (variant === 'method') selectMethod(group)

        if (variant === 'sso') {
          const form = e.currentTarget.closest('form')
          if (form) {
            form.requestSubmit()
          } else {
            onSubmit(getValues())
          }
        } else if (variant === 'resend') {
          setValue('code', undefined)
          onSubmit(getValues())
        }

        if (onclickTrigger) {
          const fn = triggerToFunction(onclickTrigger)
          if (fn) fn()
          else triggerToWindowCall(onclickTrigger)
        }
      }
    },
    [
      name,
      type,
      group,
      value,
      variant,
      transient,
      setClicked,
      onclickTrigger,
      onSubmit,
      setValue,
      getValues,
      selectMethod,
      setOverrideState,
      setTransientField,
    ],
  )

  const isWebAuthnDisabled =
    webauthnGroups.includes(group) &&
    webauthnScriptStatus != null &&
    webauthnScriptStatus !== 'loaded'

  const disabled =
    attr.disabled || !isReady || isSubmitting || isWebAuthnDisabled

  useEffect(() => {
    if (!isSubmitting && clicked) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked, clicked])

  const { formattedLabel } = useInputTranslation(node)

  const icon = useButtonIcon(node)

  return {
    props: {
      type,
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
