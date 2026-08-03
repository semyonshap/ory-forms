import type { AccountExperienceConfiguration } from '@ory/client-fetch'

export type CustomTranslation =
  AccountExperienceConfiguration['translations'][number]

export function parseCustomTranslations(
  entries: CustomTranslation[],
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {}

  for (const { locale, translations } of entries) {
    if (!locale || !translations) continue

    try {
      result[locale] = JSON.parse(translations)
    } catch {
      // Ignore
    }
  }

  return result
}

export function resolveCustomTranslations(
  translations?:
    | AccountExperienceConfiguration['translations']
    | Record<string, Record<string, string>>,
): Record<string, Record<string, string>> {
  if (!translations) return {}
  return Array.isArray(translations)
    ? parseCustomTranslations(translations)
    : translations
}
