import { oryConfig } from '@/ory.config'
import { createOryMiddleware } from '@ory-forms/nextjs'
import { VerifyCaptcha } from '@/actions/verifyCaptcha'
import { TokenKeto } from './actions/tokenKeto'
import env from '@/lib/env'

const auth = env.webhookKey
  ? {
      type: 'header' as const,
      key: env.webhookKey,
      secret: env.webhookSecretKey,
    }
  : undefined

export const middleware = createOryMiddleware({
  project: oryConfig.project,
  customRoutes: [
    {
      path: '/custom-service/verify',
      method: 'POST',
      handler: VerifyCaptcha,
      auth,
    },
    {
      path: '/custom-service/token',
      method: 'POST',
      handler: TokenKeto,
      auth,
    },
  ],
})

export const config = {}
