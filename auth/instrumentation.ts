import { Instrumentation } from 'next'
import { logger } from './lib/logger'
import { oryConfig } from './ory.config'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    logger.info('Site configuration', { config: oryConfig })
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  logger.error('Request error occurred', {
    error: err,
    request: request,
    context: context,
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
