import { useTranslation } from "react-i18next"
import {
  getNodeLabel,
  UiNodeGroupEnum,
  UiNodeInputAttributesTypeEnum,
} from "@ory/client-fetch"

import { ButtonOptionType, UiNodeInput } from "../../types"
import { useNodeInputProps } from "./useNodeInputProps"
import { resolvePlaceholder, uiTextToFormattedMessage } from "../../i18n"
import { useNodeButton } from "./useNodeButton"
import logos from "../../assets"

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
  const { t } = useTranslation()
  const label = getNodeLabel(node)
  const formattedLabel = label && uiTextToFormattedMessage(label, t)

  const { onClick, disabled, isSubmitting } = useNodeButton(node)

  const attr = node.attributes

  const isSubmit = attr.type === UiNodeInputAttributesTypeEnum.Submit
  const isSso =
    (attr.name === "provider" || attr.name === "link") &&
    (node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml)

  let type: ButtonOptionType = "default"
  if (isSso) type = "sso"
  else if (isSubmit) type = "submit"

  let icon
  if (isSso) {
    icon = logos[(node.attributes.value as string).split("-")[0]]
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
      icon,
    },
  }
}
