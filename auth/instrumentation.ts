import { Instrumentation } from 'next'
import { patchNextLogger } from '@jiko/next-logger-logtape'
import { logger } from './lib/logger'
import { maskSecretsInObject } from './lib/secrets'
import env from '@/lib/env'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    patchNextLogger({ logger })
    logger.info('Environments:', {
      config: maskSecretsInObject(env),
    })
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  logger.error('Request error', {
    request: {
      method: request.method,
      path: request.path,
      userAgent: request.headers['user-agent'],
    },
    route: context.routePath,
    routerKind: context.routerKind,
    routeType: context.routeType,
    error: {
      name: err instanceof Error ? err.name : 'UnknownError',
      message: err instanceof Error ? err.message : String(err),
    },
  })
}

if (process.env.NEXT_RUNTIME === 'nodejs') {
  process.on('uncaughtException', (error) => {
    logger.fatal('Uncaught Exception', { error })
  })

  process.on('unhandledRejection', (reason) => {
    logger.fatal('Unhandled Rejection', { reason })
  })
}
