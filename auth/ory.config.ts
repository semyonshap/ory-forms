import env from '@/lib/env'

export const oryConfig = {
  project: {
    translations: env.translations,
    default_locale: env.defaultLocale,
    enabled_locales: env.enabledLocales,
    locale_behavior: env.localeBehavior,

    name: env.projectName,

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

    logo_url: env.logoUrl,
    brand_primary: env.brandPrimary,
    turnstile_site_key: env.turnstileSiteKey,

    captcha_enabled: env.captchaEnabled,
  },
}
