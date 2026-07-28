import { OryClientConfiguration, OryFlowType } from '@ory-forms/react'

export const oryConfig: OryClientConfiguration = {
  sdk: {
    url: process.env.NEXT_PUBLIC_ORY_SDK_URL,
  },
  project: {
    translations: [],
    default_locale: 'en',
    enabled_locales: ['en'],
    locale_behavior: 'force_default',

    name: 'Jiko Authorization',
    logo_dark_url: '/jiko.svg',
    logo_light_url: '/jiko.svg',

    hide_ory_branding: true,
    hide_registration_link: false,
    recovery_enabled: true,
    registration_enabled: true,
    verification_enabled: true,

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

    captcha: [OryFlowType.Login, OryFlowType.Registration],
  },
}
