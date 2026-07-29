import { useDebounceValue } from 'usehooks-ts'
import { useFormContext } from 'react-hook-form'
import { useCallback, useEffect } from 'react'
import {
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
} from '@ory/client-fetch'

import { useFlowStoreShallow } from '../context'
import {
  UiNodeInput,
  BlockPropsButton,
  BlockOptionsButton,
} from '../types'
import { webauthnGroups } from '../types/const'
import { triggerToFunction, triggerToWindowCall } from '../lib/nodes'

import { useFormState } from '.'
import { useInputTranslation, useButtonIcon, useFormSubmit } from '.'

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
    setOverrideSubmitting,
    webauthnScriptStatus,
  } = useFlowStoreShallow((state) => ({
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
    setOverrideState: state.setOverrideState,
    selectMethod: state.selectMethod,
    setOverrideSubmitting: state.setOverrideSubmitting,
    webauthnScriptStatus: state.webauthnScriptStatus,
  }))

  const { isReady, isSubmitting } = useFormState()

  const [clicked, setClicked] = useDebounceValue(false, 100)

  const { group, attributes: attr, data } = node
  const { name, value, onclickTrigger } = attr
  const variant = data?.variant

  const type = ['method', 'resend', 'sso'].includes(variant || '')
    ? 'button'
    : attr.type === UiNodeInputAttributesTypeEnum.Submit
      ? 'submit'
      : 'button'

  const onClick = useCallback(() => {
    setClicked(true)

    setValue(name, value)
    setValue('method', group)

    if (type === 'button') {
      if (name === 'select-another-method')
        setOverrideState({ current: 'select_method' })
      if (variant === 'method') selectMethod(group)

      if (variant === 'sso') {
        setOverrideSubmitting(true)
        Promise.resolve(onSubmit(getValues())).finally(() =>
          setOverrideSubmitting(false),
        )
      } else if (variant === 'resend') {
        setValue('code', '')
        if (group === UiNodeGroupEnum.Code && name === 'method') {
          setValue('email', '')
        }
        onSubmit(getValues())
      }

      if (onclickTrigger) {
        const fn = triggerToFunction(onclickTrigger)
        if (fn) fn()
        else triggerToWindowCall(onclickTrigger)
      }
    }
  }, [
    name,
    type,
    group,
    value,
    variant,
    setClicked,
    onclickTrigger,
    onSubmit,
    setValue,
    getValues,
    selectMethod,
    setOverrideState,
    setOverrideSubmitting,
  ])

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
