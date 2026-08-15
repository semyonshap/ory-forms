import { NextRequest, NextResponse } from 'next/server'

function createKratosError(text: string, instance_ptr: string = '#/') {
  return {
    messages: [
      {
        instance_ptr,
        messages: [{ id: 1234567, type: 'error', text }],
      },
    ],
  }
}

const turnstilePlaceholder = '1x0000000000000000000000000000000AA'

export async function VerifyCaptcha(request: NextRequest) {
  const body = await request.json()

  const turnstileSecret =
    process.env.TURNSTILE_SECRET_KEY ??
    (process.env.NODE_ENV === 'development' ? turnstilePlaceholder : null)

  if (!turnstileSecret) {
    return NextResponse.json(
      createKratosError('Missing captcha secret key'),
      { status: 500 },
    )
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
