'use server'

import { redirect } from 'next/navigation'
import { OAuth2Api } from '@ory/client-fetch'

import { getServerSession } from '../session'
import { orySdkPublicUrl } from '../../utils/sdk'
import { OryFlowConfig, QueryParams } from '../../types'

export async function getOAuth2LoginFlow(
  api: OAuth2Api,
  config: OryFlowConfig,
  params: QueryParams | Promise<QueryParams>,
): Promise<void> {
  const { login_ui_url, oauth2_login_ui_url } = config.project

  if (!oauth2_login_ui_url) {
    throw new Error('oauth2_login_ui_url is not configured')
  }

  const challenge = (await params)['login_challenge']?.toString()

  if (!challenge) {
    throw new Error('Missing login_challenge in URL')
  }

  const baseUrl = orySdkPublicUrl()
  const loginRequest = await api.getOAuth2LoginRequest({
    loginChallenge: challenge,
  })

  if (loginRequest.skip) {
    const accept = await api.acceptOAuth2LoginRequest({
      loginChallenge: challenge,
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
    const returnTo = new URL(oauth2_login_ui_url, baseUrl)
    returnTo.searchParams.set('login_challenge', challenge)

    const loginUrl = new URL(login_ui_url, baseUrl)

    if (status === '2fa_required') {
      loginUrl.searchParams.set('aal', 'aal2')
    }

    loginUrl.searchParams.set('return_to', returnTo.toString())

    redirect(loginUrl.toString())
  } else {
    const accept = await api.acceptOAuth2LoginRequest({
      loginChallenge: challenge,
      acceptOAuth2LoginRequest: {
        subject: session.identity.id,
        remember: true,
        remember_for: 3600,
      },
    })
    redirect(accept.redirect_to)
  }
}
