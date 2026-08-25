import { OAuth2ConsentRequest, Session } from '@ory/client-fetch'
import { UiMessage } from '../types'

function createInputNode(
  name: string,
  type: string,
  value?: string | boolean,
  label?: string,
) {
  return {
    type: 'input',
    group: 'oauth2_consent',
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

export function buildConsentFlow({
  consentChallenge,
  consentRequest,
  session,
  state = 'show_form',
  messages = [],
}: {
  consentChallenge: string
  consentRequest: OAuth2ConsentRequest
  session: Session
  state?: 'show_form' | 'rejected' | 'accepted'
  messages?: UiMessage[]
}) {
  const now = new Date()
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10) // 10 минут

  return {
    id: 'UNSET' as const,
    active: 'oauth2_consent' as const,
    state,
    created_at: now,
    issued_at: now,
    expires_at: expiresAt,
    consent_request: consentRequest,
    session,
    ui: {
      action: `/custom-service/consent?consent_challenge=${encodeURIComponent(consentChallenge)}`,
      method: 'POST',
      nodes: [
        createInputNode('consent_challenge', 'hidden', consentChallenge),
        ...(state === 'show_form'
          ? [
              createInputNode('remember', 'checkbox', false, 'Remember me'),
              createInputNode('action', 'submit', 'accept', 'Allow access'),
              createInputNode('action', 'submit', 'reject', 'Deny access'),
            ]
          : []),
      ],
      messages,
    },
  }
}
