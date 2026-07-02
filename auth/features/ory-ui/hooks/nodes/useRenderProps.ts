import { useTranslation } from "react-i18next"
import { getNodeLabel } from "@ory/client-fetch"

import { UiNodeInput } from "../../types"
import { useNodeInputProps } from "./useNodeInputProps"
import { resolvePlaceholder, uiTextToFormattedMessage } from "../../i18n"
import { useNodeButton } from "./useNodeButton"

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

  return {
    props: {
      name: node.attributes.name,
      value: node.attributes.value,
      onClick,
      disabled,
    },
    options: {
      isSubmitting,
      label: formattedLabel,
    },
  }
}
