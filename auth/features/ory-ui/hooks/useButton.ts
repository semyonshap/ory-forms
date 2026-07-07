import { useDebounceValue } from "usehooks-ts"
import { useFormContext } from "react-hook-form"
import { ComponentType, useCallback, useEffect, useMemo } from "react"

import { InputDataType, UiNodeInput } from "../types"
import { normalizeKeys } from "../utils"
import { useFlowStoreShallow } from "../context"
import { triggerToWindowCall } from "../lib/nodes"
import { useInputTranslation } from "./useTranslation"
import { useNodeInputSetup } from "./useInputSetup"
import { UiNodeInputAttributesTypeEnum } from "@ory/client-fetch"

export function useButton(node: UiNodeInput) {
  const {
    setValue,
    formState: { isReady },
  } = useFormContext()

  useNodeInputSetup(node)

  const { oryFormState, providers, system } = useFlowStoreShallow((state) => ({
    oryFormState: state.formState,
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
  }))

  const [clicked, setClicked] = useDebounceValue(false, 100)

  const attr = node.attributes

  const onClick = useCallback(() => {
    node.data?.onClick?.()
    setValue(attr.name, attr.value)
    if (node.data?.inputType === "sso") {
      setValue("provider", node.attributes.value)
      setValue("method", node.group)
    }
    setClicked(true)
    if (attr.onclickTrigger) {
      triggerToWindowCall(attr.onclickTrigger)
    }
  }, [node, attr, setValue, setClicked])

  const disabled =
    attr.disabled ||
    !isReady ||
    !oryFormState.isReady ||
    oryFormState.isSubmitting

  const isSubmitting = clicked && oryFormState.isSubmitting

  useEffect(() => {
    if (!oryFormState.isSubmitting && clicked) {
      setClicked(false)
    }
  }, [oryFormState.isSubmitting, setClicked, clicked])

  // Ui Button
  const IconsProviders = useMemo(
    () => normalizeKeys(providers ?? {}),
    [providers],
  )
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])

  const { formattedLabel } = useInputTranslation(node)

  let icon: ComponentType | undefined

  let type: InputDataType =
    attr.type === UiNodeInputAttributesTypeEnum.Submit ? "submit" : "button"

  let htmlType = type

  if (node.data?.type === "method") {
    htmlType = "button"
    icon = system ? IconsSystem?.[node.group] : undefined
  } else if (node.data?.inputType === "sso") {
    htmlType = "button"
    const iconKey = (node.attributes.value as string).split("-")[0]
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
      type: node.data?.type || node.data?.inputType || type,
      isSubmitting,
      label: formattedLabel,
      description: node.data?.description,
      icon,
    },
  }
}
