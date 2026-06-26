import { UiText } from "@ory/client-fetch"

export function resolvePlaceholder(label?: UiText): string {
  if (!label) return ""
  return `Enter your ${label.text}`
}
