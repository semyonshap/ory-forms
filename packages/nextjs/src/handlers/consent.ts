import { ResponseError } from '@ory/client-fetch'
import { NextRequest, NextResponse } from 'next/server'

import { serverSideOAuth2Client } from '../app/client'
import { getServerSession } from '../app/session'

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

  const cookie = request.headers.get('cookie') ?? ''

  const { session } = await getServerSession(cookie)

  if (!session) {
    const api = serverSideOAuth2Client()
    const reject = await api.rejectOAuth2ConsentRequest({
      consentChallenge,
      rejectOAuth2Request: {
        error: 'login_required',
        error_description: 'User is not authenticated',
      },
    })
    return NextResponse.json(
      { redirect_to: reject.redirect_to },
      { status: 401 },
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

    const traits = session.identity?.traits ?? {}

    const accept = await api.acceptOAuth2ConsentRequest({
      consentChallenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: grantScope,
        session: {
          id_token: {
            ...(grantScope.includes('email') && {
              email: traits.email,
            }),
            ...(grantScope.includes('profile') && {
              given_name: traits.name?.first,
              family_name: traits.name?.last,
              username: traits.username,
            }),
          },
        },
        remember,
        remember_for: 3600,
      },
    })
    return NextResponse.json({ redirect_to: accept.redirect_to })
  } catch (err) {
    if (err instanceof ResponseError) {
      const body = await err.response
        .json()
        .catch(() => ({ error: { message: err.message } }))
      return NextResponse.json(body, { status: err.response.status })
    }

    return NextResponse.json(
      { error: { message: 'Consent processing failed' } },
      { status: 500 },
    )
  }
}
