'use server'

import { redirect } from 'next/navigation'
import { OAuth2LoginRequest } from '@ory/client-fetch'

import { getServerSession } from './session'
import { serverSideOAuth2Client } from './client'
import { QueryParams } from '../types'
import { getPublicUrl } from './utils'
import { guessPotentiallyProxiedOrySdkUrl } from '../utils/sdk'
import { redirectToErrorPage } from '../utils/error'

export async function getOAuth2LoginFlow(
  config: {
    project: {
      login_ui_url: string
      oauth2_login_ui_url: string
      error_ui_url?: string
    }
  },
  params: QueryParams | Promise<QueryParams>,
): Promise<OAuth2LoginRequest | null> {
  const resolved = await params
  const loginChallenge = resolved['login_challenge']?.toString()

  const baseUrl = guessPotentiallyProxiedOrySdkUrl({
    knownProxiedUrl: await getPublicUrl(),
  })

  if (!loginChallenge) {
    await redirectToErrorPage({
      baseUrl,
      config,
      error: new Error('Missing login_challenge in URL'),
    })
    return null
  }

  const api = serverSideOAuth2Client()

  let loginRequest: OAuth2LoginRequest
  try {
    loginRequest = await api.getOAuth2LoginRequest({ loginChallenge })
  } catch (err) {
    await redirectToErrorPage({ baseUrl, config, error: err })
    return null
  }

  if (loginRequest.skip) {
    const accept = await api.acceptOAuth2LoginRequest({
      loginChallenge,
      acceptOAuth2LoginRequest: {
        subject: loginRequest.subject,
        remember: true,
        remember_for: 3600,
      },
    })
    redirect(accept.redirect_to)
  }

  const { session, status } = await getServerSession()
  if (!session || !session.identity) {
    const { login_ui_url, oauth2_login_ui_url } = config.project

    const returnTo = new URL(oauth2_login_ui_url, baseUrl)
    returnTo.searchParams.set('login_challenge', loginChallenge)

    const loginUrl = new URL(login_ui_url, await getPublicUrl())

    if (status === '2fa_required') {
      loginUrl.searchParams.set('aal', 'aal2')
    }

    loginUrl.searchParams.set('return_to', returnTo.toString())

    redirect(loginUrl.toString())
  } else {
    const accept = await api.acceptOAuth2LoginRequest({
      loginChallenge,
      acceptOAuth2LoginRequest: {
        subject: session.identity.id,
        remember: true,
        remember_for: 3600,
      },
    })
    redirect(accept.redirect_to)
  }
}
