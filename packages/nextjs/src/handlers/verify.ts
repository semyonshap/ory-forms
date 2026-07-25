import { NextRequest, NextResponse } from 'next/server'

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY || ''

export async function handleVerifySubmit(request: NextRequest) {
  const body = await request.json()

  console.log(body)
  const turnstileToken = body?.captcha?.token

  if (!turnstileToken) {
    return NextResponse.json(
      { messages: [{ id: 0, type: 'error', text: 'Missing captcha token' }] },
      { status: 400 },
    )
  }

  const cfResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: TURNSTILE_SECRET,
      response: turnstileToken,
    }),
  })

  const cfResult = await cfResponse.json()

  if (!cfResult.success) {
    return NextResponse.json(
      { messages: [{ id: 0, type: 'error', text: 'Captcha verification failed' }] },
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true })
}
