import { useTranslation } from "react-i18next"
import {
  getNodeLabel,
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"

import { InputDataType, UiNodeInput } from "../../types"
import { useNodeInputProps } from "./useNodeInputProps"
import { resolvePlaceholder, uiTextToFormattedMessage } from "../../i18n"
import { useNodeButton } from "./useNodeButton"
import { useFlowStoreShallow } from "../../context"

import { useMemo } from "react"
import { normalizeKeys } from "../../utils"

export function useInputRenderProps(node: UiNodeInput) {
  const { t } = useTranslation()
  const label = getNodeLabel(node)
  const formattedLabel = label ? uiTextToFormattedMessage(label, t) : ""
  const placeholder = label ? resolvePlaceholder(label, t) : ""
  const baseInputProps = useNodeInputProps(node.attributes)

  const props = {
    ...baseInputProps,
    placeholder,
  }

  return {
    options: {
      label: formattedLabel,
    },
    props,
  }
}

export function useButtonRenderProps(node: UiNodeInput) {
  const { providers, system } = useFlowStoreShallow((state) => ({
    providers: state.components.Icons.Providers,
    system: state.components.Icons.System,
  }))

  const IconsProviders = useMemo(
    () => normalizeKeys(providers ?? {}),
    [providers],
  )
  const IconsSystem = useMemo(() => normalizeKeys(system ?? {}), [system])

  const { t } = useTranslation()
  const label = getNodeLabel(node)
  const formattedLabel = label && uiTextToFormattedMessage(label, t)

  const { onClick, disabled, isSubmitting } = useNodeButton(node)

  const attr = node.attributes

  const isSubmit = attr.type === UiNodeInputAttributesTypeEnum.Submit
  const isSso =
    (attr.name === "provider" || attr.name === "link") &&
    (node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml)

  let type: InputDataType = "default"
  if (isSso) type = "sso"
  else if (isSubmit) type = "submit"
  if (node.data?.inputType) type = node.data?.inputType

  let icon
  if (node.data?.type === "method") {
    icon = system ? IconsSystem?.[node.group] : undefined
  } else if (isSso) {
    const iconKey = (node.attributes.value as string).split("-")[0]
    icon = IconsProviders?.[iconKey]
  }

  return {
    props: {
      name: node.attributes.name,
      value: node.attributes.value,
      onClick,
      disabled,
    },
    options: {
      type,
      isSubmitting,
      label: formattedLabel,
      description: node.data?.description,
      icon,
    },
  }
}
