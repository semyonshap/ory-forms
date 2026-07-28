import { UiNodeGroupEnum, UpdateSettingsFlowBody } from '@ory/client-fetch'

import { FormValues, supportsSelectAccountPrompt } from '../../types'

const settingsMethodFields: Record<string, string[]> = {
  [UiNodeGroupEnum.Profile]: ['traits'],
  [UiNodeGroupEnum.Password]: ['password'],
  [UiNodeGroupEnum.Totp]: ['totp_code', 'totp_unlink'],
  [UiNodeGroupEnum.Oidc]: ['link', 'unlink', 'traits'],
  [UiNodeGroupEnum.LookupSecret]: [
    'lookup_secret_confirm',
    'lookup_secret_disable',
    'lookup_secret_regenerate',
    'lookup_secret_reveal',
  ],
  [UiNodeGroupEnum.Passkey]: ['passkey_remove', 'passkey_settings_register'],
  [UiNodeGroupEnum.Webauthn]: [
    'webauthn_register',
    'webauthn_register_displayname',
    'webauthn_remove',
  ],
  [UiNodeGroupEnum.Saml]: ['link', 'unlink', 'traits'],
}

export function filterSettingsFields(data: FormValues, method: string): FormValues {
  const allowed = settingsMethodFields[method]
  if (!allowed) return data

  const result: FormValues = {
    method,
  }

  if (data.csrf_token) result.csrf_token = data.csrf_token
  if (data.transient_payload) result.transient_payload = data.transient_payload

  for (const field of allowed) {
    if (field in data) {
      result[field] = data[field]
    }
  }

  return result
}

export function applySelectAccountPrompt(data: UpdateSettingsFlowBody): void {
  if (
    data.method === UiNodeGroupEnum.Oidc &&
    data.link &&
    supportsSelectAccountPrompt.includes(data.link)
  ) {
    data.upstream_parameters = { prompt: 'select_account' }
  }
}
