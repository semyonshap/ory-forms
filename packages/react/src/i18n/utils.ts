import { UiText } from "@ory/client-fetch"
import { TFunction } from "i18next"

function formatDate(unixSeconds: number): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
  }).format(new Date(unixSeconds * 1000))
}

function formatList(list: string[]): string {
  return new Intl.ListFormat(undefined, {
    style: "long",
    type: "conjunction",
  }).format(list)
}

function minutesDiff(from: number, to: number): number {
  return Math.ceil((to - from) / 60)
}

function processContext(
  context: Record<string, unknown>,
  t: TFunction,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(context)) {
    if (Array.isArray(value)) {
      result[key] = value
      result[`${key}_list`] = formatList(value.map(String))
      continue
    }

    if (key.endsWith("_unix") && typeof value === "number") {
      const now = Math.floor(Date.now() / 1000)
      result[key] = formatDate(value)

      if (key === "sent_at_unix" || key === "expires_at_unix") {
        result[`${key}_since`] = formatDate(value)
      }
      if (key === "expires_at_unix") {
        result[`${key}_until_minutes`] = minutesDiff(now, value)
      }
      if (key === "created_at_unix") {
        result[`${key}_since_minutes`] = minutesDiff(value, now)
      }
      continue
    }

    if (key === "property" && typeof value === "string") {
      result[key] = t(`property.${value}`, { defaultValue: value })
      continue
    }

    result[key] = value
  }

  return result
}

export function uiTextToFormattedMessage(
  { id, context = {}, text }: Omit<UiText, "type">,
  t: TFunction,
): string {
  const ctx = context as Record<string, unknown>

  if (!id || typeof id !== "number") {
    return text
  }

  const hasEmptyArray = Object.values(context).some(
    (v) => Array.isArray(v) && v.length === 0,
  )
  if (hasEmptyArray) {
    return text
  }

  const processed = processContext(ctx, t)
  const key = `identities.messages.${id}`
  return t(key, { ...processed, defaultValue: text })
}
