import { UiText } from '@ory/client-fetch'
import { TFunction } from 'i18next'

import { uiTextToFormattedMessage } from '.'

function isDynamicText(text: UiText): text is UiText & { context: { name: string } } {
  return (
    text.id === 1070002 &&
    !!text.context &&
    'name' in text.context &&
    typeof text.context['name'] === 'string'
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

export function resolveOptionLabel(name: string, value: unknown, t: TFunction): string {
  const stringValue = String(value)
  const key = `forms.option.${name}.${stringValue}`
  return t(key, { defaultValue: stringValue })
}

export function resolvePlaceholder(uiText: UiText, t: TFunction): string {
  const fallback = t('input.placeholder', {
    placeholder: uiTextToFormattedMessage(uiText, t),
    defaultValue: 'Enter your {placeholder}',
  })

  if (uiText.id === 1070002 && uiText.context && 'name' in uiText.context) {
    const field = String(uiText.context.name)
    return t(`forms.input.placeholder.${field}`, { defaultValue: fallback })
  }

  return fallback
}
