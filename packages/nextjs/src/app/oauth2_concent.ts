'use server'

import { redirect } from 'next/navigation'
import { OAuth2ConsentRequest, UiNode, UiTextTypeEnum } from '@ory/client-fetch'

import { getServerSession } from './session'
import { serverSideOAuth2Client } from './client'
import { OAuth2ConsentFlow, QueryParams } from '../types'
import { getPublicUrl } from './utils'
import { guessPotentiallyProxiedOrySdkUrl } from '../utils/sdk'
import { redirectToErrorPage } from '../utils/error'

export async function getOAuth2ConsentFlow(
  config: {
    project: {
      login_ui_url: string
      error_ui_url?: string
      oauth2_consent_ui_url?: string
    }
  },
  params: QueryParams | Promise<QueryParams>,
): Promise<OAuth2ConsentFlow | null> {
  const resolved = await params
  const consentChallenge = resolved['consent_challenge']?.toString()

  const baseUrl = guessPotentiallyProxiedOrySdkUrl({
    knownProxiedUrl: await getPublicUrl(),
  })

  if (!consentChallenge) {
    await redirectToErrorPage({
      baseUrl,
      config,
      error: new Error('Consent challenge not found in url'),
    })
    return null
  }

  const api = serverSideOAuth2Client()

  let consentRequest: OAuth2ConsentRequest
  try {
    consentRequest = await api.getOAuth2ConsentRequest({ consentChallenge })
  } catch (error) {
    await redirectToErrorPage({
      config,
      baseUrl,
      error,
    })
    return null
  }

  if (consentRequest.skip) {
    const accept = await api.acceptOAuth2ConsentRequest({
      consentChallenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: consentRequest.requested_scope ?? [],
        grant_access_token_audience: consentRequest.requested_access_token_audience ?? [],
        session: {},
      },
    })
    redirect(accept.redirect_to)
  }

  const { session, status } = await getServerSession()
  if (!session) {
    const loginUrl = new URL(config.project.login_ui_url, baseUrl)

    if (status === '2fa_required') {
      loginUrl.searchParams.set('aal', 'aal2')
    }

    const consentUiUrl = config.project.oauth2_consent_ui_url
    if (consentUiUrl) {
      const returnTo = new URL(consentUiUrl, baseUrl)
      returnTo.searchParams.set('consent_challenge', consentChallenge)
      loginUrl.searchParams.set('return_to', returnTo.toString())
    }

    redirect(loginUrl.toString())
  }

  const action = new URL('/custom-service/consent', baseUrl)
  action.searchParams.set('consent_challenge', consentChallenge)

  return {
    id: 'UNSET',
    active: 'oauth2_consent',
    consent_request: consentRequest,
    session,
    ui: {
      action: action.toString(),
      method: 'POST',
      nodes: [
        ...scopesToUiNodes(consentRequest.requested_scope ?? []),
        rememberCheckbox,
        rejectButton,
        acceptButton,
        challengeNode(consentRequest.challenge),
      ],
      messages: [],
    },
  }
}

function scopesToUiNodes(scopes: string[]): UiNode[] {
  return scopes.map((scope) => ({
    type: 'input',
    group: 'oauth2_consent',
    meta: {
      label: {
        id: 9999111,
        text: scope,
        type: UiTextTypeEnum.Info,
      },
    },
    attributes: {
      node_type: 'input',
      name: `grant_scope`,
      value: scope,
      type: 'checkbox',
      disabled: false,
    },
    messages: [],
  }))
}

function challengeNode(challenge: string): UiNode {
  return {
    type: 'input',
    group: 'oauth2_consent',
    meta: {},
    attributes: {
      node_type: 'input',
      name: 'consent_challenge',
      value: challenge,
      type: 'hidden',
      disabled: false,
    },
    messages: [],
  }
}

const rememberCheckbox: UiNode = {
  type: 'input',
  group: 'oauth2_consent',
  meta: {
    label: {
      id: 9999111,
      text: 'Remember my decision',
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: 'input',
    name: 'remember',
    value: false,
    type: 'checkbox',
    disabled: false,
  },
  messages: [],
}

const acceptButton: UiNode = {
  type: 'input',
  group: 'oauth2_consent',
  meta: {
    label: {
      id: 9999111,
      text: 'Accept',
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: 'input',
    name: 'action',
    value: 'accept',
    type: 'submit',
    disabled: false,
  },
  messages: [],
}

const rejectButton: UiNode = {
  type: 'input',
  group: 'oauth2_consent',
  meta: {
    label: {
      id: 9999111,
      text: 'Reject',
      type: UiTextTypeEnum.Info,
    },
  },
  attributes: {
    node_type: 'input',
    name: 'action',
    value: 'reject',
    type: 'submit',
    disabled: false,
  },
  messages: [],
}
