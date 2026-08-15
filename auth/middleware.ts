import { oryConfig } from '@/ory.config'
import { createOryMiddleware } from '@ory-forms/nextjs'
import { VerifyCaptcha } from '@/actions/verifyCaptcha'
import { TokenKeto } from './actions/tokenKeto'
import env from '@/lib/env'

export const middleware = createOryMiddleware({
  project: oryConfig.project,
  customRoutes: [
    {
      path: '/custom-service/verify',
      method: 'POST',
      handler: VerifyCaptcha,
      auth: {
        type: 'header',
        key: env.webhookKey,
        secret: env.webhookSecretKey,
      },
    },
    {
      path: '/custom-service/token',
      method: 'POST',
      handler: TokenKeto,
      auth: {
        type: 'header',
        key: env.webhookKey,
        secret: env.webhookSecretKey,
      },
    },
  ],
})

export const config = {}
