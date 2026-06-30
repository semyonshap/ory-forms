import { OryClientConfiguration } from "./features/ory-ui/types"

export const oryConfig: OryClientConfiguration = {
  sdk: {
    url: process.env.NEXT_PUBLIC_ORY_SDK_URL || window.location.origin,
  },
  project: {
    default_locale: "en",
    default_redirect_url: "/",
    error_ui_url: "/error",
    locale_behavior: "force_default",
    name: "Jiko Authorization",
    logo_dark_url: "/jiko.svg",
    logo_light_url: "/jiko.svg",
    registration_enabled: true,
    verification_enabled: true,
    recovery_enabled: true,
    registration_ui_url: "/auth/registration",
    verification_ui_url: "/auth/verification",
    recovery_ui_url: "/auth/recovery",
    login_ui_url: "/auth/login",
    settings_ui_url: "/settings",
    enabled_locales: ["en"],
    translations: [],
  },
}
