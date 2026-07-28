'use server'

import { isResponseError, isSessionAal2Required, toBody } from '@ory/client-fetch'
import { serverSideFrontendClient } from './client'
import { getCookieHeader } from './utils'
import { SessionWithStatus } from '../types'

export async function getServerSession(): Promise<SessionWithStatus> {
  const cookie = await getCookieHeader()
  try {
    const session = await serverSideFrontendClient().toSession({ cookie })
    return { status: 'authenticated', session }
  } catch (err) {
    if (isResponseError(err)) {
      const body = await toBody(err.response)
      if (isSessionAal2Required(body)) {
        return { status: '2fa_required', session: null }
      }
    }
    return { status: 'unauthenticated', session: null }
  }
}
