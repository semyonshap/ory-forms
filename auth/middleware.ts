import { oryConfig } from '@/ory.config'
import { createOryMiddleware } from '@ory-forms/nextjs'

export const middleware = createOryMiddleware({
  project: oryConfig.project,
})

export const config = {}
