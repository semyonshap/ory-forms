'use server'

import { orySdkPublicUrl } from '../utils/sdk'
import { serverSideOAuth2Client } from './client'
import { OAuth2LogoutFlow, QueryParams } from '../types'
import { UiTextTypeEnum } from '@ory/client-fetch'

export async function getOAuth2LogoutFlow(
  params: QueryParams | Promise<QueryParams>,
): Promise<OAuth2LogoutFlow | null> {
  const resolved = await params
  const logoutChallenge = resolved['logout_challenge']?.toString()
  const baseUrl = orySdkPublicUrl()

  if (!logoutChallenge || !baseUrl) {
    return null
  }

  const api = serverSideOAuth2Client()

  try {
    const logoutRequest = await api.getOAuth2LogoutRequest({
      logoutChallenge,
    })
    const action = new URL('/self-service/logout', baseUrl)
    action.searchParams.set('logout_challenge', logoutChallenge)
    return {
      id: 'UNSET',
      active: 'oauth2_logout',
      logout_request: logoutRequest,
      ui: {
        action: action.toString(),
        method: 'POST',
        nodes: [
          {
            type: 'input',
            group: 'default',
            meta: {},
            attributes: {
              node_type: 'input',
              name: 'logout_challenge',
              value: logoutChallenge,
              type: 'hidden',
              disabled: false,
            },
            messages: [],
          },
          {
            type: 'input',
            group: 'default',
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
          },
          {
            type: 'input',
            group: 'default',
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
          },
        ],
        messages: [],
      },
    }
  } catch {
    return null
  }
}
