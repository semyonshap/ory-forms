import { OAuth2ConsentRequest, ResponseError } from '@ory/client-fetch'
import { NextRequest, NextResponse } from 'next/server'

import { serverSideOAuth2Client } from '../app/client'
import { getServerSession } from '../app/session'
import { buildConsentFlow } from '../lib/buildConsentFlow'

const SUCCESS_MESSAGE_ID = 9999998

export async function handleConsentSubmit(request: NextRequest) {
  const body = await request.json()
  const consentChallenge: string | undefined = body.consent_challenge
  const action: string | undefined = body.action
  const remember: boolean = !!body.remember
  const grantScope: string[] = body.grant_scope ?? []

  if (!consentChallenge) {
    return NextResponse.json(
      {
        error: {
          code: 404,
          status: 'Not Found',
          message:
            'Expected a consent challenge to be set but received none.',
        },
      },
      { status: 404 },
    )
  }

  const api = serverSideOAuth2Client()

  let consentRequest: OAuth2ConsentRequest
  try {
    consentRequest = await api.getOAuth2ConsentRequest({
      consentChallenge,
    })
  } catch (err) {
    if (err instanceof ResponseError) {
      const errorBody = await err.response
        .json()
        .catch(() => ({ error: { message: err.message } }))
      return NextResponse.json(errorBody, { status: err.response.status })
    }

    return NextResponse.json(
      { error: { message: 'Consent request lookup failed' } },
      { status: 500 },
    )
  }

  const cookie = request.headers.get('cookie') ?? ''
  const { session } = await getServerSession(cookie)

  if (!session) {
    const reject = await api.rejectOAuth2ConsentRequest({
      consentChallenge,
      rejectOAuth2Request: {
        error: 'login_required',
        error_description: 'User is not authenticated',
      },
    })
    return NextResponse.json(
      { redirect_to: reject.redirect_to },
      { status: 200 },
    )
  }

  if (!action || (action !== 'accept' && action !== 'reject')) {
    const errorFlow = buildConsentFlow({
      consentChallenge,
      consentRequest,
      session,
      state: 'show_form',
      messages: [
        {
          id: 4000001,
          type: 'error',
          text: 'Please choose whether to grant or deny access.',
        },
      ],
    })
    return NextResponse.json(errorFlow, { status: 400 })
  }

  try {
    if (action === 'reject') {
      const reject = await api.rejectOAuth2ConsentRequest({
        consentChallenge,
        rejectOAuth2Request: {
          error: 'access_denied',
          error_description: 'The resource owner denied the request',
        },
      })

      const flow = buildConsentFlow({
        consentChallenge,
        consentRequest,
        session,
        state: 'rejected',
        messages: [
          {
            id: SUCCESS_MESSAGE_ID,
            type: 'success',
            text: 'The application has been opened, you can close this tab.',
          },
        ],
      })

      return NextResponse.json({
        ...flow,
        redirect_to: reject.redirect_to,
      })
    }

    const traits = session.identity?.traits ?? {}

    const accept = await api.acceptOAuth2ConsentRequest({
      consentChallenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: grantScope,
        grant_access_token_audience:
          consentRequest.requested_access_token_audience,
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

    const flow = buildConsentFlow({
      consentChallenge,
      consentRequest,
      session,
      state: 'accepted',
      messages: [
        {
          id: SUCCESS_MESSAGE_ID,
          type: 'success',
          text: 'The application has been opened, you can close this tab.',
        },
      ],
    })

    return NextResponse.json({
      ...flow,
      redirect_to: accept.redirect_to,
    })
  } catch (err) {
    if (err instanceof ResponseError) {
      const errorBody = await err.response
        .json()
        .catch(() => ({ error: { message: err.message } }))
      return NextResponse.json(errorBody, { status: err.response.status })
    }

    const errorFlow = buildConsentFlow({
      consentChallenge,
      consentRequest,
      session,
      state: 'show_form',
      messages: [
        {
          id: 5000001,
          type: 'error',
          text: 'Consent processing failed. Please try again.',
        },
      ],
    })
    return NextResponse.json(errorFlow, { status: 400 })
  }
}
