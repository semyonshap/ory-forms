import { UiNode, UiNodeGroupEnum, UiText } from "@ory/client-fetch"
import { uiTextToFormattedMessage } from "."
import { TFunction } from "i18next"
import { findCodeIdentifierNode } from "../utils"

function isDynamicText(
  text: UiText,
): text is UiText & { context: { name: string } } {
  return (
    text.id === 1070002 &&
    !!text.context &&
    "name" in text.context &&
    typeof text.context["name"] === "string"
  )
}

export function resolveLabel(text: UiText, t: TFunction): string {
  if (isDynamicText(text)) {
    const field = text.context.name
    const key = `forms.label.${field}`
    return t(key, { defaultValue: text.text })
  }
  return uiTextToFormattedMessage(text, t)
}

export function resolveOptionLabel(
  name: string,
  value: unknown,
  t: TFunction,
): string {
  const stringValue = String(value)
  const key = `forms.option.${name}.${stringValue}`
  return t(key, { defaultValue: stringValue })
}

export function resolvePlaceholder(uiText: UiText, t: TFunction): string {
  const fallback = t("input.placeholder", {
    placeholder: uiTextToFormattedMessage(uiText, t),
    defaultValue: "Enter your {placeholder}",
  })

  if (uiText.id === 1070002 && uiText.context && "name" in uiText.context) {
    const field = String(uiText.context.name)
    return t(`forms.input.placeholder.${field}`, { defaultValue: fallback })
  }

  return fallback
}

export function resolveMethod(
  group: UiNodeGroupEnum,
  nodes: UiNode[],
  t: TFunction,
): { title: string; description: string } {
  let title: string
  if (group === UiNodeGroupEnum.Code) {
    const identifierNode = findCodeIdentifierNode(nodes)
    const identifier = identifierNode?.attributes?.value
    if (identifier && typeof identifier === "string" && identifier.length > 0) {
      title = t("identities.messages.1010023", { address: identifier })
    } else {
      title = t(`two-step.${group}.title`)
    }
  } else {
    title = t(`two-step.${group}.title`)
  }

  const description = t(`two-step.${group}.description`)

  return { title, description }
}
