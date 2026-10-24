import type { OryClientConfiguration } from '@ory-forms/react'

export const oryConfig: OryClientConfiguration = {
  project: {
    name: 'Inline flow',
    default_locale: 'en',
    enabled_locales: ['en'],
    locale_behavior: 'force_default',
    translations: [],
    default_redirect_url: '/',
    error_ui_url: '/error',
    login_ui_url: '/',
    settings_ui_url: '/settings',
    recovery_ui_url: '/recovery',
    registration_ui_url: '/registration',
    verification_ui_url: '/verification',
    oauth2_login_ui_url: '/oauth2/login',
    oauth2_consent_ui_url: '/oauth2/consent',
    oauth2_logout_ui_url: '/oauth2/logout',
    hide_ory_branding: true,
    hide_registration_link: false,
    recovery_enabled: true,
    registration_enabled: true,
    verification_enabled: true,
  },
}
