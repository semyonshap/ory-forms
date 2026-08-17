import { NextRequest, NextResponse } from 'next/server'
import { serverSideOAuth2Client } from '../app/client'

export async function handleLogoutSubmit(request: NextRequest) {
  const body = await request.json()
  const logoutChallenge: string | undefined = body.logout_challenge
  const action: string | undefined = body.action

  if (!logoutChallenge || !action) {
    return NextResponse.json(
      { error: 'Missing logout_challenge or action' },
      { status: 400 },
    )
  }

  const api = serverSideOAuth2Client()

  try {
    if (action === 'reject') {
      await api.rejectOAuth2LogoutRequest({
        logoutChallenge,
      })
      return NextResponse.json({ redirect_to: '/' })
    }

    const { redirect_to } = await api.acceptOAuth2LogoutRequest({
      logoutChallenge,
    })
    return NextResponse.json({ redirect_to })
  } catch {
    return NextResponse.json(
      { error: 'Logout processing failed' },
      { status: 500 },
    )
  }
}
