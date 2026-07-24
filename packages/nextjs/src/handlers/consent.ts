import { ResponseError } from '@ory/client-fetch'
import { NextRequest, NextResponse } from 'next/server'

import { serverSideOAuth2Client } from '../app/client'

export async function handleConsentSubmit(request: NextRequest) {
  const body = await request.json()
  const consentChallenge: string | undefined = body.consent_challenge
  const action: string | undefined = body.action
  const remember: boolean = !!body.remember
  const grantScope: string[] = body.grant_scope ?? []

  if (!consentChallenge || !action) {
    return NextResponse.json(
      { error: { message: 'Missing consent_challenge or action' } },
      { status: 400 },
    )
  }

  const api = serverSideOAuth2Client()

  try {
    if (action === 'reject') {
      const reject = await api.rejectOAuth2ConsentRequest({
        consentChallenge,
        rejectOAuth2Request: {
          error: 'access_denied',
          error_description: 'The resource owner denied the request',
        },
      })
      return NextResponse.json({ redirect_to: reject.redirect_to })
    }

    const accept = await api.acceptOAuth2ConsentRequest({
      consentChallenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: grantScope,
        session: {},
        remember,
        remember_for: 3600,
      },
    })
    return NextResponse.json({ redirect_to: accept.redirect_to })
  } catch (err) {
    if (err instanceof ResponseError) {
      const body = await err.response.json().catch(() => ({ error: { message: err.message } }))
      return NextResponse.json(body, { status: err.response.status })
    }

    return NextResponse.json({ error: { message: 'Consent processing failed' } }, { status: 500 })
  }
}
