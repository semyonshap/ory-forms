import env from '@/lib/env'

export const oryConfig = {
  project: {
    translations: env.project.translations,
    default_locale: env.project.defaultLocale,
    enabled_locales: env.project.enabledLocales,
    locale_behavior: env.project.localeBehavior,

    name: env.project.name,

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

    logo_url: env.project.logoUrl,
    brand_primary: env.brandPrimary,
    turnstile_site_key: env.turnstileSiteKey,

    captcha_enabled: env.captchaEnabled,
  },
}
