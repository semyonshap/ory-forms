import { NextRequest, NextResponse } from 'next/server'

function createKratosError(text: string, instance_ptr: string = '#/') {
  return {
    messages: [
      {
        instance_ptr,
        messages: [{ type: 'error', text }],
      },
    ],
  }
}

export async function VerifyCaptcha(request: NextRequest) {
  const body = await request.json()

  const turnstileSecret =
    process.env.TURNSTILE_SECRET_KEY ??
    (process.env.NODE_ENV === 'development'
      ? '1x00000000000000000000AA'
      : null)

  if (!turnstileSecret) {
    console.warn('Missing captcha secret key')
    return NextResponse.json(null, { status: 500 })
  }

  const turnstileToken = body?.captcha_token

  if (!turnstileToken) {
    return NextResponse.json(createKratosError('Missing captcha token'), {
      status: 400,
    })
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
    return NextResponse.json(
      createKratosError('Captcha verification failed'),
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true })
}
