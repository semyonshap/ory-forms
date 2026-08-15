import { OryClientConfiguration } from '@ory-forms/react'

function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key]
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true'
}

const turnstileSiteSuccess = '1x00000000000000000000AA'
const turnstileSecretSuccess = '1x0000000000000000000000000000000AA'

export const oryConfig: OryClientConfiguration = {
  project: {
    translations: process.env.NEXT_PUBLIC_PROJECT_TRANSLATIONS
      ? JSON.parse(process.env.NEXT_PUBLIC_PROJECT_TRANSLATIONS)
      : {},
    default_locale: process.env.NEXT_PUBLIC_PROJECT_DEFAULT_LOCALE || 'en',
    enabled_locales: process.env.NEXT_PUBLIC_PROJECT_ENABLED_LOCALES
      ? process.env.NEXT_PUBLIC_PROJECT_ENABLED_LOCALES.split(',')
      : [process.env.NEXT_PUBLIC_PROJECT_DEFAULT_LOCALE || 'en'],
    locale_behavior:
      process.env.NEXT_PUBLIC_PROJECT_LOCALE_BEHAVIOR ===
        'force_default' ||
      process.env.NEXT_PUBLIC_PROJECT_LOCALE_BEHAVIOR ===
        'respect_accept_language'
        ? process.env.NEXT_PUBLIC_PROJECT_LOCALE_BEHAVIOR
        : 'force_default',

    name: process.env.NEXT_PUBLIC_PROJECT_NAME || 'Ory',
    logo_dark_url: process.env.NEXT_PUBLIC_PROJECT_LOGO_DARK_URL,
    logo_light_url: process.env.NEXT_PUBLIC_PROJECT_LOGO_LIGHT_URL,

    recovery_enabled: true,

    hide_registration_link: getBooleanEnv(
      'NEXT_PUBLIC_HIDE_REGISTRATION_LINK',
      false,
    ),
    registration_enabled: getBooleanEnv(
      'NEXT_PUBLIC_REGISTRATION_ENABLED',
      true,
    ),
    verification_enabled: getBooleanEnv(
      'NEXT_PUBLIC_VERIFICATION_ENABLED',
      true,
    ),
    hide_ory_branding: true,

    default_redirect_url: '/',
    error_ui_url: '/auth/error',
    login_ui_url: '/auth/login',
    settings_ui_url: '/settings',
    recovery_ui_url: '/auth/recovery',
    oauth2_login_ui_url: '/auth2/login',
    oauth2_logout_ui_url: '/auth2/logout',
    oauth2_consent_ui_url: '/auth2/consent',
    registration_ui_url: '/auth/registration',
    verification_ui_url: '/auth/verification',

    // Extra Values by Auth
    // Ui
    brand_primary: process.env.NEXT_PUBLIC_BRAND_PRIMARY,

    // Custom Captcha
    captcha_enabled: getBooleanEnv('NEXT_PUBLIC_CAPTCHA_ENABLED', false),
    turnstile_site_key:
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
      (process.env.NODE_ENV === 'development'
        ? turnstileSiteSuccess
        : undefined),
    turnstile_secret:
      process.env.TURNSTILE_SECRET_KEY ??
      (process.env.NODE_ENV === 'development'
        ? turnstileSecretSuccess
        : undefined),

    // WebHook Auth
    webhook_key: process.env.WEBHOOK_KEY,
    webhook_secret_key: process.env.WEBHOOK_SECRET_KEY,

    // Keto extract objects to claims
    keto_url: process.env.ORY_KETO_READ_URL,
    keto_namespace: process.env.KETO_NAMESPACE,
    keto_relation: process.env.KETO_RELATION,
  },
}
