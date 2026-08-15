import { oryConfig } from '@/ory.config'
import { buildJsonResponse } from '@ory-forms/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function VerifyCaptcha(request: NextRequest) {
  const body = await request.json()

  const turnstileSecret = oryConfig.extra.turnstile_secret

  if (!turnstileSecret) {
    return buildJsonResponse(500, 'Missing captcha secret key')
  }

  const turnstileToken = body?.captcha_token

  if (!turnstileToken) {
    return buildJsonResponse(400, 'Missing captcha token')
  }

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
    return buildJsonResponse(400, 'Captcha verification failed')
  }

  return NextResponse.json({ success: true })
}
