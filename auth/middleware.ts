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
        key: process.env.WEBHOOK_KEY,
        secret: process.env.WEBHOOK_SECRET_KEY,
      },
    },
    {
      path: '/custom-service/token',
      method: 'POST',
      handler: TokenKeto,
      auth: {
        type: 'header',
        key: process.env.WEBHOOK_KEY,
        secret: process.env.WEBHOOK_SECRET_KEY,
      },
    },
  ],
})

export const config = {}
