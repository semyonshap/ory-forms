import { useEffect } from 'react'

import { setupI18n } from '../i18n'
import { OryProject } from '../types'

export function useI18n(project: OryProject) {
  const {
    default_locale,
    enabled_locales,
    locale_behavior,
    translations,
  } = project

  useEffect(() => {
    setupI18n({
      default_locale,
      enabled_locales,
      locale_behavior,
      translations,
    })
  }, [default_locale, enabled_locales, locale_behavior, translations])
}
