import { UiNodeGroupEnum } from "@ory/client-fetch"

export const resendMessageId = 1070008

export const allGroupEnums = Object.values(UiNodeGroupEnum)

export const ignoredScriptGroups: UiNodeGroupEnum[] = [UiNodeGroupEnum.Captcha]

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

export const defaultHiddenMessageIds = [
  1040009, 1060003, 1080003, 1010004, 1010014, 1010025, 1040005, 1010016,
  1010003, 1060004, 1060005, 1060006,
]

export const omittedInputKeys = [
  "autocomplete",
  "label",
  "node_type",
  "maxlength",
  "onclick",
  "onclickTrigger",
  "onload",
  "onloadTrigger",
] as const

export const custonMessageIds = {
  "login.registration-button": 9000001,
  "login.registration-label": 9000002,
} as const

export type CustomMessageKey = keyof typeof custonMessageIds
