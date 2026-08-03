import type { AccountExperienceConfiguration } from '@ory/client-fetch'

import { initReactI18next } from 'react-i18next'
import i18n, { type i18n as I18n } from 'i18next'

import { OryLocales } from './resources'
import { resolveCustomTranslations } from './customTranslations'

const DEFAULT_NAMESPACE = 'common'
const FALLBACK_LOCALE = 'en'

type I18nConfig = Partial<
  Pick<
    AccountExperienceConfiguration,
    | 'default_locale'
    | 'enabled_locales'
    | 'locale_behavior'
    | 'translations'
  >
>

const libraryI18n: I18n = i18n.createInstance()

function ensureInit(): void {
  if (libraryI18n.isInitialized) return

  libraryI18n.use(initReactI18next).init({
    lng: FALLBACK_LOCALE,
    fallbackLng: FALLBACK_LOCALE,
    defaultNS: DEFAULT_NAMESPACE,
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}',
    },
  })
}

function resolveActiveLocale(
  locales: string[],
  defaultLocale: string,
  behavior: AccountExperienceConfiguration['locale_behavior'],
): string {
  const browserLocale =
    behavior === 'respect_accept_language' &&
    typeof navigator !== 'undefined' &&
    navigator.language
      ? navigator.language.split('-')[0]
      : undefined

  const requested = browserLocale ?? defaultLocale
  return locales.includes(requested) ? requested : defaultLocale
}

export function setupI18n(config: I18nConfig = {}): void {
  ensureInit()

  const {
    default_locale: defaultLocale = FALLBACK_LOCALE,
    enabled_locales: enabledLocales,
    locale_behavior: localeBehavior = 'force_default',
    translations,
  } = config

  const locales = enabledLocales?.length ? enabledLocales : [defaultLocale]
  const customBundles = resolveCustomTranslations(translations)

  for (const locale of locales) {
    libraryI18n.addResourceBundle(
      locale,
      DEFAULT_NAMESPACE,
      OryLocales[locale] ?? OryLocales[FALLBACK_LOCALE],
      true,
      true,
    )
  }

  for (const [locale, bundle] of Object.entries(customBundles)) {
    libraryI18n.addResourceBundle(
      locale,
      DEFAULT_NAMESPACE,
      bundle,
      true,
      true,
    )
  }

  const nextLocale = resolveActiveLocale(
    locales,
    defaultLocale,
    localeBehavior,
  )

  if (libraryI18n.language !== nextLocale) {
    void libraryI18n.changeLanguage(nextLocale)
  }
}

ensureInit()

export default libraryI18n

export { uiTextToFormattedMessage } from './utils'
export * from './resolver'
