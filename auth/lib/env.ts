function getStringEnv(key: string, defaultValue: string): string {
  const value = process.env[key]
  return value !== undefined ? value : defaultValue
}

function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key]
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true'
}

function getJsonEnv<T>(key: string, defaultValue: T): T {
  const value = process.env[key]
  if (value === undefined) return defaultValue
  try {
    return JSON.parse(value) as T
  } catch {
    return defaultValue
  }
}
function getStringArrayEnv(key: string, defaultValue: string[]): string[] {
  const value = process.env[key]
  if (value === undefined) return defaultValue
  return value.split(',').filter(Boolean)
}

const TURNSTILE_SITE_DEV = '1x00000000000000000000AA'
const TURNSTILE_SECRET_DEV = '1x0000000000000000000000000000000AA'

const env = {
  projectName: getStringEnv('NEXT_PUBLIC_PROJECT_NAME', 'Ory'),
  defaultLocale: getStringEnv('NEXT_PUBLIC_PROJECT_DEFAULT_LOCALE', 'en'),
  enabledLocales: getStringArrayEnv(
    'NEXT_PUBLIC_PROJECT_ENABLED_LOCALES',
    ['en'],
  ),
  localeBehavior: getStringEnv(
    'NEXT_PUBLIC_PROJECT_LOCALE_BEHAVIOR',
    'force_default',
  ) as 'force_default' | 'respect_accept_language',
  translations: getJsonEnv('NEXT_PUBLIC_PROJECT_TRANSLATIONS', []),
  logoDarkUrl: getStringEnv('NEXT_PUBLIC_PROJECT_LOGO_DARK_URL', ''),
  logoLightUrl: getStringEnv('NEXT_PUBLIC_PROJECT_LOGO_LIGHT_URL', ''),
  hideRegistrationLink: getBooleanEnv(
    'NEXT_PUBLIC_HIDE_REGISTRATION_LINK',
    false,
  ),
  registrationEnabled: getBooleanEnv(
    'NEXT_PUBLIC_REGISTRATION_ENABLED',
    true,
  ),
  verificationEnabled: getBooleanEnv(
    'NEXT_PUBLIC_VERIFICATION_ENABLED',
    true,
  ),
  brandPrimary: getStringEnv('NEXT_PUBLIC_BRAND_PRIMARY', ''),
  turnstileSiteKey: getStringEnv(
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY',
    process.env.NODE_ENV === 'development' ? TURNSTILE_SITE_DEV : '',
  ),
  captchaEnabled: getBooleanEnv('NEXT_PUBLIC_CAPTCHA_ENABLED', false),

  turnstileSecret: getStringEnv(
    'TURNSTILE_SECRET_KEY',
    process.env.NODE_ENV === 'development' ? TURNSTILE_SECRET_DEV : '',
  ),
  webhookKey: getStringEnv('WEBHOOK_KEY', ''),
  webhookSecretKey: getStringEnv('WEBHOOK_SECRET_KEY', ''),
  ketoUrl: getStringEnv('ORY_KETO_READ_URL', ''),
  ketoNamespace: getStringEnv('KETO_NAMESPACE', ''),
  ketoRelation: getStringEnv('KETO_RELATION', ''),
}

export default env
