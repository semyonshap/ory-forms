import { NextRequest, NextResponse } from 'next/server'
import { serverSideOAuth2Client } from '../app/client'

export async function handleLogoutSubmit(request: NextRequest) {
  const formData = await request.formData()
  const logoutChallenge = formData.get('logout_challenge')?.toString()
  const action = formData.get('action')?.toString()

  if (!logoutChallenge || !action) {
    return NextResponse.json({ error: 'Missing logout_challenge or action' }, { status: 400 })
  }

  const api = serverSideOAuth2Client()

  try {
    if (action === 'reject') {
      await api.rejectOAuth2LogoutRequest({
        logoutChallenge,
      })
      return NextResponse.redirect(new URL('/', request.url))
    }

    const { redirect_to } = await api.acceptOAuth2LogoutRequest({
      logoutChallenge,
    })
    return NextResponse.redirect(redirect_to)
  } catch {
    return NextResponse.json({ error: 'Logout processing failed' }, { status: 500 })
  }
}
