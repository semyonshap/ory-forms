import { TFunction } from 'i18next'
import { UiNodeGroupEnum } from '@ory/client-fetch'

const groupCardTitles: Record<string, string> = {
  [UiNodeGroupEnum.Totp]: 'settings.totp.title',
  [UiNodeGroupEnum.LookupSecret]: 'settings.lookup_secret.title',
  [UiNodeGroupEnum.Oidc]: 'settings.oidc.title',
  [UiNodeGroupEnum.Passkey]: 'settings.passkey.title',
  [UiNodeGroupEnum.Profile]: 'settings.profile.title',
  [UiNodeGroupEnum.Password]: 'settings.password.title',
  [UiNodeGroupEnum.Webauthn]: 'settings.webauthn.title',
  [UiNodeGroupEnum.Code]: 'settings.code.title',
  [UiNodeGroupEnum.Saml]: 'settings.oidc.title',
}

const groupCardDescriptions: Record<string, string> = {
  [UiNodeGroupEnum.Totp]: 'settings.totp.description',
  [UiNodeGroupEnum.LookupSecret]: 'settings.lookup_secret.description',
  [UiNodeGroupEnum.Oidc]: 'settings.oidc.description',
  [UiNodeGroupEnum.Passkey]: 'settings.passkey.description',
  [UiNodeGroupEnum.Profile]: 'settings.profile.description',
  [UiNodeGroupEnum.Password]: 'settings.password.description',
  [UiNodeGroupEnum.Webauthn]: 'settings.webauthn.description',
  [UiNodeGroupEnum.Code]: 'settings.code.description',
  [UiNodeGroupEnum.Saml]: 'settings.oidc.description',
}

export function getGroupHeader(
  group: UiNodeGroupEnum,
  t: TFunction,
): { title: string; description: string } {
  const titleKey = groupCardTitles[group] ?? `settings.${group}.title`
  const descriptionKey =
    groupCardDescriptions[group] ?? `settings.${group}.description`

  return {
    title: t(titleKey),
    description: t(descriptionKey),
  }
}
