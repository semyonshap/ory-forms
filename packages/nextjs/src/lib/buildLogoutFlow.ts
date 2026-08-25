import { OAuth2LogoutRequest } from '@ory/client-fetch'
import { UiMessage } from '../types'

function createInputNode(
  name: string,
  type: string,
  value?: string,
  label?: string,
) {
  return {
    type: 'input',
    group: 'oauth2_logout',
    meta: label
      ? {
          label: {
            id: 0,
            text: label,
            type: 'info' as const,
          },
        }
      : {},
    attributes: {
      node_type: 'input',
      name,
      type,
      value,
      disabled: false,
    },
    messages: [],
  }
}

export function buildLogoutFlow({
  logoutChallenge,
  logoutRequest,
  state = 'show_form',
  messages = [],
}: {
  logoutChallenge: string
  logoutRequest?: OAuth2LogoutRequest
  state?: 'show_form' | 'rejected' | 'accepted'
  messages?: UiMessage[]
}) {
  const now = new Date()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10)

  return {
    id: 'UNSET' as const,
    active: 'oauth2_logout' as const,
    state,
    created_at: now,
    issued_at: now,
    expires_at: expiresAt,
    logout_request: logoutRequest,
    ui: {
      action: `/custom-service/logout?logout_challenge=${encodeURIComponent(logoutChallenge)}`,
      method: 'POST',
      nodes: [
        createInputNode('logout_challenge', 'hidden', logoutChallenge),
        ...(state === 'show_form'
          ? [
              createInputNode('action', 'submit', 'accept', 'Log out'),
              createInputNode('action', 'submit', 'reject', 'Cancel'),
            ]
          : []),
      ],
      messages,
    },
  }
}
