import { UiNodeGroupEnum } from "@ory/client-fetch"

export const allGroupEnums = Object.values(UiNodeGroupEnum)

export const excludedAuthGroups: UiNodeGroupEnum[] = [
  UiNodeGroupEnum.Default,
  UiNodeGroupEnum.IdentifierFirst,
  UiNodeGroupEnum.Profile,
  UiNodeGroupEnum.Captcha,
]

export const authMethodPickerExcludedGroups: UiNodeGroupEnum[] = [
  UiNodeGroupEnum.Oidc,
  UiNodeGroupEnum.Saml,
  UiNodeGroupEnum.Default,
  UiNodeGroupEnum.IdentifierFirst,
  UiNodeGroupEnum.Profile,
  UiNodeGroupEnum.Captcha,
]

export const defaultGroupOrder: UiNodeGroupEnum[] = [
  UiNodeGroupEnum.Default,
  UiNodeGroupEnum.Profile,
  UiNodeGroupEnum.Password,
  UiNodeGroupEnum.Oidc,
  UiNodeGroupEnum.Code,
  UiNodeGroupEnum.LookupSecret,
  UiNodeGroupEnum.Passkey,
  UiNodeGroupEnum.Webauthn,
  UiNodeGroupEnum.Totp,
]

export const defaultNodeOrder = [
  "oidc",
  "saml",
  "identifier_first",
  "default",
  "profile",
  "password",
  "captcha",
  "passkey",
  "code",
  "webauthn",
]
