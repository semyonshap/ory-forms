import { oryConfig } from '@/ory.config'
import { createOryMiddleware } from '@ory-forms/nextjs'

export const middleware = createOryMiddleware(oryConfig)

export const config = {}
