import type { AccountExperienceConfiguration } from '@ory/client-fetch'

import { z } from 'zod'
import { loadEnvConfig } from '@with-jiko/config'

const TURNSTILE_SITE_DEV = '1x00000000000000000000AA'
const TURNSTILE_SECRET_DEV = '1x0000000000000000000000000000000AA'
const isDev = process.env.NODE_ENV === 'development'

type Translations = AccountExperienceConfiguration['translations']

const schema = z.object({
  project: z
    .object({
      name: z.string().default('Ory'),
      defaultLocale: z.string().default('en'),
      enabledLocales: z
        .string()
        .default('en')
        .transform((value) => value.split(',').filter(Boolean)),
      localeBehavior: z
        .enum(['force_default', 'respect_accept_language'])
        .default('force_default'),
      translations: z
        .string()
        .default('[]')
        .transform((value) => JSON.parse(value) as Translations),
      logoUrl: z.string().default('/ory-logo-light.svg'),
    })
    .prefault({}),
  brandPrimary: z.string().default(''),
  turnstileSiteKey: z.string().default(isDev ? TURNSTILE_SITE_DEV : ''),
  captchaEnabled: z.stringbool().default(false),

  turnstileSecret: z.string().default(isDev ? TURNSTILE_SECRET_DEV : ''),
  webhookKey: z.string().default(''),
  webhookSecretKey: z.string().default(''),
  ketoReadUrl: z.string().default(''),
  ketoNamespace: z.string().default(''),
  ketoRelation: z.string().default(''),
  log_level: z.string().default(''),
})

export default loadEnvConfig(schema)
