import { OAuth2LogoutRequest, ResponseError } from '@ory/client-fetch'
import { NextRequest, NextResponse } from 'next/server'

import { serverSideOAuth2Client } from '../app/client'
import { buildLogoutFlow } from '../lib/buildLogoutFlow'

const SUCCESS_MESSAGE_ID = 9999999

export async function handleLogoutSubmit(request: NextRequest) {
  const body = await request.json()
  const logoutChallenge: string | undefined = body.logout_challenge
  const action: string | undefined = body.action

  if (!logoutChallenge) {
    return NextResponse.json(
      {
        error: {
          code: 404,
          status: 'Not Found',
          message:
            'Expected a logout challenge to be set but received none.',
        },
      },
      { status: 404 },
    )
  }

  const api = serverSideOAuth2Client()

  let logoutRequest: OAuth2LogoutRequest
  try {
    logoutRequest = await api.getOAuth2LogoutRequest({ logoutChallenge })
  } catch (err) {
    if (err instanceof ResponseError) {
      const errorBody = await err.response
        .json()
        .catch(() => ({ error: { message: err.message } }))
      return NextResponse.json(errorBody, { status: err.response.status })
    }

    return NextResponse.json(
      { error: { message: 'Failed to fetch logout request' } },
      { status: 500 },
    )
  }

  if (!action || (action !== 'accept' && action !== 'reject')) {
    const errorFlow = buildLogoutFlow({
      logoutChallenge,
      logoutRequest,
      state: 'show_form',
      messages: [
        {
          id: 4000001,
          type: 'error',
          text: 'Please select an action to proceed.',
        },
      ],
    })
    return NextResponse.json(errorFlow, { status: 400 })
  }

  try {
    if (action === 'reject') {
      await api.rejectOAuth2LogoutRequest({
        logoutChallenge,
      })

      const flow = buildLogoutFlow({
        logoutChallenge,
        logoutRequest,
        state: 'rejected',
        messages: [
          {
            id: SUCCESS_MESSAGE_ID,
            type: 'info',
            text: 'Logout was canceled.',
          },
        ],
      })

      return NextResponse.json({
        ...flow,
        redirect_to: '/',
      })
    }

    const { redirect_to } = await api.acceptOAuth2LogoutRequest({
      logoutChallenge,
    })

    const flow = buildLogoutFlow({
      logoutChallenge,
      logoutRequest,
      state: 'accepted',
      messages: [
        {
          id: SUCCESS_MESSAGE_ID,
          type: 'success',
          text: 'You have been successfully logged out.',
        },
      ],
    })

    return NextResponse.json({
      ...flow,
      redirect_to,
    })
  } catch (err) {
    if (err instanceof ResponseError) {
      const errorBody = await err.response
        .json()
        .catch(() => ({ error: { message: err.message } }))
      return NextResponse.json(errorBody, { status: err.response.status })
    }

    const errorFlow = buildLogoutFlow({
      logoutChallenge,
      logoutRequest,
      state: 'show_form',
      messages: [
        {
          id: 5000001,
          type: 'error',
          text: 'Logout processing failed. Please try again.',
        },
      ],
    })
    return NextResponse.json(errorFlow, { status: 400 })
  }
}
