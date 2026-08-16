import { buildJsonResponse } from '@ory-forms/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import env from '@/lib/env'
import { logger } from '@/lib/logger'

export async function VerifyCaptcha(request: NextRequest) {
  logger.debug('VerifyCaptcha invoked')
  try {
    const body = await request.json()
    const turnstileToken = body?.captcha_token

    if (!turnstileToken) {
      logger.debug('Missing captcha token in request')
      return buildJsonResponse(400, 'Missing captcha token')
    }

    const turnstileSecret = env.turnstileSecret
    if (!turnstileSecret) {
      logger.error('Missing turnstile secret key')
      return buildJsonResponse(500, 'Missing captcha secret key')
    }

    logger.debug('Verifying captcha token', {
      tokenLength: turnstileToken.length,
    })

    const cfResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: turnstileSecret,
          response: turnstileToken,
        }),
      },
    )

    const cfResult = await cfResponse.json()

    if (!cfResult.success) {
      logger.warn('Captcha verification failed', { result: cfResult })
      return buildJsonResponse(400, 'Captcha verification failed')
    }

    logger.debug('Captcha verified successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Captcha verification error:', {
      error: error instanceof Error ? error.message : String(error),
    })
    return buildJsonResponse(500, 'Internal server error')
  }
}
