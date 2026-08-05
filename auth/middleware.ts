import { oryConfig } from '@/ory.config'
import { createOryMiddleware } from '@ory-forms/nextjs'

export const middleware = createOryMiddleware(oryConfig)

export const config = {
  matcher: [
    '/self-service/:path*',
    '/custom-service/:path*',
    '/sessions/:path*',
    '/ui/:path*',
    '/.well-known/ory/:path*',
    '/.ory/:path*',
  ],
}
