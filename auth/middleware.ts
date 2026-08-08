import { oryConfig } from '@/ory.config'
import { createOryMiddleware } from '@ory-forms/nextjs'

export const middleware = createOryMiddleware({
  project: oryConfig.project,
  forceCookieDomain: oryConfig.project.force_cookie_domain,
})

export const config = {}
