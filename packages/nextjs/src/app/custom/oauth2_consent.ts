'use server'

import { redirect } from 'next/navigation'
import { OAuth2Api, UiNode, UiTextTypeEnum } from '@ory/client-fetch'

import { getServerSession } from '../session'
import { orySdkPublicUrl } from '../../utils/sdk'
import { OryFlowConfig, QueryParams, OAuth2ConsentFlow } from '../../types'

export async function getOAuth2ConsentFlow(
  api: OAuth2Api,
  config: OryFlowConfig,
  params: QueryParams | Promise<QueryParams>,
): Promise<OAuth2ConsentFlow> {
  const challenge = (await params)['consent_challenge']?.toString()

  if (!challenge) {
    throw new Error('Missing consent_challenge in URL')
  }

  const baseUrl = orySdkPublicUrl()
  const consentRequest = await api.getOAuth2ConsentRequest({
    consentChallenge: challenge,
  })

  if (consentRequest.skip) {
    const accept = await api.acceptOAuth2ConsentRequest({
      consentChallenge: challenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: consentRequest.requested_scope ?? [],
        grant_access_token_audience:
          consentRequest.requested_access_token_audience ?? [],
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
      returnTo.searchParams.set('consent_challenge', challenge)
      loginUrl.searchParams.set('return_to', returnTo.toString())
    }

    redirect(loginUrl.toString())
  }

  const action = new URL('/custom-service/consent', baseUrl)
  action.searchParams.set('consent_challenge', challenge)

  const now = new Date()

  return {
    id: 'UNSET',
    active: 'oauth2_consent',
    state: 'show_form' as const,
    created_at: now,
    issued_at: now,
    expires_at: new Date(now.getTime() + 1000 * 60 * 10),
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
