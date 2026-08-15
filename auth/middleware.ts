import { oryConfig } from '@/ory.config'
import { createOryMiddleware } from '@ory-forms/nextjs'
import { VerifyCaptcha } from '@/actions/verifyCaptcha'
import { TokenKeto } from './actions/tokenKeto'

export const middleware = createOryMiddleware({
  project: oryConfig.project,
  customRoutes: [
    {
      path: '/custom-service/verify',
      method: 'POST',
      handler: VerifyCaptcha,
      auth: {
        type: 'header',
        key: oryConfig.extra.webhook_key,
        secret: oryConfig.extra.webhook_secret_key,
      },
    },
    {
      path: '/custom-service/token',
      method: 'POST',
      handler: TokenKeto,
      auth: {
        type: 'header',
        key: oryConfig.extra.webhook_key,
        secret: oryConfig.extra.webhook_secret_key,
      },
    },
  ],
})

export const config = {}
