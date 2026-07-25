Я переписываю библиотеку

1. Мне не нужен custom components, я хочу их харкодить
2. Я избавился от всех провайдеров и использую zustand provider, чтобы гибко передавать пропсы между компонентами
3. Я заменил react-intl на i18n
4. Я использую в submit @tanstack/react-query для того, чтобы удобнее работать в запросами

# File Contents

## ory/packages/elements-react/src/util/childCounter.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Children, ReactNode, isValidElement } from 'react'

export function countRenderableChildren(children: ReactNode | ReactNode[]) {
  return Children.toArray(children).filter((c) => {
    if (isValidElement(c)) {
      return true
    }
    return false
  }).length
}
```

## ory/packages/elements-react/src/util/client.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Configuration, ConfigurationParameters, FrontendApi } from '@ory/client-fetch'

export function frontendClient(sdkUrl: string, opts: Partial<ConfigurationParameters> = {}) {
  const config = new Configuration({
    ...opts,
    basePath: sdkUrl,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...opts.headers,
    },
  })
  return new FrontendApi(config)
}
```

## ory/packages/elements-react/src/util/clientConfiguration.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ConfigurationParameters } from '@ory/client-fetch'
import { Locale } from '../context/intl-context'
import { LocaleMap } from '../locales'

/**
 * The configuration for internationalization (i18n) in Ory Elements.
 *
 * This configuration is used to set the locale and can be used to provide custom translations.
 * The locale is used to determine the language of the UI.
 */
export type IntlConfig = {
  /**
   * The locale to use for internationalization.
   *
   * @defaultValue "en"
   */
  locale: Locale
  /**
   * Provide custom translations for the UI.
   */
  customTranslations?: Partial<LocaleMap>
}

/**
 * The configuration for Ory Elements.
 *
 * This configuration is used to customize the behavior and appearance of Ory Elements.
 *
 * By setting UI urls, you can override the default URLs for the login, registration, recovery, and verification flows.
 *
 * You can also set the name of the application, the logo URL, and the SDK configuration.
 * By default, the name and logo are displayed in the card's header.
 */
export interface OryClientConfiguration {
  /**
   * The SDK configuration.
   * This configuration is used to set the URL of the Ory SDK and any additional options used for the SDK client.
   */
  sdk?: {
    /**
     * The URL the Ory SDK should connect to.
     * This is typically the base URL of your Ory instance.
     */
    url?: string
    /**
     * Additional parameters for the Ory SDK configuration.
     * This can include options like headers, credentials, and other settings.
     */
    options?: Partial<ConfigurationParameters>
  }

  /**
   * The internationalization configuration.
   * This configuration is used to set the locale and any additional options used for the i18n library.
   * The locale is used to determine the language of the UI.
   * The default locale is "en".
   */
  intl?: IntlConfig

  /**
   * The configuration for the project.
   */
  project: ProjectConfiguration
}

/**
 * The project configuration for Ory Elements.
 *
 * This configuration is used to set various URLs and settings for the Ory Elements project.
 */
export interface ProjectConfiguration {
  /**
   * The default redirect URI as configured in the Ory Kratos configuration
   */
  default_redirect_url: string
  /**
   * The URL for the error UI.
   */
  error_ui_url: string
  /**
   * The URL for the login UI.
   */
  login_ui_url: string
  /**
   * The URL for the dark logo.
   *
   * Currently unused.
   */
  logo_dark_url?: string
  /**
   * The URL for the light logo on the auth card.
   */
  logo_light_url?: string
  /**
   * The name of the project displayed on the auth card.
   */
  name: string
  /**
   * Whether recovery is enabled.
   *
   * Used to determine if the "Forgot Password" link is shown on the password input elements.
   */
  recovery_enabled: boolean
  /**
   * The URL for the recovery UI.
   */
  recovery_ui_url: string
  /**
   * Whether to hide the Ory branding badge on the account experience card.
   *
   * Defaults to `false`. Customers on qualifying plans can opt into hiding it.
   */
  hide_ory_branding?: boolean
  /**
   * Whether registration is enabled.
   *
   * Used to determine if the "Sign Up" link is shown on the login card.
   */
  registration_enabled: boolean
  /**
   * When true, hides the "Sign up" link on the login card footer even
   * if registration is enabled. Cosmetic only; does not affect the
   * registration flow itself. Defaults to false.
   */
  hide_registration_link?: boolean
  /**
   * The URL for the registration UI.
   */
  registration_ui_url: string
  /**
   * The URL for the settings UI.
   */
  settings_ui_url: string
  /**
   * Whether verification is enabled.
   *
   * Currently unused.
   */
  verification_enabled: boolean
  /**
   * The URL for the verification UI.
   *
   * Currently unused.
   */
  verification_ui_url: string
}
```

## ory/packages/elements-react/src/util/events.ts

````typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ErrorFlowReplaced,
  FlowType,
  GenericError,
  Identity,
  LoginFlow,
  OAuth2ConsentRequest,
  RecoveryFlow,
  RegistrationFlow,
  SelfServiceFlowExpiredError,
  Session,
  SettingsFlow,
  VerificationFlow,
} from '@ory/client-fetch'

// ---------------------------------------------------------------------------
// Success events — discriminated on `flowType`
// ---------------------------------------------------------------------------

/**
 * Event fired after a successful login, before the redirect.
 *
 * `session.identity` contains the authenticated user. Use `session.identity.id`
 * for analytics session stitching (e.g., `mixpanel.identify`).
 *
 * @group Events
 */
export type OryLoginSuccessEvent = {
  flowType: FlowType.Login
  flow: LoginFlow
  session: Session
  method: string
}

/**
 * Event fired after a successful registration, before the redirect.
 *
 * @group Events
 */
export type OryRegistrationSuccessEvent = {
  flowType: FlowType.Registration
  flow: RegistrationFlow
  identity: Identity
  session?: Session
  method: string
}

/**
 * Event fired after a successful verification submission.
 *
 * This fires when the server accepts the verification form (e.g., a code was
 * submitted). It does not necessarily mean the identity is verified — check the
 * flow state for that.
 *
 * @group Events
 */
export type OryVerificationSuccessEvent = {
  flowType: FlowType.Verification
  flow: VerificationFlow
  method: string
}

/**
 * Event fired after a successful recovery submission.
 *
 * This fires when the server accepts the recovery form (e.g., a code or email
 * was submitted). The user may still need to complete additional steps.
 *
 * @group Events
 */
export type OryRecoverySuccessEvent = {
  flowType: FlowType.Recovery
  flow: RecoveryFlow
  method: string
}

/**
 * Event fired after a successful settings update.
 *
 * @group Events
 */
export type OrySettingsSuccessEvent = {
  flowType: FlowType.Settings
  flow: SettingsFlow
  method: string
}

/**
 * Event fired after a successful OAuth2 consent submission.
 *
 * @group Events
 */
export type OryConsentSuccessEvent = {
  flowType: FlowType.OAuth2Consent
  consentRequest: OAuth2ConsentRequest
}

/**
 * Discriminated union of all success events emitted by Ory Elements.
 *
 * Use the `flowType` field to narrow:
 * ```ts
 * onSuccess={async (event) => {
 *   if (event.flowType === FlowType.Login) {
 *     await mixpanel.identify(event.session.identity.id)
 *   }
 * }}
 * ```
 *
 * @group Events
 */
export type OrySuccessEvent =
  | OryLoginSuccessEvent
  | OryRegistrationSuccessEvent
  | OryVerificationSuccessEvent
  | OryRecoverySuccessEvent
  | OrySettingsSuccessEvent
  | OryConsentSuccessEvent

// ---------------------------------------------------------------------------
// Validation error events — discriminated on `flowType`
// ---------------------------------------------------------------------------

/**
 * Discriminated union of validation error events. Each variant carries the
 * updated flow object. Consumers extract messages from `flow.ui` themselves.
 *
 * @group Events
 */
export type OryValidationErrorEvent =
  | { flowType: FlowType.Login; flow: LoginFlow }
  | { flowType: FlowType.Registration; flow: RegistrationFlow }
  | { flowType: FlowType.Verification; flow: VerificationFlow }
  | { flowType: FlowType.Recovery; flow: RecoveryFlow }
  | { flowType: FlowType.Settings; flow: SettingsFlow }

// ---------------------------------------------------------------------------
// Error events — discriminated on `type`
// ---------------------------------------------------------------------------

/**
 * Discriminated union of infrastructure/flow error events. Uses SDK error types
 * from `@ory/client-fetch`.
 *
 * @group Events
 */
export type OryErrorEvent =
  | {
      type: 'flow_expired'
      flowType: FlowType
      body: SelfServiceFlowExpiredError
    }
  | { type: 'csrf_error'; flowType: FlowType; body: GenericError }
  | { type: 'flow_not_found'; flowType: FlowType }
  | { type: 'flow_replaced'; flowType: FlowType; body: ErrorFlowReplaced }
  | {
      type: 'consent_error'
      flowType: FlowType.OAuth2Consent
      consentRequest: OAuth2ConsentRequest
    }

// ---------------------------------------------------------------------------
// Handler types
// ---------------------------------------------------------------------------

/**
 * Callback invoked on a successful flow submission. Returning a `Promise`
 * delays the default behavior (redirect, flow update) until the promise
 * resolves.
 *
 * @group Events
 */
export type OrySuccessHandler = (event: OrySuccessEvent) => void | Promise<void>

/**
 * Callback invoked when the server returns validation errors for a form
 * submission.
 *
 * @group Events
 */
export type OryValidationErrorHandler = (event: OryValidationErrorEvent) => void | Promise<void>

/**
 * Callback invoked on infrastructure or flow-level errors (expired flow, CSRF
 * violation, flow not found, flow replaced).
 *
 * @group Events
 */
export type OryErrorHandler = (event: OryErrorEvent) => void | Promise<void>
````

## ory/packages/elements-react/src/util/flowContainer.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowError,
  FlowType,
  LoginFlow,
  OAuth2ConsentRequest,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  UiContainer,
  VerificationFlow,
} from '@ory/client-fetch'

/**
 * A flow container for the {@link LoginFlow}
 * @interface
 */
export type LoginFlowContainer = {
  flowType: FlowType.Login
  flow: LoginFlow
}

/**
 * A flow container for the {@link RegistrationFlow}
 * @interface
 */
export type RegistrationFlowContainer = {
  flowType: FlowType.Registration
  flow: RegistrationFlow
}

/**
 * A flow container for the {@link RecoveryFlow}
 * @interface
 */
export type RecoveryFlowContainer = {
  flowType: FlowType.Recovery
  flow: RecoveryFlow
}

/**
 * A flow container for the {@link VerificationFlow}
 * @interface
 */
export type VerificationFlowContainer = {
  flowType: FlowType.Verification
  flow: VerificationFlow
}
/**
 * A flow container for the {@link SettingsFlow}
 * @interface
 */
export type SettingsFlowContainer = {
  flowType: FlowType.Settings
  flow: SettingsFlow
}

/**
 * A flow container for the {@link FlowError}
 * @interface
 */
export type ErrorFlowContainer = { flowType: FlowType.Error; flow: FlowError }

/**
 * A flow container for the OAuth2 consent flow
 *
 * Note: This is a polyfill for the OAuth2 consent flow, which is not yet implemented in the Ory SDK.
 * It tries to mirror the structure of the other flow containers as closely as possible.
 * @interface
 */
export type ConsentFlow = {
  /**
   * When the flow was created.
   */
  created_at: Date
  /**
   * When the flow expires.
   */
  expires_at: Date
  /**
   * Always "UNSET" as the consent flow does not have a specific ID.
   */
  id: 'UNSET'
  /**
   * When the flow was issued.
   */
  issued_at: Date
  /**
   * The state of the consent flow.
   *
   * - "show_form": The form is being shown to the user.
   * - "rejected": The user has rejected the consent request.
   * - "accepted": The user has accepted the consent request.
   */
  state: 'show_form' | 'rejected' | 'accepted'
  /**
   * The active part of the flow, which is always "oauth2_consent" for this flow.
   */
  active: 'oauth2_consent'
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
}

/**
 * A flow container for the OAuth2 {@link ConsentFlow}
 * @interface
 */
export type ConsentFlowContainer = {
  flowType: FlowType.OAuth2Consent
  flow: ConsentFlow
}

/**
 * A union type of all flow containers
 */
export type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
  | ConsentFlowContainer
// TODO: Add ErrorFlowContainer
```

## ory/packages/elements-react/src/util/flowHasErrors.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

import { UiContainer } from '@ory/client-fetch'

/**
 * Returns true if the flow UI contains any error-type messages, either at the
 * top level (`ui.messages`) or on individual nodes (`ui.nodes[*].messages`).
 *
 * Kratos returns a 400 status code both for actual validation errors and for
 * multi-step flow transitions (e.g. identifier_first, profile_first, one-time
 * code). This helper distinguishes the two cases so that consumers only receive
 * `onValidationError` events when real errors are present.
 */
export function flowHasErrors(ui: UiContainer): boolean {
  if (ui.messages?.some((m) => m.type === 'error')) {
    return true
  }
  return ui.nodes.some((node) => node.messages.some((m) => m.type === 'error'))
}
```

## ory/packages/elements-react/src/util/i18n/generated/kratosMessages.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { defineMessages } from 'react-intl'

const KNOWN_KRATOS_MESSAGE_IDS = [
  1010001, 1010002, 1010003, 1010004, 1010005, 1010006, 1010007, 1010008, 1010009, 1010010, 1010011,
  1010012, 1010013, 1010014, 1010015, 1010016, 1010017, 1010018, 1010019, 1010021, 1010022, 1010023,
  1010024, 1010025, 1040001, 1040002, 1040003, 1040004, 1040005, 1040006, 1040007, 1040008, 1040009,
  1050001, 1050002, 1050003, 1050004, 1050005, 1050006, 1050007, 1050008, 1050009, 1050010, 1050011,
  1050012, 1050013, 1050014, 1050015, 1050016, 1050017, 1050018, 1050019, 1050020, 1050023, 1060001,
  1060002, 1060003, 1060004, 1060005, 1060006, 1060007, 1070001, 1070002, 1070003, 1070004, 1070005,
  1070006, 1070007, 1070008, 1070009, 1070010, 1070011, 1070012, 1070013, 1070014, 1070015, 1070016,
  1070017, 1070018, 1080001, 1080002, 1080003, 1080004, 1080005, 4000001, 4000002, 4000003, 4000004,
  4000005, 4000006, 4000007, 4000008, 4000009, 4000010, 4000011, 4000012, 4000013, 4000014, 4000015,
  4000016, 4000017, 4000018, 4000019, 4000020, 4000021, 4000022, 4000023, 4000024, 4000025, 4000026,
  4000027, 4000028, 4000029, 4000030, 4000031, 4000032, 4000033, 4000034, 4000035, 4000036, 4000037,
  4000038, 4000039, 4000040, 4000041, 4000042, 4000043, 4000044, 4000045, 4010001, 4010002, 4010003,
  4010004, 4010005, 4010006, 4010007, 4010008, 4010009, 4010010, 4010011, 4040001, 4040002, 4040003,
  4050001, 4050002, 4060001, 4060002, 4060004, 4060005, 4060006, 4070001, 4070002, 4070003, 4070005,
  4070006, 5000001, 5000002, 5000003,
] as const

export type KratosMessageId = (typeof KNOWN_KRATOS_MESSAGE_IDS)[number]

export function isKratosMessageId(id: unknown): id is KratosMessageId {
  return typeof id === 'number' && KNOWN_KRATOS_MESSAGE_IDS.includes(id as KratosMessageId)
}

export const kratosMessages = defineMessages<number>({
  1010001: {
    id: 'identities.messages.1010001',
    defaultMessage: `Sign in`,
  },
  1010002: {
    id: 'identities.messages.1010002',
    defaultMessage: `Sign in with {provider}`,
  },
  1010003: {
    id: 'identities.messages.1010003',
    defaultMessage: `Please confirm this action by verifying that it is you.`,
  },
  1010004: {
    id: 'identities.messages.1010004',
    defaultMessage: `Please complete the second authentication challenge.`,
  },
  1010005: {
    id: 'identities.messages.1010005',
    defaultMessage: `Verify`,
  },
  1010006: {
    id: 'identities.messages.1010006',
    defaultMessage: `Authentication code`,
  },
  1010007: {
    id: 'identities.messages.1010007',
    defaultMessage: `Backup recovery code`,
  },
  1010008: {
    id: 'identities.messages.1010008',
    defaultMessage: `Continue with hardware key`,
  },
  1010009: {
    id: 'identities.messages.1010009',
    defaultMessage: `Continue`,
  },
  1010010: {
    id: 'identities.messages.1010010',
    defaultMessage: `Continue`,
  },
  1010011: {
    id: 'identities.messages.1010011',
    defaultMessage: `Sign in with a hardware key`,
  },
  1010012: {
    id: 'identities.messages.1010012',
    defaultMessage: `Prepare your WebAuthn device (e.g. security key, biometrics scanner, ...) and press continue.`,
  },
  1010013: {
    id: 'identities.messages.1010013',
    defaultMessage: `Continue`,
  },
  1010014: {
    id: 'identities.messages.1010014',
    defaultMessage: `A code was sent to the address you provided. If you didn't receive it, please check the spelling of the address and try again.`,
  },
  1010015: {
    id: 'identities.messages.1010015',
    defaultMessage: `Send sign in code`,
  },
  1010016: {
    id: 'identities.messages.1010016',
    defaultMessage: `You tried to sign in with "{duplicateIdentifier}", but that email is already used by another account. Sign in to your account with one of the options below to add your account "{duplicateIdentifier}" at "{provider}" as another way to sign in.`,
  },
  1010017: {
    id: 'identities.messages.1010017',
    defaultMessage: `Sign in and link`,
  },
  1010018: {
    id: 'identities.messages.1010018',
    defaultMessage: `Confirm with {provider}`,
  },
  1010019: {
    id: 'identities.messages.1010019',
    defaultMessage: `Request code to continue`,
  },
  1010021: {
    id: 'identities.messages.1010021',
    defaultMessage: `Sign in with passkey`,
  },
  1010022: {
    id: 'identities.messages.1010022',
    defaultMessage: `Sign in with password`,
  },
  1010023: {
    id: 'identities.messages.1010023',
    defaultMessage: `Send code to {address}`,
  },
  1010024: {
    id: 'identities.messages.1010024',
    defaultMessage: `Sign in with a hardware key`,
  },
  1010025: {
    id: 'identities.messages.1010025',
    defaultMessage: `A code was sent to your address. If you didn't receive it, please try again.`,
  },
  1040001: {
    id: 'identities.messages.1040001',
    defaultMessage: `Sign up`,
  },
  1040002: {
    id: 'identities.messages.1040002',
    defaultMessage: `Sign up with {provider}`,
  },
  1040003: {
    id: 'identities.messages.1040003',
    defaultMessage: `Continue`,
  },
  1040004: {
    id: 'identities.messages.1040004',
    defaultMessage: `Sign up with security key`,
  },
  1040005: {
    id: 'identities.messages.1040005',
    defaultMessage: `A code has been sent to the address(es) you provided. If you have not received a message, check the spelling of the address and retry the registration.`,
  },
  1040006: {
    id: 'identities.messages.1040006',
    defaultMessage: `Send sign up code`,
  },
  1040007: {
    id: 'identities.messages.1040007',
    defaultMessage: `Sign up with passkey`,
  },
  1040008: {
    id: 'identities.messages.1040008',
    defaultMessage: `Back`,
  },
  1040009: {
    id: 'identities.messages.1040009',
    defaultMessage: `Please choose a credential to authenticate yourself with.`,
  },
  1050001: {
    id: 'identities.messages.1050001',
    defaultMessage: `Your changes have been saved!`,
  },
  1050002: {
    id: 'identities.messages.1050002',
    defaultMessage: `Link {provider}`,
  },
  1050003: {
    id: 'identities.messages.1050003',
    defaultMessage: `Unlink {provider}`,
  },
  1050004: {
    id: 'identities.messages.1050004',
    defaultMessage: `Unlink TOTP Authenticator App`,
  },
  1050005: {
    id: 'identities.messages.1050005',
    defaultMessage: `Authenticator app QR code`,
  },
  1050006: {
    id: 'identities.messages.1050006',
    defaultMessage: `{secret}`,
  },
  1050007: {
    id: 'identities.messages.1050007',
    defaultMessage: `Reveal backup recovery codes`,
  },
  1050008: {
    id: 'identities.messages.1050008',
    defaultMessage: `Enable`,
  },
  1050009: {
    id: 'identities.messages.1050009',
    defaultMessage: `{secret}`,
  },
  1050010: {
    id: 'identities.messages.1050010',
    defaultMessage: `These are your back up recovery codes. Please keep them in a safe place!`,
  },
  1050011: {
    id: 'identities.messages.1050011',
    defaultMessage: `Confirm backup recovery codes`,
  },
  1050012: {
    id: 'identities.messages.1050012',
    defaultMessage: `Add security key`,
  },
  1050013: {
    id: 'identities.messages.1050013',
    defaultMessage: `Name of the security key`,
  },
  1050014: {
    id: 'identities.messages.1050014',
    defaultMessage: `Secret was used at {used_at, date, long}`,
  },
  1050015: {
    id: 'identities.messages.1050015',
    defaultMessage: `{secrets_list}`,
  },
  1050016: {
    id: 'identities.messages.1050016',
    defaultMessage: `Disable this method`,
  },
  1050017: {
    id: 'identities.messages.1050017',
    defaultMessage: `Authenticator Secret`,
  },
  1050018: {
    id: 'identities.messages.1050018',
    defaultMessage: `Remove security key "{display_name}"`,
  },
  1050019: {
    id: 'identities.messages.1050019',
    defaultMessage: `Add passkey`,
  },
  1050020: {
    id: 'identities.messages.1050020',
    defaultMessage: `Remove passkey "{display_name}"`,
  },
  1050023: {
    id: 'identities.messages.1050023',
    defaultMessage: `Your account is managed by your organization. To change these settings, contact your organization administrator.`,
  },
  1060001: {
    id: 'identities.messages.1060001',
    defaultMessage: `You successfully recovered your account. Please change your password or set up an alternative login method (e.g. social sign in) within the next {privileged_session_expires_at_unix_until_minutes} minutes.`,
  },
  1060002: {
    id: 'identities.messages.1060002',
    defaultMessage: `An email containing a recovery link has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1060003: {
    id: 'identities.messages.1060003',
    defaultMessage: `An email containing a recovery code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1060004: {
    id: 'identities.messages.1060004',
    defaultMessage: `A recovery code has been sent to {masked_address}. If you have not received it, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1060005: {
    id: 'identities.messages.1060005',
    defaultMessage: `Recover access to your account by providing your recovery address in full.`,
  },
  1060006: {
    id: 'identities.messages.1060006',
    defaultMessage: `How do you want to recover your account?`,
  },
  1060007: {
    id: 'identities.messages.1060007',
    defaultMessage: `Back`,
  },
  1070001: {
    id: 'identities.messages.1070001',
    defaultMessage: `Password`,
  },
  1070002: {
    id: 'identities.messages.1070002',
    defaultMessage: `{title}`,
  },
  1070003: {
    id: 'identities.messages.1070003',
    defaultMessage: `Save`,
  },
  1070004: {
    id: 'identities.messages.1070004',
    defaultMessage: `ID`,
  },
  1070005: {
    id: 'identities.messages.1070005',
    defaultMessage: `Submit`,
  },
  1070006: {
    id: 'identities.messages.1070006',
    defaultMessage: `Verify code`,
  },
  1070007: {
    id: 'identities.messages.1070007',
    defaultMessage: `Email`,
  },
  1070008: {
    id: 'identities.messages.1070008',
    defaultMessage: `Resend code`,
  },
  1070009: {
    id: 'identities.messages.1070009',
    defaultMessage: `Continue`,
  },
  1070010: {
    id: 'identities.messages.1070010',
    defaultMessage: `Recovery code`,
  },
  1070011: {
    id: 'identities.messages.1070011',
    defaultMessage: `Verification code`,
  },
  1070012: {
    id: 'identities.messages.1070012',
    defaultMessage: `Registration code`,
  },
  1070013: {
    id: 'identities.messages.1070013',
    defaultMessage: `Login code`,
  },
  1070014: {
    id: 'identities.messages.1070014',
    defaultMessage: `Login and link credential`,
  },
  1070015: {
    id: 'identities.messages.1070015',
    defaultMessage: `Please complete the captcha challenge to continue.`,
  },
  1070016: {
    id: 'identities.messages.1070016',
    defaultMessage: `Recovery address`,
  },
  1070017: {
    id: 'identities.messages.1070017',
    defaultMessage: `Phone number`,
  },
  1070018: {
    id: 'identities.messages.1070018',
    defaultMessage: `Email or phone number`,
  },
  1080001: {
    id: 'identities.messages.1080001',
    defaultMessage: `An email containing a verification link has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1080002: {
    id: 'identities.messages.1080002',
    defaultMessage: `You successfully verified your email address.`,
  },
  1080003: {
    id: 'identities.messages.1080003',
    defaultMessage: `An email containing a verification code has been sent to the email address you provided. If you have not received an email, check the spelling of the address and make sure to use the address you registered with.`,
  },
  1080004: {
    id: 'identities.messages.1080004',
    defaultMessage: `A text message containing a verification code has been sent to the phone number you provided. If you have not received a text message, check the spelling of the number and make sure to use the number you registered with.`,
  },
  1080005: {
    id: 'identities.messages.1080005',
    defaultMessage: `You successfully verified your phone number.`,
  },
  4000001: {
    id: 'identities.messages.4000001',
    defaultMessage: `{reason}`,
  },
  4000002: {
    id: 'identities.messages.4000002',
    defaultMessage: `Please enter the {property} and try again.`,
  },
  4000003: {
    id: 'identities.messages.4000003',
    defaultMessage: `length must be >= {min_length}, but got {actual_length}`,
  },
  4000004: {
    id: 'identities.messages.4000004',
    defaultMessage: `does not match pattern "{pattern}"`,
  },
  4000005: {
    id: 'identities.messages.4000005',
    defaultMessage: `The password can not be used because {reason}.`,
  },
  4000006: {
    id: 'identities.messages.4000006',
    defaultMessage: `The provided credentials are invalid, check for spelling mistakes in your password or username, email address, or phone number.`,
  },
  4000007: {
    id: 'identities.messages.4000007',
    defaultMessage: `An account with the same identifier (email, phone, username, ...) exists already.`,
  },
  4000008: {
    id: 'identities.messages.4000008',
    defaultMessage: `The provided authentication code is invalid, please try again.`,
  },
  4000009: {
    id: 'identities.messages.4000009',
    defaultMessage: `Could not find any login identifiers. Did you forget to set them? This could also be caused by a server misconfiguration.`,
  },
  4000010: {
    id: 'identities.messages.4000010',
    defaultMessage: `Account not active yet. Did you forget to verify your email address?`,
  },
  4000011: {
    id: 'identities.messages.4000011',
    defaultMessage: `You have no TOTP device set up.`,
  },
  4000012: {
    id: 'identities.messages.4000012',
    defaultMessage: `This backup recovery code has already been used.`,
  },
  4000013: {
    id: 'identities.messages.4000013',
    defaultMessage: `You have no WebAuthn device set up.`,
  },
  4000014: {
    id: 'identities.messages.4000014',
    defaultMessage: `You have no backup recovery codes set up.`,
  },
  4000015: {
    id: 'identities.messages.4000015',
    defaultMessage: `This account does not exist or has no security key set up.`,
  },
  4000016: {
    id: 'identities.messages.4000016',
    defaultMessage: `The backup recovery code is not valid.`,
  },
  4000017: {
    id: 'identities.messages.4000017',
    defaultMessage: `length must be <= {max_length}, but got {actual_length}`,
  },
  4000018: {
    id: 'identities.messages.4000018',
    defaultMessage: `must be >= {minimum} but found {actual}`,
  },
  4000019: {
    id: 'identities.messages.4000019',
    defaultMessage: `must be > {minimum} but found {actual}`,
  },
  4000020: {
    id: 'identities.messages.4000020',
    defaultMessage: `must be <= {maximum} but found {actual}`,
  },
  4000021: {
    id: 'identities.messages.4000021',
    defaultMessage: `must be < {maximum} but found {actual}`,
  },
  4000022: {
    id: 'identities.messages.4000022',
    defaultMessage: `{actual} not multipleOf {base}`,
  },
  4000023: {
    id: 'identities.messages.4000023',
    defaultMessage: `maximum {max_items} items allowed, but found {actual_items} items`,
  },
  4000024: {
    id: 'identities.messages.4000024',
    defaultMessage: `minimum {min_items} items allowed, but found {actual_items} items`,
  },
  4000025: {
    id: 'identities.messages.4000025',
    defaultMessage: `items at index {index_a} and {index_b} are equal`,
  },
  4000026: {
    id: 'identities.messages.4000026',
    defaultMessage: `expected {allowed_types_list}, but got {actual_type}`,
  },
  4000027: {
    id: 'identities.messages.4000027',
    defaultMessage: `An account with the same identifier (email, phone, username, ...) exists already. Please sign in to your existing account to link your social profile.`,
  },
  4000028: {
    id: 'identities.messages.4000028',
    defaultMessage: `You tried signing in with {credential_identifier_hint} which is already in use by another account. You can sign in using {available_credential_types_list}. You can sign in using one of the following social sign in providers: {available_oidc_providers_list}.`,
  },
  4000029: {
    id: 'identities.messages.4000029',
    defaultMessage: `must be equal to constant {expected}`,
  },
  4000030: {
    id: 'identities.messages.4000030',
    defaultMessage: `const failed`,
  },
  4000031: {
    id: 'identities.messages.4000031',
    defaultMessage: `The password can not be used because it is too similar to the identifier.`,
  },
  4000032: {
    id: 'identities.messages.4000032',
    defaultMessage: `The password must be at least {min_length} characters long, but got {actual_length}.`,
  },
  4000033: {
    id: 'identities.messages.4000033',
    defaultMessage: `The password must be at most {max_length} characters long, but got {actual_length}.`,
  },
  4000034: {
    id: 'identities.messages.4000034',
    defaultMessage: `The password has been found in data breaches and must no longer be used.`,
  },
  4000035: {
    id: 'identities.messages.4000035',
    defaultMessage: `This account does not exist or has not setup sign in with code.`,
  },
  4000036: {
    id: 'identities.messages.4000036',
    defaultMessage: `The provided traits do not match the traits previously associated with this flow.`,
  },
  4000037: {
    id: 'identities.messages.4000037',
    defaultMessage: `This account does not exist or has no login method configured.`,
  },
  4000038: {
    id: 'identities.messages.4000038',
    defaultMessage: `Captcha verification failed, please try again.`,
  },
  4000039: {
    id: 'identities.messages.4000039',
    defaultMessage: `The new password must be different from the old password.`,
  },
  4000040: {
    id: 'identities.messages.4000040',
    defaultMessage: `Enter a valid email address`,
  },
  4000041: {
    id: 'identities.messages.4000041',
    defaultMessage: `Enter a valid phone number`,
  },
  4000042: {
    id: 'identities.messages.4000042',
    defaultMessage: `You have no DeviceAuthn device set up.`,
  },
  4000043: {
    id: 'identities.messages.4000043',
    defaultMessage: `The provided web authn login is invalid, please try again.`,
  },
  4000044: {
    id: 'identities.messages.4000044',
    defaultMessage: `The provided DeviceAuthn signature is invalid.`,
  },
  4000045: {
    id: 'identities.messages.4000045',
    defaultMessage: `This DeviceAuthn key can no longer be used because relaxed attestation is expired or disabled. Please enroll your device again.`,
  },
  4010001: {
    id: 'identities.messages.4010001',
    defaultMessage: `The interaction expired. Please try again.`,
  },
  4010002: {
    id: 'identities.messages.4010002',
    defaultMessage: `Could not find a strategy to log you in with. Did you fill out the form correctly?`,
  },
  4010003: {
    id: 'identities.messages.4010003',
    defaultMessage: `Could not find a strategy to sign you up with. Did you fill out the form correctly?`,
  },
  4010004: {
    id: 'identities.messages.4010004',
    defaultMessage: `Could not find a strategy to update your settings. Did you fill out the form correctly?`,
  },
  4010005: {
    id: 'identities.messages.4010005',
    defaultMessage: `Could not find a strategy to recover your account with. Did you fill out the form correctly?`,
  },
  4010006: {
    id: 'identities.messages.4010006',
    defaultMessage: `Could not find a strategy to verify your account with. Did you fill out the form correctly?`,
  },
  4010007: {
    id: 'identities.messages.4010007',
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4010008: {
    id: 'identities.messages.4010008',
    defaultMessage: `The login code is invalid or has already been used. Please try again.`,
  },
  4010009: {
    id: 'identities.messages.4010009',
    defaultMessage: `Linked credentials do not match.`,
  },
  4010010: {
    id: 'identities.messages.4010010',
    defaultMessage: `The address you entered does not match any known addresses in the current account.`,
  },
  4010011: {
    id: 'identities.messages.4010011',
    defaultMessage: `This account has been disabled. Please contact support for assistance.`,
  },
  4040001: {
    id: 'identities.messages.4040001',
    defaultMessage: `The interaction expired. Please try again.`,
  },
  4040002: {
    id: 'identities.messages.4040002',
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4040003: {
    id: 'identities.messages.4040003',
    defaultMessage: `The registration code is invalid or has already been used. Please try again.`,
  },
  4050001: {
    id: 'identities.messages.4050001',
    defaultMessage: `The interaction expired. Please try again.`,
  },
  4050002: {
    id: 'identities.messages.4050002',
    defaultMessage: `You can only change one address at a time. Please update each address separately.`,
  },
  4060001: {
    id: 'identities.messages.4060001',
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4060002: {
    id: 'identities.messages.4060002',
    defaultMessage: `The recovery flow reached a failure state and must be retried.`,
  },
  4060004: {
    id: 'identities.messages.4060004',
    defaultMessage: `The recovery token is invalid or has already been used. Please retry the flow.`,
  },
  4060005: {
    id: 'identities.messages.4060005',
    defaultMessage: `The interaction expired. Please try again.`,
  },
  4060006: {
    id: 'identities.messages.4060006',
    defaultMessage: `The recovery code is invalid or has already been used. Please try again.`,
  },
  4070001: {
    id: 'identities.messages.4070001',
    defaultMessage: `The verification token is invalid or has already been used. Please retry the flow.`,
  },
  4070002: {
    id: 'identities.messages.4070002',
    defaultMessage: `The request was already completed successfully and can not be retried.`,
  },
  4070003: {
    id: 'identities.messages.4070003',
    defaultMessage: `The verification flow reached a failure state and must be retried.`,
  },
  4070005: {
    id: 'identities.messages.4070005',
    defaultMessage: `The interaction expired. Please try again.`,
  },
  4070006: {
    id: 'identities.messages.4070006',
    defaultMessage: `The verification code is invalid or has already been used. Please try again.`,
  },
  5000001: {
    id: 'identities.messages.5000001',
    defaultMessage: `{reason}`,
  },
  5000002: {
    id: 'identities.messages.5000002',
    defaultMessage: `No authentication methods are available. Please contact the system administrator.`,
  },
  5000003: {
    id: 'identities.messages.5000003',
    defaultMessage: `Your organization requires SSO authentication, but no SSO provider is configured. Please contact the system administrator.`,
  },
})
```

## ory/packages/elements-react/src/util/i18n/index.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from '@ory/client-fetch'
import { defineMessages, IntlShape, useIntl } from 'react-intl'
import { isDynamicText } from '../nodes'
import { isKratosMessageId, kratosMessages } from './generated/kratosMessages'

/**
 * Converts a UiText to a FormattedMessage.
 * The UiText contains the id of the message and the context.
 * The context is used to inject values into the message from Ory, e.g. a timestamp.
 * For example a UI Node from Ory might look like this:
 *
 * ```json
 * {
 *  "type":"input",
 *  "group":"default",
 *  "attributes": {
 *      "name":"traits.email",
 *      "type":"email",
 *      "required":true,
 *      "autocomplete":"email",
 *      "disabled":false,
 *      "node_type":"input"
 *  },
 *  "messages":[],
 *  "meta": {
 *    "label": {
 *      "id":1070002,
 *      "text":"E-Mail",
 *      "type":"info",
 *      "context":{
 *        "title":"E-Mail"
 *      },
 *    }
 *  }
 * }
 * ```
 *
 * The context has the key "title" which matches the formatter template name "\{title\}"
 * An example translation file would look like this:
 * ```json
 * {
 *  "identities.messages.1070002": "{title}"
 * }
 * ```
 *
 * The formatter would then take the meta.label.id and look for the translation with the key matching the id.
 * It would then replace the template "\{title\}" with the value from the context with the key "title".
 *
 * @param uiText - The UiText is part of the UiNode object sent by Kratos when performing a flow.
 * @param intl - The intl object from react-intl
 * @group Utilities
 */
export const uiTextToFormattedMessage = (
  { id, context = {}, text }: Omit<UiText, 'type'>,
  intl: IntlShape,
) => {
  const contextInjectedMessage = Object.entries(context).reduce((accumulator, [key, value]) => {
    // context might provide an array of objects instead of a single object
    // for example when looking up a recovery code
    if (Array.isArray(value)) {
      return {
        ...accumulator,
        [key]: value,
        [key + '_list']: intl.formatList<string>(value),
      }
    } else if (key.endsWith('_unix')) {
      if (typeof value === 'number') {
        return {
          ...accumulator,
          [key]: intl.formatDate(new Date(value * 1000)),
          [key + '_since']: intl.formatDateTimeRange(new Date(value), new Date()),
          [key + '_since_minutes']: Math.ceil((value - new Date().getTime() / 1000) / 60).toFixed(
            0,
          ),
          [key + '_until']: intl.formatDateTimeRange(new Date(), new Date(value)),
          [key + '_until_minutes']: Math.ceil((value - new Date().getTime() / 1000) / 60).toFixed(
            0,
          ),
        }
      }
    } else if (key === 'property') {
      if (isKnownPropertyKey(value)) {
        return {
          ...accumulator,
          [key]: intl.formatMessage(propertyMessages[value]),
        }
      } else {
        return {
          ...accumulator,
          [key]: value,
        }
      }
    }
    return {
      ...accumulator,
      [key]: value as string | number,
    }
  }, {})

  if (isKratosMessageId(id)) {
    const hasEmptyArrayContext = Object.values(context).some(
      (v) => Array.isArray(v) && v.length === 0,
    )
    if (hasEmptyArrayContext) {
      return text
    }
    return intl.formatMessage(kratosMessages[id], contextInjectedMessage)
  }

  return text
}

export function resolvePlaceholder(text: UiText, intl: ReturnType<typeof useIntl>) {
  const fallback = intl.formatMessage(
    {
      id: 'input.placeholder',
      defaultMessage: 'Enter your {placeholder}',
    },
    {
      placeholder: uiTextToFormattedMessage(text, intl),
    },
  )
  if (isDynamicText(text)) {
    const field = text.context.name
    const msg = {
      id: `forms.input.placeholder.${field}`,
      defaultMessage: fallback,
    }
    return intl.formatMessage(msg)
  }
  return fallback
}

const KNOWN_PROPERTIES = [
  'password',
  'email',
  'phone',
  'username',
  'identifier',
  'code',
  'recovery_address',
]

type PropertyKey = (typeof KNOWN_PROPERTIES)[number]

function isKnownPropertyKey(key: unknown): key is PropertyKey {
  return typeof key === 'string' && KNOWN_PROPERTIES.includes(key)
}

const propertyMessages = defineMessages<PropertyKey>({
  password: { id: 'property.password', defaultMessage: 'password' },
  email: { id: 'property.email', defaultMessage: 'email' },
  phone: { id: 'property.phone', defaultMessage: 'phone' },
  username: { id: 'property.username', defaultMessage: 'username' },
  identifier: {
    id: 'property.identifier',
    defaultMessage: 'identifier',
  },
  code: { id: 'property.code', defaultMessage: 'code' },
  recovery_address: {
    id: 'property.recovery_address',
    defaultMessage: 'recovery address',
  },
})
````

## ory/packages/elements-react/src/util/i18n/settingsCardMessages.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeGroupEnum } from '@ory/client-fetch'
import { defineMessages } from 'react-intl'

export const settingsCardTitles = defineMessages<string>({
  [UiNodeGroupEnum.Totp]: {
    id: 'settings.totp.title',
    defaultMessage: 'Authenticator App',
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: 'settings.lookup_secret.title',
    defaultMessage: 'Backup Recovery Codes (second factor)',
  },
  [UiNodeGroupEnum.Oidc]: {
    id: 'settings.oidc.title',
    defaultMessage: 'Connected accounts',
  },
  [UiNodeGroupEnum.Passkey]: {
    id: 'settings.passkey.title',
    defaultMessage: 'Manage Passkeys',
  },
  [UiNodeGroupEnum.Profile]: {
    id: 'settings.profile.title',
    defaultMessage: 'Profile Settings',
  },
  [UiNodeGroupEnum.Password]: {
    id: 'settings.password.title',
    defaultMessage: 'Change Password',
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: 'settings.webauthn.title',
    defaultMessage: 'Manage Hardware Tokens',
  },
})

export function settingsCardTitleMessage(group: UiNodeGroupEnum) {
  if (group in settingsCardTitles) {
    return settingsCardTitles[group]
  }
  return { id: `settings.${group}.title` }
}

export const settingsCardDescriptions = defineMessages<string>({
  [UiNodeGroupEnum.Totp]: {
    id: 'settings.totp.description',
    defaultMessage:
      'Add a TOTP Authenticator App to your account to improve your account security. Popular Authenticator Apps are LastPass and Google Authenticator',
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: 'settings.lookup_secret.description',
    defaultMessage:
      'Recovery codes are a secure backup for 2FA, allowing you to regain access to your account if you lose your 2FA device.',
  },
  [UiNodeGroupEnum.Oidc]: {
    id: 'settings.oidc.description',
    defaultMessage: 'Connect a social login provider with your account.',
  },
  [UiNodeGroupEnum.Passkey]: {
    id: 'settings.passkey.description',
    defaultMessage: 'Manage your passkey settings',
  },
  [UiNodeGroupEnum.Profile]: {
    id: 'settings.profile.description',
    defaultMessage: 'Update your profile information',
  },
  [UiNodeGroupEnum.Password]: {
    id: 'settings.password.description',
    defaultMessage: 'Modify your password',
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: 'settings.webauthn.description',
    defaultMessage: 'Manage your hardware token settings',
  },
})

export function settingsCardDescriptionMessage(group: UiNodeGroupEnum) {
  if (group in settingsCardDescriptions) {
    return settingsCardDescriptions[group]
  }
  return {
    id: `settings.${group}.description`,
  }
}
```

## ory/packages/elements-react/src/util/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export * from './clientConfiguration'
export * from './events'
export * from './flowContainer'
export * from './i18n'
export * from './submitHandler'
export * from './test-id'
export type { OryTransientPayload } from './transientPayload'
export * from './utilFixSDKTypesHelper'
```

## ory/packages/elements-react/src/util/internal.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function replaceWindowFlowId(flow: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('flow', flow)
  window.location.href = url.toString()
}
```

## ory/packages/elements-react/src/util/nodes.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes, UiText } from '@ory/client-fetch'
import { uiTextToFormattedMessage } from './i18n'
import { useIntl } from 'react-intl'

export function findScreenSelectionButton(
  nodes: UiNode[],
): { attributes: UiNodeInputAttributes } | undefined {
  return nodes.find(
    (node) =>
      node.attributes.node_type === 'input' &&
      node.attributes.type === 'submit' &&
      node.attributes.name === 'screen',
  ) as { attributes: UiNodeInputAttributes }
}

export function isDynamicText(text: UiText): text is UiText & { context: { name: string } } {
  return (
    text.id === 1070002 &&
    !!text.context &&
    'name' in text.context &&
    typeof text.context['name'] === 'string'
  )
}

export function resolveLabel(text: UiText, intl: ReturnType<typeof useIntl>) {
  if (isDynamicText(text)) {
    const field = text.context.name
    const id = `forms.label.${field}`
    const msg = {
      id,
      defaultMessage: text.text,
    }
    return intl.formatMessage(msg)
  }
  return uiTextToFormattedMessage(text, intl)
}

/**
 * Resolves the display text for a schema-driven enum option.
 *
 * Options come from Kratos carrying only the raw enum value. We give
 * consumers a deterministic localization hook by looking up
 * `forms.option.{name}.{value}` in the intl catalogue and fall back to the
 * raw value when no translation is registered. This mirrors `resolveLabel`'s
 * `forms.label.{name}` convention so apps can ship one set of custom
 * translations for every form field.
 */
export function resolveOptionLabel(name: string, value: unknown, intl: ReturnType<typeof useIntl>) {
  const stringValue = String(value)
  // The descriptor is assigned to a variable so the FormatJS TS transformer
  // does not try to statically extract the dynamic `id` — this mirrors the
  // pattern used by `resolveLabel` above.
  const msg = {
    id: `forms.option.${name}.${stringValue}`,
    defaultMessage: stringValue,
  }
  return intl.formatMessage(msg)
}
```

## ory/packages/elements-react/src/util/omitAttributes.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from '@ory/client-fetch'
import { omit } from '../theme/default/utils/attributes'

export function omitInputAttributes({
  ...attrs
}: Partial<Record<keyof UiNodeInputAttributes, unknown>>) {
  return omit(attrs, [
    'autocomplete',
    'label',
    'node_type',
    'maxlength',
    'onclick',
    'onclickTrigger',
    'onload',
    'onloadTrigger',
  ])
}
```

## ory/packages/elements-react/src/util/onSubmitLogin.test.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow } from '@ory/client-fetch'
import { OryElementsConfiguration } from '../context'
import { onSubmitLogin } from './onSubmitLogin'
import { OrySuccessEvent, OryValidationErrorEvent } from './events'
import { LoginFlowContainer } from './flowContainer'

beforeEach(() => {
  jest.clearAllMocks()
  console.warn = jest.fn()
  console.error = jest.fn()
})

afterEach(() => {
  jest.restoreAllMocks()
})

const mockFlow: LoginFlowContainer = {
  flowType: FlowType.Login,
  flow: {
    id: 'test-flow-id',
    ui: { action: '', method: 'POST', nodes: [] },
  } as unknown as LoginFlow,
}

const mockConfig = {
  sdk: {
    url: 'http://localhost:4455',
    options: {},
    frontend: {
      updateLoginFlowRaw: jest.fn(),
    },
  },
  project: {
    name: 'test',
    login_ui_url: 'http://localhost:4455/login',
    recovery_ui_url: 'http://localhost:4455/recovery',
    registration_ui_url: 'http://localhost:4455/registration',
    verification_ui_url: 'http://localhost:4455/verification',
    recovery_enabled: true,
    registration_enabled: true,
    verification_enabled: true,
    default_redirect_url: 'http://localhost:4455',
    error_ui_url: 'http://localhost:4455/error',
    settings_ui_url: 'http://localhost:4455/settings',
  },
} as unknown as OryElementsConfiguration

describe('onSubmitLogin', () => {
  test('should fire login success event before redirect on successful login', async () => {
    const events: OrySuccessEvent[] = []
    const onSuccess = (event: OrySuccessEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const mockSession = {
      id: 'session-id',
      identity: {
        id: 'identity-id',
        schema_id: 'default',
        schema_url: '',
        traits: {},
      },
    }

    jest
      .spyOn(await import('./client'), 'frontendClient')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockResolvedValue({
          value: () =>
            Promise.resolve({
              session: mockSession,
              continue_with: [
                {
                  action: 'redirect_browser_to',
                  redirect_browser_to: 'https://example.com/callback',
                },
              ],
            }),
        }),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: {
        method: 'password',
        identifier: 'user@example.com',
        password: 'secret',
      } as any,
      onRedirect,
      setFlowContainer,
      onSuccess,
    })

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Login,
      method: 'password',
      session: mockSession,
      flow: mockFlow.flow,
    })
    expect(onRedirect).toHaveBeenCalled()
  })

  test('should fire validation error event on validation failure', async () => {
    const events: OryValidationErrorEvent[] = []
    const onValidationError = (event: OryValidationErrorEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    const errorFlow = {
      id: 'test-flow-id',
      ui: {
        action: '',
        method: 'POST',
        nodes: [
          {
            messages: [{ id: 4000002, text: 'Field is required', type: 'error' }],
            attributes: {},
            type: 'input',
            group: 'default',
          },
        ],
        messages: [{ id: 4000001, text: 'Invalid credentials', type: 'error' }],
      },
    }

    const mockResponse = {
      status: 400,
      json: () => Promise.resolve(errorFlow),
      clone: () => mockResponse,
      text: () => Promise.resolve(JSON.stringify(errorFlow)),
      headers: {
        get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        entries: () => [['content-type', 'application/json']],
      },
    }
    const error = Object.assign(new Error('Validation error'), {
      name: 'ResponseError',
      response: mockResponse,
    })

    jest
      .spyOn(await import('./client'), 'frontendClient')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockRejectedValue(error),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: {
        method: 'password',
        identifier: 'user@example.com',
        password: 'wrong',
      } as any,
      onRedirect,
      setFlowContainer,
      onValidationError,
    })

    expect(events).toHaveLength(1)
    expect(events[0]).toEqual({
      flowType: FlowType.Login,
      flow: errorFlow,
    })
    expect(setFlowContainer).toHaveBeenCalled()
  })

  test('should not fire validation error event on step transition without errors', async () => {
    const events: OryValidationErrorEvent[] = []
    const onValidationError = (event: OryValidationErrorEvent) => {
      events.push(event)
    }
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    // A step-transition flow has no error messages — Kratos returns 400 but
    // the flow simply moved to the next step (e.g. identifier_first).
    const stepTransitionFlow = {
      id: 'test-flow-id',
      ui: {
        action: '',
        method: 'POST',
        nodes: [
          {
            messages: [],
            attributes: {},
            type: 'input',
            group: 'default',
          },
        ],
        messages: [],
      },
    }

    const mockResponse = {
      status: 400,
      json: () => Promise.resolve(stepTransitionFlow),
      clone: () => mockResponse,
      text: () => Promise.resolve(JSON.stringify(stepTransitionFlow)),
      headers: {
        get: (name: string) => (name === 'content-type' ? 'application/json' : null),
        entries: () => [['content-type', 'application/json']],
      },
    }
    const error = Object.assign(new Error('Bad request'), {
      name: 'ResponseError',
      response: mockResponse,
    })

    jest
      .spyOn(await import('./client'), 'frontendClient')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockRejectedValue(error),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: {
        method: 'password',
        identifier: 'user@example.com',
        password: '',
      } as any,
      onRedirect,
      setFlowContainer,
      onValidationError,
    })

    expect(events).toHaveLength(0)
    expect(setFlowContainer).toHaveBeenCalled()
  })

  test('should await async onSuccess before redirect', async () => {
    const order: string[] = []
    const onSuccess = async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      order.push('onSuccess')
    }
    const onRedirect = jest.fn().mockImplementation(() => {
      order.push('onRedirect')
    })
    const setFlowContainer = jest.fn()

    jest
      .spyOn(await import('./client'), 'frontendClient')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockResolvedValue({
          value: () =>
            Promise.resolve({
              session: { id: 's' },
              continue_with: [
                {
                  action: 'redirect_browser_to',
                  redirect_browser_to: 'https://example.com/callback',
                },
              ],
            }),
        }),
      } as any)

    await onSubmitLogin(mockFlow, mockConfig, {
      body: { method: 'password', identifier: 'a', password: 'b' } as any,
      onRedirect,
      setFlowContainer,
      onSuccess,
    })

    expect(order).toEqual(['onSuccess', 'onRedirect'])
  })

  test('should not throw when callbacks are omitted', async () => {
    const onRedirect = jest.fn()
    const setFlowContainer = jest.fn()

    jest
      .spyOn(await import('./client'), 'frontendClient')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .mockReturnValue({
        updateLoginFlowRaw: jest.fn().mockResolvedValue({
          value: () =>
            Promise.resolve({
              session: { id: 's' },
              continue_with: [
                {
                  action: 'redirect_browser_to',
                  redirect_browser_to: 'https://example.com/callback',
                },
              ],
            }),
        }),
      } as any)

    await expect(
      onSubmitLogin(mockFlow, mockConfig, {
        body: { method: 'password', identifier: 'a', password: 'b' } as any,
        onRedirect,
        setFlowContainer,
      }),
    ).resolves.not.toThrow()
  })
})
```

## ory/packages/elements-react/src/util/onSubmitLogin.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  LoginFlow,
  loginUrl,
  UpdateLoginFlowBody,
} from '@ory/client-fetch'
import { OnSubmitHandlerProps } from './submitHandler'
import { LoginFlowContainer } from './flowContainer'
import { frontendClient } from './client'
import { replaceWindowFlowId } from './internal'
import { OryElementsConfiguration } from '../context'
import { handleFlowError } from './sdk-helpers'
import { flowHasErrors } from './flowHasErrors'

/**
 * Use this method to submit a login flow. This method is used in the `onSubmit` handler of the login form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitLogin(
  { flow }: LoginFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateLoginFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(`Please supply your Ory Network SDK url to the Ory Elements configuration.`)
  }

  const method = String(body.method)

  await frontendClient(config.sdk.url, config.sdk.options ?? {})
    .updateLoginFlowRaw({
      flow: flow.id,
      updateLoginFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      await onSuccess?.({
        flowType: FlowType.Login,
        method,
        session: body.session,
        flow,
      })

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      if (!didContinueWith) {
        // We did not receive a valid continue_with, but the state flow is still a success. In this case we re-initialize
        // the registration flow which will redirect the user to the default url.
        onRedirect(loginUrl(config), true)
      }

      return
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(loginUrl(config), true)
          }
        },
        onValidationError: async (body: LoginFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: FlowType.Login,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: FlowType.Login,
          })
        },
        onRedirect,
        config,
        flowType: FlowType.Login,
        onError,
      }),
    )
}
```

## ory/packages/elements-react/src/util/onSubmitRecovery.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ContinueWith,
  FlowType,
  GenericError,
  handleContinueWith,
  instanceOfContinueWithRecoveryUi,
  OnRedirectHandler,
  RecoveryFlow,
  recoveryUrl,
  UpdateRecoveryFlowBody,
} from '@ory/client-fetch'
import { OryElementsConfiguration } from '../context'
import { OryFlowContainer } from './flowContainer'
import { replaceWindowFlowId } from './internal'
import { OnSubmitHandlerProps } from './submitHandler'
import { handleFlowError } from './sdk-helpers'
import { flowHasErrors } from './flowHasErrors'

/**
 * Use this method to submit a recovery flow. This method is used in the `onSubmit` handler of the recovery form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitRecovery(
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateRecoveryFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateRecoveryFlowRaw({
      flow: flow.id,
      updateRecoveryFlowBody: body,
    })
    .then(async (res) => {
      const flow = await res.value()

      await onSuccess?.({
        flowType: FlowType.Recovery,
        method,
        flow,
      })

      const didContinueWith = handleContinueWith(flow.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      setFlowContainer({
        flow,
        flowType: FlowType.Recovery,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(recoveryUrl(config), true)
          }
        },
        onValidationError: async (body: RecoveryFlow | { error: GenericError }) => {
          if ('error' in body) {
            handleContinueWithRecoveryUIError(body.error, config, onRedirect)
            return
          } else {
            if (flowHasErrors(body.ui)) {
              await onValidationError?.({
                flowType: FlowType.Recovery,
                flow: body,
              })
            }
            setFlowContainer({
              flow: body,
              flowType: FlowType.Recovery,
            })
          }
        },
        onRedirect,
        config,
        flowType: FlowType.Recovery,
        onError,
      }),
    )
}

function handleContinueWithRecoveryUIError(
  error: GenericError,
  config: OryElementsConfiguration,
  onRedirect: OnRedirectHandler,
) {
  if ('continue_with' in error.details && Array.isArray(error.details.continue_with)) {
    const continueWithRecovery = (error.details.continue_with as ContinueWith[]).find(
      instanceOfContinueWithRecoveryUi,
    )
    if (continueWithRecovery?.action === 'show_recovery_ui') {
      onRedirect(config.project.recovery_ui_url + '?flow=' + continueWithRecovery?.flow.id, false)
      return
    }
  }
  onRedirect(recoveryUrl(config), true)
}
```

## ory/packages/elements-react/src/util/onSubmitRegistration.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  RegistrationFlow,
  registrationUrl,
  UpdateRegistrationFlowBody,
} from '@ory/client-fetch'
import { OryElementsConfiguration } from '../context'
import { RegistrationFlowContainer } from './flowContainer'
import { replaceWindowFlowId } from './internal'
import { OnSubmitHandlerProps } from './submitHandler'
import { handleFlowError } from './sdk-helpers'
import { flowHasErrors } from './flowHasErrors'

/**
 * Use this method to submit a registration flow. This method is used in the `onSubmit` handler of the registration form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitRegistration(
  { flow }: RegistrationFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateRegistrationFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateRegistrationFlowRaw({
      flow: flow.id,
      updateRegistrationFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      await onSuccess?.({
        flowType: FlowType.Registration,
        method,
        identity: body.identity,
        session: body.session,
        flow,
      })

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      // We did not receive a valid continue_with, but the state flow is still a success. In this case we re-initialize
      // the registration flow which will redirect the user to the default url.
      onRedirect(registrationUrl(config), true)
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(registrationUrl(config), true)
          }
        },
        onValidationError: async (body: RegistrationFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: FlowType.Registration,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: FlowType.Registration,
          })
        },
        onRedirect,
        config,
        flowType: FlowType.Registration,
        onError,
      }),
    )
}
```

## ory/packages/elements-react/src/util/onSubmitSettings.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  handleContinueWith,
  isResponseError,
  loginUrl,
  SettingsFlow,
  settingsUrl,
  UpdateSettingsFlowBody,
} from '@ory/client-fetch'
import { OryElementsConfiguration } from '../context'
import { OryFlowContainer } from './flowContainer'
import { replaceWindowFlowId } from './internal'
import { OnSubmitHandlerProps } from './submitHandler'
import { handleFlowError } from './sdk-helpers'
import { flowHasErrors } from './flowHasErrors'

/**
 * Use this method to submit a settings flow. This method is used in the `onSubmit` handler of the settings form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitSettings(
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateSettingsFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateSettingsFlowRaw({
      flow: flow.id,
      updateSettingsFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      await onSuccess?.({
        flowType: FlowType.Settings,
        method,
        flow: body,
      })

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      setFlowContainer({
        flow: body,
        flowType: FlowType.Settings,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(settingsUrl(config), true)
          }
        },
        onValidationError: async (body: SettingsFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: FlowType.Settings,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: FlowType.Settings,
          })
        },
        onRedirect,
        config,
        flowType: FlowType.Settings,
        onError,
      }),
    )
    .catch((err) => {
      if (isResponseError(err)) {
        if (err.response.status === 401) {
          return onRedirect(loginUrl(config) + '?return_to=' + settingsUrl(config), true)
        }
        throw err
      }
    })
}
```

## ory/packages/elements-react/src/util/onSubmitVerification.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  UpdateVerificationFlowBody,
  VerificationFlow,
  verificationUrl,
} from '@ory/client-fetch'
import { OryElementsConfiguration } from '../context'
import { OryFlowContainer } from './flowContainer'
import { replaceWindowFlowId } from './internal'
import { OnSubmitHandlerProps } from './submitHandler'
import { handleFlowError } from './sdk-helpers'
import { flowHasErrors } from './flowHasErrors'

/**
 * Use this method to submit a verification flow. This method is used in the `onSubmit` handler of the verification form.
 *
 * @param config - The configuration object.
 * @param flow - The flow object.
 * @param setFlowContainer - This method is used to update the flow container when a validation error occurs, for example.
 * @param body - The form values to submit.
 * @param onRedirect - This method is used to redirect the user to a different page.
 */
export async function onSubmitVerification(
  { flow }: OryFlowContainer,
  config: OryElementsConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateVerificationFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateVerificationFlowRaw({
      flow: flow.id,
      updateVerificationFlowBody: body,
    })
    .then(async (res) => {
      const flow = await res.value()

      await onSuccess?.({
        flowType: FlowType.Verification,
        method,
        flow,
      })

      return setFlowContainer({
        flow,
        flowType: FlowType.Verification,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(verificationUrl(config), true)
          }
        },
        onValidationError: async (body: VerificationFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: FlowType.Verification,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: FlowType.Verification,
          })
        },
        onRedirect,
        config,
        flowType: FlowType.Verification,
        onError,
      }),
    )
}
```

## ory/packages/elements-react/src/util/removeFalsyValues.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

type AnyObject = Record<string, unknown>

/**
 * Removes any properties from an object or elements from an array that are empty strings or undefined.
 *
 * @param input any object or array
 * @returns the object with any property removed that is an empty string or undefined
 */
export function removeEmptyStrings<T>(input: T): T {
  // Arrays: clean elements and drop falsy ones
  if (Array.isArray(input)) {
    return (
      input
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        .map((item) => removeEmptyStrings(item))
        .filter((v) => v || typeof v === 'boolean' || typeof v === 'number') as unknown as T
    )
  }

  // Non-objects: return as-is
  if (input === null || typeof input !== 'object') {
    return input
  }

  const obj = input as AnyObject
  const out: AnyObject = {}

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      const cleaned = removeEmptyStrings(value)
      // keep only if the nested object/array still has content
      if (Array.isArray(cleaned)) {
        if (cleaned.length) {
          out[key] = cleaned
        }
      } else if (cleaned && Object.keys(cleaned as AnyObject).length > 0) {
        out[key] = cleaned
      }
    } else if (value || typeof value === 'boolean' || typeof value === 'number') {
      out[key] = value
    }
  }

  return out as T
}
```

## ory/packages/elements-react/src/util/sdk-helpers/continueWith.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ContinueWith,
  ContinueWithRecoveryUi,
  ContinueWithSetOrySessionToken,
  ContinueWithSettingsUi,
  ContinueWithVerificationUi,
  ContinueWithRedirectBrowserTo,
} from '@ory/client-fetch'

export type OnRedirectHandler = (url: string, external: boolean) => void

// The order in which the actions are defined here is the order in which they are expected to be executed.
const continueWithPriority = [
  'show_settings_ui',
  'show_recovery_ui',
  'show_verification_ui',
  'redirect_browser_to',
  'set_ory_session_token',
]

export function handleContinueWith(
  continueWith: ContinueWith[] | undefined,
  { onRedirect }: { onRedirect: OnRedirectHandler },
): boolean {
  if (!continueWith || continueWith.length === 0) {
    return false
  }

  const action = pickBestContinueWith(continueWith)
  if (!action) {
    return false
  }

  const redirectFlow = (id: string, flow: string, url?: string) => {
    if (url) {
      onRedirect(url, true)
      return true
    }

    onRedirect('/' + flow + '?flow=' + id, false)
    return true
  }

  if (isSetOrySessionToken(action)) {
    throw new Error('Ory Elements does not support API flows yet.')
  } else if (isRedirectBrowserTo(action) && action.redirect_browser_to) {
    onRedirect(action.redirect_browser_to, true)
    return true
  } else if (isShowVerificationUi(action)) {
    return redirectFlow(action.flow.id, 'verification', action.flow.url)
  } else if (isShowRecoveryUi(action)) {
    return redirectFlow(action.flow.id, 'recovery', action.flow.url)
  } else if (isShowSettingsUi(action)) {
    // TODO: re-add url
    return redirectFlow(action.flow.id, 'settings', action.flow.url)
  } else {
    throw new Error('Unknown action: ' + JSON.stringify(action))
  }
}

/**
 * Picks the best continue with action from the list of continue with actions.
 *
 * @param continueWith - The list of continue with actions.
 */
export function pickBestContinueWith(continueWith: ContinueWith[]) {
  if (!continueWith || continueWith.length === 0) {
    return
  }

  const sorted = continueWith.sort(
    (a, b) => continueWithPriority.indexOf(a.action) - continueWithPriority.indexOf(b.action),
  )
  return sorted[0]
}

/**
 * Checks if the continue with action is to set the Ory Session Token.
 *
 * @param continueWith - The continue with action.
 */
export function isSetOrySessionToken(
  continueWith: ContinueWith,
): continueWith is ContinueWithSetOrySessionToken & {
  action: 'set_ory_session_token'
} {
  return continueWith.action === 'set_ory_session_token'
}

/**
 * Checks if the continue with action is to redirect the browser to a different page.
 *
 * @param continueWith - The continue with action.
 */
export function isRedirectBrowserTo(
  continueWith: ContinueWith,
): continueWith is ContinueWithRedirectBrowserTo & {
  action: 'redirect_browser_to'
} {
  return continueWith.action === 'redirect_browser_to'
}

/**
 * Checks if the continue with action is to show the recovery UI.
 *
 * @param continueWith - The continue with action.
 */
export function isShowRecoveryUi(
  continueWith: ContinueWith,
): continueWith is ContinueWithRecoveryUi & {
  action: 'show_recovery_ui'
} {
  return continueWith.action === 'show_recovery_ui'
}

/**
 * Checks if the continue with action is to show the settings UI.
 *
 * @param continueWith - The continue with action.
 */
export function isShowSettingsUi(
  continueWith: ContinueWith,
): continueWith is ContinueWithSettingsUi & {
  action: 'show_settings_ui'
} {
  return continueWith.action === 'show_settings_ui'
}

/**
 * Checks if the continue with action is to show the verification UI.
 *
 * @param continueWith - The continue with action.
 */
export function isShowVerificationUi(
  continueWith: ContinueWith,
): continueWith is ContinueWithVerificationUi & {
  action: 'show_verification_ui'
} {
  return continueWith.action === 'show_verification_ui'
}
```

## ory/packages/elements-react/src/util/sdk-helpers/error.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  ErrorBrowserLocationChangeRequired,
  ErrorFlowReplaced,
  GenericError,
  NeedsPrivilegedSessionError,
  ResponseError,
  SelfServiceFlowExpiredError,
  FetchError,
  ErrorGeneric,
  ContinueWith,
} from '@ory/client-fetch'
import type { GenericErrorContent } from '@ory/client-fetch/src/models/GenericErrorContent'

export function isGenericErrorResponse(response: unknown): response is { error: GenericError } {
  return (
    typeof response === 'object' &&
    !!response &&
    'error' in response &&
    typeof response.error === 'object' &&
    !!response.error &&
    'id' in response.error
  )
}

/**
 * Checks if the response is a NeedsPrivilegedSessionError. This error is returned when the self-service flow requires
 * the user to re-authenticate in order to perform an action that requires elevated privileges.
 *
 * @param response - The response to check.
 */
export function isNeedsPrivilegedSessionError(
  response: unknown,
): response is NeedsPrivilegedSessionError {
  return isGenericErrorResponse(response) && response.error.id === 'session_refresh_required'
}

/**1
 * Checks if the response is a SelfServiceFlowExpiredError. This error is returned when the self-service flow is expired.
 *
 * @param response - The response to check.
 */
export function isSelfServiceFlowExpiredError(
  response: unknown,
): response is SelfServiceFlowExpiredError {
  return isGenericErrorResponse(response) && response.error.id === 'self_service_flow_expired'
}

/**
 * Checks if the response is a GenericError due to the self-service flow being disabled (for example disabled registration).
 *
 * @param response - The response to check.
 */
export function isSelfServiceFlowDisabled(response: unknown): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    isGenericErrorResponse(response) &&
    response.error.id === 'self_service_flow_disabled'
  )
}

/**
 * Checks if the response is a ErrorBrowserLocationChangeRequired.
 * @param response - The response to check.
 */
export function isBrowserLocationChangeRequired(
  response: unknown,
): response is ErrorBrowserLocationChangeRequired {
  return (
    isGenericErrorResponse(response) &&
    isGenericErrorResponse(response) &&
    response.error.id === 'browser_location_change_required'
  )
}

/**
 * Checks if the response is a ErrorFlowReplaced.
 * @param response - The response to check.
 */
export function isSelfServiceFlowReplaced(response: unknown): response is ErrorFlowReplaced {
  return isGenericErrorResponse(response) && response.error.id === 'self_service_flow_replaced'
}

/**
 * Checks if the response is a GenericError due to the session already being available.
 * @param response - The response to check.
 */
export function isSessionAlreadyAvailable(response: unknown): response is GenericError {
  return isGenericErrorResponse(response) && response.error.id === 'session_already_available'
}

/**
 * Checks if the response is a GenericError due to the session being inactive.
 *
 * @param response - The response to check.
 */
export function isAddressNotVerified(response: unknown): response is {
  error: GenericErrorContent & {
    details?: {
      continue_with?: [ContinueWith]
    }
  }
} {
  return (
    isGenericErrorResponse(response) && response.error.id === 'session_verified_address_required'
  )
}

/**
 * Checks if the response is a GenericError due to the session already having fulfilled the AAL requirement.
 *
 * @param response - The response to check.
 */
export function isAalAlreadyFulfilled(response: unknown): response is GenericError {
  return isGenericErrorResponse(response) && response.error.id === 'session_aal_already_fulfilled'
}

/**
 * Checks if the response is a GenericError due to the session requiring a higher AAL.
 *
 * @param response - The response to check.
 */
export function isSessionAal1Required(response: unknown): response is ErrorGeneric {
  return isGenericErrorResponse(response) && response.error.id === 'session_aal1_required'
}

/**
 * Checks if the response is a GenericError due to the session requiring a higher AAL.
 *
 * @param response - The response to check.
 */
export function isSessionAal2Required(response: unknown): response is GenericError {
  return isGenericErrorResponse(response) && response.error.id === 'session_aal2_required'
}

/**
 * Checks if the response is a GenericError due to the session being inactive.
 *
 * @param response - The response to check.
 */
export function isNoActiveSession(response: unknown): response is GenericError {
  return isGenericErrorResponse(response) && response.error.id === 'session_inactive'
}

/**
 * Checks if the response is a GenericError due to a CSRF violation.
 *
 * @param response - The response to check.
 */
export function isCsrfError(response: unknown): response is GenericError {
  return isGenericErrorResponse(response) && response.error.id === 'security_csrf_violation'
}

/**
 * Checks if the response is a GenericError due to the redirect URL being forbidden.
 *
 * @param response - The response to check.
 */
export function isRedirectUrlNotAllowed(response: unknown): response is GenericError {
  return (
    isGenericErrorResponse(response) &&
    response.error.id === 'self_service_flow_return_to_forbidden'
  )
}

/**
 * Checks if the response is a GenericError due to two sessions being active.
 *
 * @param response - The response to check.
 */
export function isSecurityIdentityMismatch(response: unknown): response is GenericError {
  return isGenericErrorResponse(response) && response.error.id === 'security_identity_mismatch'
}

export const isResponseError = (err: unknown): err is ResponseError => {
  if (err instanceof ResponseError) {
    return true
  }

  return typeof err === 'object' && !!err && 'name' in err && err.name === 'ResponseError'
}

export const isFetchError = (err: unknown): err is FetchError => {
  return err instanceof FetchError
}
```

## ory/packages/elements-react/src/util/sdk-helpers/flowTypes.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export enum FlowType {
  Login = 'login',
  Registration = 'registration',
  Recovery = 'recovery',
  Verification = 'verification',
  Settings = 'settings',
  Error = 'error',
  OAuth2Consent = 'oauth2_consent',
}
```

## ory/packages/elements-react/src/util/sdk-helpers/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export * from './error'
export * from './urlHelpers'
export * from './flowTypes'
export * from './utils'
export * from './continueWith'
export * from './ui'
```

## ory/packages/elements-react/src/util/sdk-helpers/ui.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
  UiNodeDivisionAttributes,
  UiText,
} from '@ory/client-fetch'

/**
 * Returns the node's label.
 *
 * @param node - the node get the label from
 * @returns label of the node
 */
export const getNodeLabel = (node: UiNode): UiText | undefined => {
  const attributes = node.attributes
  if (isUiNodeAnchorAttributes(attributes)) {
    return attributes.title
  }

  if (isUiNodeImageAttributes(attributes)) {
    return node.meta.label
  }

  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.label) {
      return attributes.label
    }
  }

  return node.meta.label
}

type ObjWithNodeType = {
  node_type: string
}

/**
 * A TypeScript type guard for nodes of the type <a>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeAnchorAttributes(attrs: ObjWithNodeType): attrs is UiNodeAnchorAttributes {
  return attrs.node_type === 'a'
}

/**
 * A TypeScript type guard for nodes of the type <img>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeImageAttributes(attrs: ObjWithNodeType): attrs is UiNodeImageAttributes {
  return attrs.node_type === 'img'
}

/**
 * A TypeScript type guard for nodes of the type <input>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeInputAttributes(attrs: ObjWithNodeType): attrs is UiNodeInputAttributes {
  return attrs.node_type === 'input'
}

/**
 * A TypeScript type guard for nodes of the type <div>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeDivAttributes(attrs: ObjWithNodeType): attrs is UiNodeDivisionAttributes {
  return attrs.node_type === 'div'
}

/**
 * A TypeScript type guard for nodes of the type `<span>{text}</span>`
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeTextAttributes(attrs: ObjWithNodeType): attrs is UiNodeTextAttributes {
  return attrs.node_type === 'text'
}

/**
 * A TypeScript type guard for nodes of the type <script>
 *
 * @param attrs - the attributes of the node
 */
export function isUiNodeScriptAttributes(attrs: ObjWithNodeType): attrs is UiNodeScriptAttributes {
  return attrs.node_type === 'script'
}

/**
 * Returns a node's ID.
 *
 * @param attributes - the attributes of the node
 */
export function getNodeId({ attributes }: UiNode) {
  if (isUiNodeInputAttributes(attributes)) {
    if (attributes.type === 'submit' && attributes.value) {
      return `${attributes.name}:${attributes.value}`
    }
    return attributes.name
  } else {
    return attributes.id
  }
}

/**
 * Return the node input attribute type
 * In <input> elements we have a variety of types, such as text, password, email, etc.
 * When the attribute is null or the `type` attribute is not present, we assume it has no defined type.
 *
 * @param attr - the attributes of the node
 * @returns type of node
 */
export const getNodeInputType = (attr: object): string =>
  'type' in attr && typeof attr?.type == 'string' ? attr.type : ''
```

## ory/packages/elements-react/src/util/sdk-helpers/urlHelpers.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export const registrationUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + '/self-service/registration/browser'

export const loginUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + '/self-service/login/browser'

export const settingsUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + '/self-service/settings/browser'

export const recoveryUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + '/self-service/recovery/browser'

export const verificationUrl = (config: { sdk: { url: string } }) =>
  config.sdk.url + '/self-service/verification/browser'
```

## ory/packages/elements-react/src/util/sdk-helpers/utils.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FetchError, FlowType, GenericError, ResponseError } from '@ory/client-fetch'
import { OryErrorHandler } from '../events'
import { OnRedirectHandler } from './continueWith'
import {
  isAddressNotVerified,
  isBrowserLocationChangeRequired,
  isCsrfError,
  isFetchError,
  isNeedsPrivilegedSessionError,
  isResponseError,
  isSelfServiceFlowExpiredError,
  isSelfServiceFlowReplaced,
} from './error'
import { verificationUrl } from './urlHelpers'

export type ValidationErrorHandler<T> = (body: T) => void | Promise<void>

type FlowErrorHandlerProps<T> = {
  /**
   * When the SDK returns an error indicating that the flow needs to be restarted, this function is called.
   *
   * @param useFlowId - If provided, the SDK should use this flow ID to not lose context of the flow.
   */
  onRestartFlow: (useFlowId?: string) => void

  /**
   * When the SDK returns a validation error, this function is called. The result should be used to update the
   * flow container.
   *
   * The function should return a FlowContainer or nothing.
   *
   * @param body - The body of the response.
   */
  onValidationError: ValidationErrorHandler<T>

  /**
   * This method is used to redirect the user to a different page.
   */
  onRedirect: OnRedirectHandler

  /**
   * The configuration object.
   */
  config: { sdk: { url: string } }

  /**
   * The type of flow being handled.
   */
  flowType: FlowType

  /**
   * Optional callback invoked on infrastructure or flow-level errors before
   * the default behavior (restart, redirect) proceeds.
   */
  onError?: OryErrorHandler
}

/**
 * Use this as the catch handler for all flow-related SDK calls, such as creating a login or submitting a login.
 *
 *
 * @param opts - The configuration object.
 */
export const handleFlowError =
  <T>(opts: FlowErrorHandlerProps<T>) =>
  async (err: unknown): Promise<void | T> => {
    if (!isResponseError(err)) {
      if (isFetchError(err)) {
        throw new FetchError(
          err,
          'Unable to call the API endpoint. Ensure that CORS is set up correctly and that you have provided a valid SDK URL to Ory Elements.',
        )
      }
      throw err
    }

    // First we handle any known errors in case we receive a JSON response.
    const contentType = err.response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      // Handle JSON content
      const body = await toBody(err.response)
      if (isSelfServiceFlowExpiredError(body)) {
        await opts.onError?.({
          type: 'flow_expired',
          flowType: opts.flowType,
          body,
        })
        opts.onRestartFlow(body.use_flow_id)
        return
      } else if (isAddressNotVerified(body)) {
        for (const continueWith of body.error.details?.continue_with || []) {
          if (continueWith.action === 'show_verification_ui' && continueWith.flow.url) {
            opts.onRedirect(continueWith.flow.url, true)
            return
          }
        }

        opts.onRedirect(verificationUrl(opts.config), true)
        return
      } else if (isBrowserLocationChangeRequired(body) && body.redirect_browser_to) {
        opts.onRedirect(body.redirect_browser_to, true)
        return
      } else if (isNeedsPrivilegedSessionError(body) && body.redirect_browser_to) {
        opts.onRedirect(body.redirect_browser_to, true)
        return
      } else if (isSelfServiceFlowReplaced(body)) {
        await opts.onError?.({
          type: 'flow_replaced',
          flowType: opts.flowType,
          body,
        })
        opts.onRestartFlow()
        return
      } else if (isCsrfError(body)) {
        await opts.onError?.({
          type: 'csrf_error',
          flowType: opts.flowType,
          body,
        })
        opts.onRestartFlow()
        return
      }

      // None of the above worked, but we have a JSON response and a status code. Let's do the best we can.
      switch (err.response.status) {
        case 404: // Does not exist
          await opts.onError?.({
            type: 'flow_not_found',
            flowType: opts.flowType,
          })
          opts.onRestartFlow()
          return
        case 410: // Expired
          // Re-initialize the flow
          await opts.onError?.({
            type: 'flow_not_found',
            flowType: opts.flowType,
          })
          opts.onRestartFlow()
          return
        case 400:
          return opts.onValidationError((await err.response.json()) as unknown as T)
        case 403: // This typically happens with CSRF violations.
          await opts.onError?.({
            type: 'csrf_error',
            flowType: opts.flowType,
            body: body as GenericError,
          })
          opts.onRestartFlow()
          return
        case 422: {
          throw new ResponseError(
            err.response,
            'The API returned an error code indicating a required redirect, but the SDK is outdated and does not know how to handle the action. Received response: ' +
              (await err.response.json()),
          )
        }
      }

      throw new ResponseError(
        err.response,
        'The Ory API endpoint returned a response code the SDK does not know how to handle. Please check the network tab for more information. Received response: ' +
          (await err.response.json()),
      )
    } else if (
      // Not a JSON response? If it's a text response we will return an error informing the user that the response is not JSON.
      contentType.includes('text/') ||
      contentType.includes('html') ||
      contentType.includes('xml')
    ) {
      // Handle human-readable content
      await logResponseError(err.response, true)
      throw new ResponseError(
        err.response,
        `The Ory API endpoint returned an unexpected HTML or text response. Check your console output for details.`,
      )
    }

    // Not sure what the error is. So we just return some error.
    await logResponseError(err.response, false)
    // Handle binary/unknown content
    throw new ResponseError(
      err.response,
      'The Ory API endpoint returned unexpected content type `' +
        contentType +
        '`.  Check your console output for details.',
    )
  }

export async function toBody(response: Response): Promise<unknown> {
  try {
    return await response.clone().json()
  } catch (e: unknown) {
    await logResponseError(response, true, [e])
    throw new ResponseError(response, 'Unable to decode API response using JSON.')
  }
}

async function logResponseError(response: Response, printBody: boolean, wrap?: unknown[]) {
  console.error('Unable to decode API response', {
    response: {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: printBody ? await response.clone().text() : undefined,
    },
    errors: wrap,
  })
}
```

## ory/packages/elements-react/src/util/showToast.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { toast as sonnerToast } from 'sonner'
import { OryToastProps } from '../components'

export function showToast(
  toast: Omit<OryToastProps, 'id'>,
  ToastComponent: React.ComponentType<OryToastProps>,
) {
  return sonnerToast.custom((id) => <ToastComponent id={id} message={toast.message} />)
}
```

## ory/packages/elements-react/src/util/submitHandler.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OnRedirectHandler,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from '@ory/client-fetch'
import { OryFlowContainer } from './flowContainer'
import { OryErrorHandler, OrySuccessHandler, OryValidationErrorHandler } from './events'

/**
 * Props for the submit handler
 */
export type OnSubmitHandlerProps<
  T extends
    | UpdateLoginFlowBody
    | UpdateRegistrationFlowBody
    | UpdateVerificationFlowBody
    | UpdateRecoveryFlowBody
    | UpdateSettingsFlowBody,
> = {
  /**
   * This method is used to update the flow container when a validation error occurs, for example.
   */
  setFlowContainer: (flowContainer: OryFlowContainer) => void

  /**
   * The form values to submit.
   */
  body: T

  /**
   * This method is used to redirect the user to a different page.
   */
  onRedirect: OnRedirectHandler

  /**
   * Optional callback invoked after a successful submission, before the default
   * behavior (redirect, flow update). Awaited if it returns a Promise.
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the server returns validation errors.
   * Awaited if it returns a Promise.
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on infrastructure or flow-level errors (expired
   * flow, CSRF, not found, replaced). Awaited if it returns a Promise.
   */
  onError?: OryErrorHandler
}
```

## ory/packages/elements-react/src/util/test-id.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * Helper function to generate a test id for a UiText message.
 *
 * @param message - the UiText message to generate a test id for
 * @returns a unique, stable test id for the message
 * @group Utilities
 */
export function messageTestId(message: { id: number | string }): {
  'data-testid': string
} {
  return {
    'data-testid': `ory/message/${message.id}`,
  }
}
```

## ory/packages/elements-react/src/util/transientPayload.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FormValues } from '../types'

/**
 * A transient payload value or factory function.
 *
 * When a static object, it is included as-is in the submission body.
 * When a function, it receives the current form values at submission time
 * and must return the transient payload object.
 *
 * @group Utilities
 */
export type OryTransientPayload =
  Record<string, unknown> | ((formValues: FormValues) => Record<string, unknown>)

/**
 * Resolves an `OryTransientPayload` value and merges it with any existing
 * transient payload fields from UI nodes (e.g., captcha responses).
 *
 * User-provided values take priority over node-derived values via shallow
 * `Object.assign`.
 *
 * @param transientPayload - The user-provided transient payload prop.
 * @param formValues - The current form values at submission time.
 * @param existingNodeValues - Transient payload values derived from UI nodes.
 * @returns The merged transient payload object.
 *
 * @group Utilities
 */
export function resolveTransientPayload(
  transientPayload: OryTransientPayload | undefined,
  formValues: FormValues,
  existingNodeValues?: Record<string, unknown>,
): Record<string, unknown> {
  const raw =
    typeof transientPayload === 'function' ? transientPayload(formValues) : transientPayload
  const resolved = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : {}

  if (!existingNodeValues) {
    return resolved
  }

  return { ...existingNodeValues, ...resolved }
}
```

## ory/packages/elements-react/src/util/ui/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeInputAttributes, isUiNodeScriptAttributes, UiNode } from '@ory/client-fetch'

import type {
  UiNodeAttributes,
  UiNodeInputAttributesOnclickTriggerEnum,
  UiNodeInputAttributesOnloadTriggerEnum,
} from '@ory/client-fetch'
import { UiNodeGroupEnum } from '@ory/client-fetch'
import { useMemo } from 'react'
import { useGroupSorter } from '../../context/component'
import { UiNodeInput } from '../utilFixSDKTypesHelper'

export function triggerToWindowCall(
  trigger:
    UiNodeInputAttributesOnclickTriggerEnum | UiNodeInputAttributesOnloadTriggerEnum | undefined,
) {
  if (!trigger) {
    return
  }

  const fn = triggerToFunction(trigger)
  if (fn) {
    fn()
    return
  }

  // Retry every 100ms for 10 seconds
  let i = 0
  const ms = 100
  const interval = setInterval(() => {
    i++
    if (i > 100) {
      clearInterval(interval)
      throw new Error(
        "Unable to load Ory's WebAuthn script. Is it being blocked or otherwise failing to load? If you are running an old version of Ory Elements, please upgrade. For more information, please check your browser's developer console.",
      )
    }

    const fn = triggerToFunction(trigger)
    if (fn) {
      clearInterval(interval)
      return fn()
    }
  }, ms)
  return
}

export function triggerToFunction(
  trigger: UiNodeInputAttributesOnclickTriggerEnum | UiNodeInputAttributesOnloadTriggerEnum,
) {
  if (typeof window === 'undefined') {
    console.debug('The Ory SDK is missing a required function: window is undefined.')
    return undefined
  }

  const typedWindow = window as { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
  if (!(trigger in typedWindow) || !typedWindow[trigger]) {
    console.debug(`The Ory SDK is missing a required function: ${trigger}.`)
    return undefined
  }
  const triggerFn = typedWindow[trigger]
  if (typeof triggerFn !== 'function') {
    console.debug(`The Ory SDK is missing a required function: ${trigger}. It is not a function.`)
    return undefined
  }
  return triggerFn as () => void
}

type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]

/**
 * Returns a list of auth methods from a list of nodes. For example,
 * if Password and Passkey are present, it will return [password, passkey].
 *
 * Please note that OIDC is not considered an auth method because it is
 * usually shown as a separate auth method
 *
 * This method the default, identifier_first, and profile groups.
 *
 * @param nodes - The nodes to extract the auth methods from
 * @param excludeAuthMethods - A list of auth methods to exclude
 */
export function nodesToAuthMethodGroups(
  nodes: Array<UiNode>,
  excludeAuthMethods = [],
): UiNodeGroupEnum[] {
  const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}

  for (const node of nodes) {
    if (node.type === 'script') {
      // We always render all scripts, because the scripts for passkeys are part of the webauthn group,
      // which leads to this hook returning a webauthn group on passkey flows (which it should not - webauthn is the "legacy" passkey implementation).
      continue
    }
    const groupNodes = groups[node.group] ?? []
    groupNodes.push(node)
    groups[node.group] = groupNodes
  }

  return Object.values(UiNodeGroupEnum)
    .filter((group) => groups[group]?.length)
    .filter(
      (group) =>
        !(
          [
            UiNodeGroupEnum.Default,
            UiNodeGroupEnum.IdentifierFirst,
            UiNodeGroupEnum.Profile,
            UiNodeGroupEnum.Captcha,
            ...excludeAuthMethods,
          ] as UiNodeGroupEnum[]
        ).includes(group),
    )
}

/**
 * Groups nodes by their group and returns an object with the groups and entries.
 *
 * @deprecated use useNodeGroupsWithVisibleNodes instead
 * @param nodes - The nodes to group
 * @param opts - The options to use
 */
export function useNodesGroups(
  nodes: UiNode[],
  { omit }: { omit?: Array<'script' | 'input_hidden'> } = {},
) {
  const groupSorter = useGroupSorter()

  const groups = useMemo(() => {
    const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    const groupRetained: Partial<Record<UiNodeGroupEnum, number>> = {}

    for (const node of nodes) {
      const groupNodes = groups[node.group] ?? []
      groupNodes.push(node)
      groups[node.group] = groupNodes

      if (omit?.includes('script') && isUiNodeScriptAttributes(node.attributes)) {
        continue
      }

      if (
        omit?.includes('input_hidden') &&
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.type === 'hidden'
      ) {
        continue
      }

      groupRetained[node.group] = (groupRetained[node.group] ?? 0) + 1
    }

    const finalGroups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    for (const [group, count] of Object.entries(groupRetained)) {
      if (count > 0) {
        finalGroups[group as UiNodeGroupEnum] = groups[group as UiNodeGroupEnum]
      }
    }

    return finalGroups
  }, [nodes, omit])

  const entries = useMemo(
    () =>
      (Object.entries(groups) as Entries<Record<UiNodeGroupEnum, UiNode[]>>).sort(([a], [b]) =>
        groupSorter(a, b),
      ),
    [groups, groupSorter],
  )

  return {
    groups,
    entries,
  }
}

// Node finder
type NodeType = UiNodeAttributes['node_type']
type FindOptions<T extends NodeType = NodeType> = {
  node_type: T
  group?: UiNodeGroupEnum | RegExp
  id?: string | RegExp
  name?: string | RegExp
  type?: string | RegExp
}
const finder = (opt: FindOptions) => (n: UiNode) => {
  return (
    n.attributes.node_type === opt.node_type &&
    (opt.group
      ? opt.group instanceof RegExp
        ? n.group.match(opt.group)
        : n.group === opt.group
      : !opt.group) &&
    (opt.id && n.attributes.node_type !== 'input'
      ? opt.id instanceof RegExp
        ? n.attributes.id.match(opt.id)
        : n.attributes.id === opt.id
      : !opt.id) &&
    (opt.name && n.attributes.node_type === 'input'
      ? opt.name instanceof RegExp
        ? n.attributes.name.match(opt.name)
        : n.attributes.name === opt.name
      : !opt.name) &&
    (opt.type && n.attributes.node_type === 'input'
      ? opt.type instanceof RegExp
        ? n.attributes.type.match(opt.type)
        : n.attributes.type === opt.type
      : !opt.type)
  )
}
/**
 * Find a node
 * @param nodes - The list of nodes to search
 * @param opt  - The matching options
 * @returns The first matching node
 */
export const findNode = <T extends NodeType>(nodes: UiNode[], opt: FindOptions<T>) =>
  nodes.find(finder(opt)) as
    (UiNode & { attributes: UiNodeAttributes & { node_type: T } }) | undefined

/**
 * Returns functional nodes not related to credentials (e.g. password node) but
 * nodes belonging profile information, identifier first nodes, captcha, or default
 * nodes (e.g. csrf_token).
 *
 * @param nodes - Array of nodes to filter on.
 */
export function useFunctionalNodes(nodes: UiNode[]) {
  return nodes.filter(({ group }) =>
    (
      [
        UiNodeGroupEnum.Default,
        UiNodeGroupEnum.IdentifierFirst,
        UiNodeGroupEnum.Profile,
        UiNodeGroupEnum.Captcha,
      ] as UiNodeGroupEnum[]
    ).includes(group),
  )
}

/**
 * Type guard for UiNodeGroupEnum
 *
 * @param method - The string to type guard
 */
export function isUiNodeGroupEnum(method: string): method is UiNodeGroupEnum {
  // @ts-expect-error it's a string array, but typescript thinks the argument must be validated stricter
  return Object.values(UiNodeGroupEnum).includes(method)
}

/**
 * Returns true if the node is of group saml or oidc.
 *
 * @param node - The node
 */
function isSingleSignOnNode(node: UiNode): boolean {
  return node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml
}

/**
 * Returns true if the node group contains oidc or saml nodes.
 *
 * @param nodes - Array of nodes to search in.
 */
export function hasSingleSignOnNodes(nodes: UiNode[]) {
  return nodes.some(isSingleSignOnNode)
}

/** Returns all nodes that are not single sign on nodes (saml, oidc).
 *
 * @param nodes - Array of nodes to filter.
 */
export function withoutSingleSignOnNodes(nodes: UiNode[]) {
  return nodes.filter((node: UiNode) => !isSingleSignOnNode(node))
}

/**
 * Returns true if the node is visible.
 *
 * @param node - The node to check.
 */
export function isNodeVisible(node: UiNode): node is UiNodeInput {
  if (isUiNodeScriptAttributes(node.attributes)) {
    return false
  } else if (isUiNodeInputAttributes(node.attributes)) {
    if (node.attributes.type === 'hidden') {
      return false
    }
  }
  return true
}

export type GroupedNodes = Partial<Record<UiNodeGroupEnum, UiNode[]>>

/**
 * Returns a record which have at least one visible or interactive element (button,
 * text field, image).
 *
 * Groups which have only hidden or otherwise non-interactive elements (e.g. scripts or
 * hidden input fields) are omitted from the result.
 *
 * @param nodes - Array of nodes to filter on.
 * @returns Record of groups with at least one visible element and their nodes.
 */
export function useNodeGroupsWithVisibleNodes(nodes: UiNode[]): GroupedNodes {
  return useMemo(() => {
    const groups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    const groupRetained: Partial<Record<UiNodeGroupEnum, number>> = {}

    for (const node of nodes) {
      const groupNodes = groups[node.group] ?? []
      const groupCount = groupRetained[node.group] ?? 0

      groupNodes.push(node)
      groups[node.group] = groupNodes
      if (!isNodeVisible(node)) {
        continue
      }

      groupRetained[node.group] = groupCount + 1
    }

    const finalGroups: Partial<Record<UiNodeGroupEnum, UiNode[]>> = {}
    for (const [group, count] of Object.entries(groupRetained)) {
      if (count > 0) {
        finalGroups[group as UiNodeGroupEnum] = groups[group as UiNodeGroupEnum]
      }
    }

    return finalGroups
  }, [nodes])
}

/**
 * Finds the identifier node for code auth method.
 *
 * @param nodes the UI nodes to filter (usually flow.ui.nodes)
 * @returns the UiNode that corresponds to the identfiier for code method, or undefined if not found
 */
export function findCodeIdentifierNode(nodes: UiNode[]): UiNodeInput | undefined {
  return (findNode(nodes, {
    group: 'identifier_first',
    node_type: 'input',
    name: 'identifier',
  }) ??
    findNode(nodes, {
      group: 'code',
      node_type: 'input',
      name: 'address',
    })) as UiNodeInput | undefined
}
```

## ory/packages/elements-react/src/util/utilFixSDKTypesHelper.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNode,
  UiNodeAnchorAttributes,
  UiNodeDivisionAttributes,
  UiNodeImageAttributes,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTextAttributes,
} from '@ory/client-fetch'

// Explanation:
// The way we generate the SDK makes the default UINode types very difficult to work.
// UiNode is a polymorphic type, but the polymorphism is expressed in a child property.
// This makes type narrowing very difficult and requires a lot of type assertions in the codebase.
// To fix this, we create our own type definitions that express the polymorphism at the top level.
// This makes it much easier to work with the types and reduces the need for type assertions.
// It's also safe, because there's already a `type` property that can be used to discriminate the types. It's just not used in the SDK types.
// TL;DR: We are fixing the SDK types to make them easier to work with.
// Fixing these in the SDK directly would likely be a breaking change, so we do it here for now.

/**
 * A single selectable value for an input node backed by a JSON schema `enum`.
 *
 * TODO: remove this type widening once `@ory/client-fetch` publishes a release
 * that ships `options` on `UiNodeInputAttributes`.
 */
export type UiNodeInputAttributesOption = {
  value: unknown
}

/**
 * Same as `UiNodeInputAttributes`, but additionally carries the optional
 * `options` field used to render enum traits as a dropdown. The Kratos server
 * populates this field whenever a JSON schema property declares an `enum`.
 */
export type UiNodeInputAttributesWithOptions = UiNodeInputAttributes & {
  options?: UiNodeInputAttributesOption[]
}

export type UiNodeInput = UiNode & {
  type: 'input'
  attributes: UiNodeInputAttributesWithOptions
}
export function isUiNodeInput(node: UiNode): node is UiNodeInput {
  return node.type === 'input'
}

export type UiNodeImage = UiNode & {
  type: 'img'
  attributes: UiNodeImageAttributes
}

export function isUiNodeImage(node: UiNode): node is UiNodeImage {
  return node.type === 'img'
}

export type UiNodeAnchor = UiNode & {
  type: 'a'
  attributes: UiNodeAnchorAttributes
}

export function isUiNodeAnchor(node: UiNode): node is UiNodeAnchor {
  return node.type === 'a'
}

export type UiNodeText = UiNode & {
  type: 'text'
  attributes: UiNodeTextAttributes
}

export function isUiNodeText(node: UiNode): node is UiNodeText {
  return node.type === 'text'
}

export type UiNodeScript = UiNode & {
  type: 'script'
  attributes: UiNodeScriptAttributes
}

export function isUiNodeScript(node: UiNode): node is UiNodeScript {
  return node.type === 'script'
}

export type UiNodeDiv = UiNode & {
  type: 'div'
  attributes: UiNodeDivisionAttributes
}

export function isUiNodeDiv(node: UiNode): node is UiNodeDiv {
  return node.type === 'div'
}

export type UiNodeFixed =
  UiNodeInput | UiNodeImage | UiNodeAnchor | UiNodeText | UiNodeScript | UiNodeDiv
```

## ory/packages/elements-react/src/theme/default/assets/global.d.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

declare module '*.svg' {
  import { SVGIcon } from './types'

  const ReactComponent: SVGIcon

  export default ReactComponent
}
```

## ory/packages/elements-react/src/theme/default/assets/types.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export type SVGIcon = React.FunctionComponent<React.ComponentProps<'svg'> & { size?: number }>
```

## ory/packages/elements-react/src/theme/default/components/card/auth-method-list-container.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from 'react'

export function DefaultAuthMethodListContainer({ children }: PropsWithChildren) {
  return <div className="grid grid-cols-1 gap-2">{children}</div>
}
```

## ory/packages/elements-react/src/theme/default/components/card/auth-method-list-item.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiContainer, UiNode, UiNodeGroupEnum, UiNodeInputAttributes } from '@ory/client-fetch'
import { OryCardAuthMethodListItemProps, useOryFlow } from '@ory/elements-react'
import { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useEventListener, useTimeout } from 'usehooks-ts'
import { kratosMessages } from '../../../../util/i18n/generated/kratosMessages'
import { findCodeIdentifierNode, triggerToFunction } from '../../../../util/ui'
import AlertIcon from '../../assets/icons/alert-triangle.svg'
import lookup_secret from '../../assets/icons/code-asterix.svg'
import code from '../../assets/icons/code.svg'
import { default as hardware_token, default as passkey } from '../../assets/icons/passkey.svg'
import password from '../../assets/icons/password.svg'
import totp from '../../assets/icons/totp.svg'
import webauthn from '../../assets/icons/webauthn.svg'
import logos from '../../provider-logos'
import { isGroupImmediateSubmit } from '../../utils/form'
import { ListItem } from './list-item'

const iconsMap: Record<string, typeof code> = {
  code,
  passkey,
  password,
  webauthn,
  hardware_token,
  totp,
  lookup_secret,
  ...logos,
}

const titles = defineMessages<string>({
  [UiNodeGroupEnum.Password]: {
    id: 'two-step.password.title',
    defaultMessage: 'Password',
  },
  [UiNodeGroupEnum.Code]: {
    id: 'two-step.code.title',
    defaultMessage: 'Email code',
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: 'two-step.webauthn.title',
    defaultMessage: 'Security key',
  },
  [UiNodeGroupEnum.Passkey]: {
    id: 'two-step.passkey.title',
    defaultMessage: 'Passkey (recommended)',
  },
  [UiNodeGroupEnum.Totp]: {
    id: 'two-step.totp.title',
    defaultMessage: 'Use your Authenticator App (TOTP)',
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: 'two-step.lookup_secret.title',
    defaultMessage: 'Backup recovery code',
  },
})

export const descriptions = defineMessages<string>({
  [UiNodeGroupEnum.Password]: {
    id: 'two-step.password.description',
    defaultMessage: 'Enter your password associated with your account',
  },
  [UiNodeGroupEnum.Code]: {
    id: 'two-step.code.description',
    defaultMessage: 'A verification code will be sent to your email',
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: 'two-step.webauthn.description',
    defaultMessage: 'Use your security key to authenticate',
  },
  [UiNodeGroupEnum.Passkey]: {
    id: 'two-step.passkey.description',
    defaultMessage: "Use your device's for fingerprint or face recognition",
  },
  [UiNodeGroupEnum.Totp]: {
    id: 'two-step.totp.description',
    defaultMessage: 'Use a 6-digit one-time code from your authenticator app',
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: 'two-step.lookup_secret.description',
    defaultMessage: 'Use up one of your 8-digit backup codes to authenticate',
  },
})

// TODO: change group to UiNodeGroupEnum throughout
function formatTitle(group: string, nodes: UiNode[], intl: ReturnType<typeof useIntl>): string {
  const fallbackTitle = { id: `two-step.${group}.title` }

  if (group === 'code') {
    const identifier = findCodeIdentifierNode(nodes)?.attributes?.value
    if (identifier) {
      return intl.formatMessage(kratosMessages['1010023'], {
        address: identifier,
      })
    }
  }

  return intl.formatMessage(titles[group] ?? fallbackTitle)
}

export function DefaultAuthMethodListItem({
  onClick,
  group,
  disabled,
}: OryCardAuthMethodListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap[group] || null
  const { flow } = useOryFlow()

  if (group === 'passkey') {
    const passkeyNode = findPasskeyNode(flow)
    if (!passkeyNode) {
      // If the passkey node is not found, we return null
      // to avoid rendering the list item.
      // Shouldn't happen, but just in case.
      console.error('Passkey node not found')
      return null
    }

    return <PasskeyListItem passkeyNode={passkeyNode} disabled={disabled} />
  }

  const fallbackDescription = { id: `two-step.${group}.description` }
  return (
    <ListItem
      as="button"
      icon={Icon}
      title={formatTitle(group, flow.ui.nodes, intl)}
      description={intl.formatMessage(descriptions[group] ?? fallbackDescription)}
      onClick={onClick}
      type={isGroupImmediateSubmit(group) ? 'submit' : 'button'}
      data-testid={`ory/form/auth-picker/${group}`}
      disabled={disabled}
    />
  )
}

function findPasskeyNode(flow: {
  ui: UiContainer
}): { attributes: UiNodeInputAttributes } | undefined {
  const passkeyTriggerNode = flow.ui.nodes.find(
    (node) =>
      node.attributes.node_type === 'input' &&
      ['passkey_login_trigger', 'passkey_register_trigger'].includes(node.attributes.name),
  )

  if (!passkeyTriggerNode) {
    return undefined
  }

  return passkeyTriggerNode as { attributes: UiNodeInputAttributes }
}

type PasskeyListItemProps = {
  passkeyNode: { attributes: UiNodeInputAttributes }
  disabled?: boolean
}

function PasskeyListItem({ passkeyNode, disabled }: PasskeyListItemProps) {
  const intl = useIntl()
  const Icon = iconsMap.passkey || null

  const [isPasskeyScriptInitalized, setPasskeyScriptInitalized] = useState(false)
  const [failedToLoad, setFailedToLoad] = useState(false)

  const clickHandler = () => {
    if (!passkeyNode.attributes.onclickTrigger) {
      console.error('Passkey node not found')
      return
    }
    const fn = triggerToFunction(passkeyNode.attributes.onclickTrigger)
    if (fn) {
      fn()
    } else {
      console.error('Passkey node trigger function not found')
    }
  }

  useEffect(() => {
    if (!passkeyNode.attributes.onclickTrigger) {
      console.error('Passkey node not found')
      return
    }
    const fn = triggerToFunction(passkeyNode.attributes.onclickTrigger)

    setPasskeyScriptInitalized(typeof fn === 'function')
  }, [passkeyNode])

  useEventListener('oryWebAuthnInitialized' as keyof WindowEventMap, () => {
    setPasskeyScriptInitalized(true)
  })

  useTimeout(() => {
    if (!isPasskeyScriptInitalized) {
      setFailedToLoad(true)
    }
  }, 5000)

  if (failedToLoad) {
    return (
      <ListItem
        as="button"
        icon={Icon}
        disabled={true}
        title={intl.formatMessage(titles.passkey)}
        description={intl.formatMessage({
          id: 'two-step.passkey.description.error',
          defaultMessage:
            'Could not load the necessary libraries to use your Passkey. Please try again later.',
        })}
        type="button"
        data-testid={`ory/form/auth-picker/passkey`}
      >
        <AlertIcon />
      </ListItem>
    )
  }

  return (
    <ListItem
      as="button"
      icon={Icon}
      disabled={!isPasskeyScriptInitalized || disabled}
      name={passkeyNode.attributes.name}
      title={intl.formatMessage(titles.passkey)}
      description={intl.formatMessage(descriptions.passkey)}
      onClick={clickHandler}
      type="button"
      data-testid={`ory/form/auth-picker/passkey`}
    />
  )
}
```

## ory/packages/elements-react/src/theme/default/components/card/badge.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import OryLogoHorizontal from '../../assets/ory-badge-horizontal.svg'
import OryLogoVertical from '../../assets/ory-badge-vertical.svg'

export function Badge() {
  return (
    <div
      data-testid="ory/card/badge"
      className="absolute border border-ory-border-default bg-ory-background-default p-2 font-bold text-ory-foreground-default max-sm:bottom-0 max-sm:left-8 max-sm:translate-y-full max-sm:rounded-b-branding max-sm:py-[7px] sm:top-8 sm:right-0 sm:translate-x-full sm:rounded-r-branding sm:pl-[7px]"
    >
      <OryLogoHorizontal width={22} height={8} className="sm:hidden" />
      <OryLogoVertical width={8} height={22} className="max-sm:hidden" />
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/card/content.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardContentProps } from '@ory/elements-react'

/**
 * Simply renders the children passed to it.
 *
 * @param props - pass children to render instead of the default Ory Card components
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultCardContent({ children }: OryCardContentProps) {
  return children
}
```

## ory/packages/elements-react/src/theme/default/components/card/current-identifier-button.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  isUiNodeInputAttributes,
  Session,
  UiNode,
  UiNodeInputAttributes,
} from '@ory/client-fetch'
import { useOryConfiguration, useOryFlow } from '@ory/elements-react'
import { useSession } from '@ory/elements-react/client'
import { useEffect, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { useFormContext } from 'react-hook-form'
import { findScreenSelectionButton } from '../../../../util/nodes'
import { omitInputAttributes } from '../../../../util/omitAttributes'
import { isUiNodeInput } from '../../../../util/utilFixSDKTypesHelper'
import IconArrowLeft from '../../assets/icons/arrow-left.svg'
import { restartFlowUrl } from '../../utils/url'

/**
 * The `DefaultCurrentIdentifierButton` component renders a button that displays the current identifier
 *
 * The button can be used to restart the flow with the current identifier if appropriate.
 *
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultCurrentIdentifierButton() {
  const { flow, flowType, formState } = useOryFlow()
  const { setValue, getValues, watch } = useFormContext()
  const [turnstileResponse, setTurnstileResponse] = useState<string | undefined>()
  const config = useOryConfiguration()
  const { session } = useSession()
  const ui = flow.ui

  // This workaround ensures that the screen/back button functions correctly. Without it, the button does not work as expected.
  // The `captcha_turnstile_response` value cannot be accessed directly via `transient_payload.captcha_turnstile_response`
  // in the form context, likely due to the way React Hook Form manages its internal state and transient payloads.
  // By using the `watch` function, we can observe changes to the `transient_payload` and retrieve the captcha response value.
  const captchaVerificationValue = watch('transient_payload')?.captcha_turnstile_response as
    string | undefined
  useEffect(() => {
    if (captchaVerificationValue) {
      setTurnstileResponse(captchaVerificationValue)
    }
  }, [captchaVerificationValue])

  if (formState.current === 'provide_identifier') {
    return null
  }

  const nodeBackButton = getBackButtonNodeAttributes(flowType, ui.nodes)

  // On refresh and second factor login screens, show the current identifier as
  // a non-interactive indicator (no arrow, no navigation). The user cannot
  // change the identifier mid-flow, but they still need to see which account
  // they are authenticating as. The identifier is read from the flow's hidden
  // `identifier` node when present (e.g. refresh with password/code) and falls
  // back to the authenticated session's identity when the flow carries none
  // (e.g. the initial 2FA screen for totp or lookup secret).
  if (flowType === FlowType.Login && (flow.requested_aal === 'aal2' || flow.refresh)) {
    const identifier =
      nodeBackButton?.value || identifierFromUiNodes(ui.nodes) || identifierFromSession(session)
    if (!identifier) {
      return null
    }
    return (
      <span
        className={
          'inline-flex max-w-full items-center gap-1 self-start rounded-identifier border border-button-identifier-border-border-default bg-button-identifier-background-default px-[11px] py-[5px]'
        }
        data-testid={`ory/screen/${flowType}/current-identifier`}
      >
        <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
          <span className="overflow-hidden text-sm font-medium text-nowrap text-ellipsis text-button-identifier-foreground-default">
            {identifier}
          </span>
        </span>
      </span>
    )
  }

  if (!nodeBackButton) {
    return null
  }

  const initFlowUrl = restartFlowUrl(flow, `${config.sdk.url}/self-service/${flowType}/browser`)

  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
  if (screenSelectionNode) {
    // This is bad and needs refactoring. Instead of a custom form, it should use react-hook-form
    // to submit the values so we don't have to creat a fake form with fake submit values. It
    // also hard-reloads the flow and we need the ugly captcha workaround.
    return (
      <form action={flow.ui.action} method={flow.ui.method}>
        {flow.ui.nodes
          .filter((n) => {
            if (isUiNodeInputAttributes(n.attributes)) {
              return n.attributes.type === 'hidden' && ['default', 'captcha'].includes(n.group)
            }
            return false
          })
          .map((n: UiNode) => {
            const attrs = n.attributes as UiNodeInputAttributes
            let value = getValues(attrs.name) || attrs.value

            // Of course turnstile works a bit differently because it uses transient_payload
            // to carry over information. So yeah, we need a special decode here.
            if (
              attrs.name === 'transient_payload.captcha_turnstile_response' &&
              turnstileResponse
            ) {
              value = turnstileResponse
            }

            return <input key={attrs.name} type="hidden" name={attrs.name} value={value} />
          })}
        <button
          className={
            'group inline-flex max-w-full cursor-pointer items-center gap-1 self-start rounded-identifier border border-button-identifier-border-border-default bg-button-identifier-background-default px-[11px] py-[5px] transition-colors hover:border-button-identifier-border-border-hover hover:bg-button-identifier-background-hover'
          }
          {...omitInputAttributes(nodeBackButton)}
          type={'submit'}
          onClick={() => {
            setValue(screenSelectionNode.attributes.name, screenSelectionNode.attributes.value)
            setValue('method', 'profile')
          }}
          name={screenSelectionNode.attributes.name}
          value={screenSelectionNode.attributes.value}
          title={nodeBackButton.value ? `Adjust ${nodeBackButton.value}` : `Back`}
          data-testid={`ory/screen/${flowType}/action/restart`}
        >
          <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
            <IconArrowLeft
              size={16}
              stroke="1"
              className="shrink-0 text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
            />
            <span className="overflow-hidden text-sm font-medium text-nowrap text-ellipsis text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover">
              {nodeBackButton.value ? nodeBackButton.value : 'Back'}
            </span>
          </span>
        </button>
      </form>
    )
  }

  return (
    <a
      className={
        'group inline-flex max-w-full cursor-pointer items-center gap-1 self-start rounded-identifier border border-button-identifier-border-border-default bg-button-identifier-background-default px-[11px] py-[5px] transition-colors hover:border-button-identifier-border-border-hover hover:bg-button-identifier-background-hover'
      }
      {...omitInputAttributes(nodeBackButton)}
      href={initFlowUrl}
      title={`Adjust ${nodeBackButton?.value}`}
      data-testid={`ory/screen/${flowType}/action/restart`}
    >
      <span className="inline-flex min-h-5 items-center gap-2 overflow-hidden text-ellipsis">
        <IconArrowLeft
          size={16}
          stroke="1"
          className="shrink-0 text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover"
        />
        <span className="overflow-hidden text-sm font-medium text-nowrap text-ellipsis text-button-identifier-foreground-default group-hover:text-button-identifier-foreground-hover">
          {nodeBackButton?.value}
        </span>
      </span>
    </a>
  )
}

export function getBackButtonNodeAttributes(
  flowType: FlowType,
  nodes: UiNode[],
): UiNodeInputAttributes | undefined {
  let nodeBackButtonAttributes: UiNodeInputAttributes | undefined
  switch (flowType) {
    case FlowType.Login:
      nodeBackButtonAttributes = nodes.find(
        (node) =>
          isUiNodeInputAttributes(node.attributes) &&
          node.attributes.name === 'identifier' &&
          ['default', 'identifier_first'].includes(node.group),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Registration:
      nodeBackButtonAttributes = guessRegistrationBackButton(nodes)
      break
    case FlowType.Recovery:
      nodeBackButtonAttributes = nodes.find(
        (n) =>
          isUiNodeInputAttributes(n.attributes) &&
          !!n.attributes.value &&
          ['email', 'recovery_confirm_address', 'recovery_address'].includes(n.attributes.name),
      )?.attributes as UiNodeInputAttributes | undefined
      break
    case FlowType.Verification:
      // Re-use the email node for displaying the email
      nodeBackButtonAttributes = nodes.find(
        (n) => isUiNodeInputAttributes(n.attributes) && n.attributes.name === 'email',
      )?.attributes as UiNodeInputAttributes | undefined
      break
  }

  if (nodeBackButtonAttributes?.node_type !== 'input' || !nodeBackButtonAttributes?.value) {
    return undefined
  }

  return nodeBackButtonAttributes
}

const backButtonCandiates = ['traits.email', 'traits.username', 'traits.phone_number']

/**
 * Guesses the back button for registration flows
 *
 * This is based on the list above, and the first node that matches the criteria is returned.
 *
 * The list is most likely not exhaustive yet, and may need to be updated in the future.
 *
 */
export function guessRegistrationBackButton(uiNodes: UiNode[]): UiNodeInputAttributes | undefined {
  return uiNodes.find(
    (node) =>
      isUiNodeInputAttributes(node.attributes) &&
      backButtonCandiates.includes(node.attributes.name) &&
      node.group === 'default',
  )?.attributes as UiNodeInputAttributes | undefined
}

// Resolves the identifier from any input node named `identifier` on the flow,
// regardless of group. Used by the read-only current-identifier indicator on
// refresh and second factor screens, where the identifier may be present in
// groups other than `default` or `identifier_first` (for example, the `code`
// group on the 2FA code-sent screen).
function identifierFromUiNodes(nodes: UiNode[]): string | undefined {
  for (const node of nodes) {
    if (isUiNodeInput(node) && node.attributes.name === 'identifier') {
      const value = node.attributes.value
      if (typeof value === 'string' && value.length > 0) {
        return value
      }
    }
  }
  return undefined
}

// Resolves a human-readable identifier (email, phone number, or username) from
// the authenticated session's identity traits. Used as a fallback for the
// current-identifier indicator on login screens where the flow itself does not
// carry the identifier (for example, the initial second factor screens).
function identifierFromSession(session: Session | null | undefined): string | undefined {
  const traits = session?.identity?.traits
  if (!traits || typeof traits !== 'object') {
    return undefined
  }
  const t = traits as Record<string, unknown>
  for (const key of ['email', 'phone_number', 'username']) {
    const value = t[key]
    if (typeof value === 'string' && value.length > 0) {
      return value
    }
  }
  return undefined
}
```

## ory/packages/elements-react/src/theme/default/components/card/footer.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow } from '@ory/client-fetch'
import { ConsentFlow, FormState, Node, useOryConfiguration, useOryFlow } from '@ory/elements-react'
import { useIntl } from 'react-intl'
import { toAuthMethodPickerOptions } from '../../../../components/card/two-step/state-select-method'
import { findScreenSelectionButton } from '../../../../util/nodes'
import {
  findNode,
  nodesToAuthMethodGroups,
  useNodeGroupsWithVisibleNodes,
} from '../../../../util/ui'
import { isUiNodeInput, UiNodeInput } from '../../../../util/utilFixSDKTypesHelper'
import { useClientLogout } from '../../utils/logout'
import { initFlowUrl, restartFlowUrl } from '../../utils/url'

/**
 * DefaultCardFooter renders the default footer for the card component based on the current flow type.
 *
 * @returns The default card footer component that renders the appropriate footer based on the current flow type.
 * @group Components
 * @category Default Components
 */
export function DefaultCardFooter() {
  const oryFlow = useOryFlow()
  switch (oryFlow.flowType) {
    case FlowType.Login:
      return <LoginCardFooter flow={oryFlow.flow} />
    case FlowType.Registration:
      return <RegistrationCardFooter />
    case FlowType.Recovery:
      return <RecoveryCardFooter />
    case FlowType.Verification:
      return <VerificationCardFooter />
    case FlowType.OAuth2Consent:
      return <ConsentCardFooter flow={oryFlow.flow} />
    default:
      return null
  }
}

function shouldShowLogoutButton(flow: LoginFlow, formState: FormState, authMethods: string[]) {
  // Always for refresh flows, as we know there is a session
  if (flow.refresh) {
    return true
  }

  // In aal2 flows we sometimes show the logout button
  if (flow.requested_aal === 'aal2') {
    // Always on the "method selector" screen
    if (formState.current === 'select_method') {
      return true
    }
    // On the "method active" screen, if it's a code method
    // If the method is any other than code, we want to show a "Choose another method" button
    // This is handled below.
    // TODO: refactor this, to not have this logic in two places
    if (formState.current === 'method_active' && flow.active === 'code') {
      return true
    }
    // If there are no other methods, we want to show the logout button
    // This is the case when the user only has one method (e.g. code or totp), set up
    // and the user is on the "method active" screen
    // In that case there is no "select_method" state, so going back to that screen wouldn't work
    if (formState.current === 'method_active' && authMethods.length === 1) {
      return true
    }
  }
  return false
}

type LoginCardFooterProps = {
  flow: LoginFlow
}

function LoginCardFooter({ flow }: LoginCardFooterProps) {
  const { dispatchFormState, formState } = useOryFlow()
  const config = useOryConfiguration()
  const intl = useIntl()

  const authMethods = nodesToAuthMethodGroups(flow.ui.nodes)

  let returnTo = config.project.default_redirect_url
  if (flow.return_to) {
    returnTo = flow.return_to
  }
  if (!returnTo) {
    returnTo = restartFlowUrl(flow, `${config.sdk.url}/self-service/${FlowType.Login}/browser`)
  }

  if (shouldShowLogoutButton(flow, formState, authMethods)) {
    return <LogoutButton returnTo={returnTo} />
  }

  return (
    <>
      {formState.current === 'provide_identifier' &&
        config.project.registration_enabled &&
        !config.project.hide_registration_link && (
          <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
            {intl.formatMessage({
              id: 'login.registration-label',
              defaultMessage: "Don't have an account?",
            })}{' '}
            <a
              className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
              href={initFlowUrl(config.sdk.url, 'registration', flow)}
              data-testid={'ory/screen/login/action/register'}
            >
              {intl.formatMessage({
                id: 'login.registration-button',
                defaultMessage: 'Sign up',
              })}
            </a>
          </span>
        )}
      {authMethods.length > 1 && formState.current === 'method_active' && (
        <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
          <button
            className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            onClick={() => {
              dispatchFormState({
                type: 'action_clear_active_method',
              })
            }}
            data-testid={'ory/screen/login/mfa/action/selectMethod'}
          >
            {intl.formatMessage({
              id: 'login.2fa.method.go-back',
              defaultMessage: 'Choose another method',
            })}
          </button>
        </span>
      )}
      {authMethods.length === 1 &&
        authMethods[0] === 'code' &&
        formState.current === 'method_active' && (
          <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
            <a
              className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
              href={returnTo}
              data-testid={'ory/screen/login/action/cancel'}
            >
              {intl.formatMessage({
                id: 'login.2fa.go-back.link',
                defaultMessage: 'Go back',
              })}
            </a>
          </span>
        )}
    </>
  )
}

type LogoutButtonProps = {
  returnTo?: string
}

function LogoutButton({ returnTo }: LogoutButtonProps) {
  const config = useOryConfiguration()
  const intl = useIntl()
  const { logoutFlow: logout, didLoad: didLoadLogout } = useClientLogout(config)

  return (
    <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
      {intl.formatMessage({
        id: 'login.2fa.go-back',
        defaultMessage: "Something isn't working?",
      })}{' '}
      <a
        className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
        href={logout ? logout?.logout_url : returnTo}
        data-testid={
          // Only add the test-id when the logout link has loaded.
          didLoadLogout ? 'ory/screen/login/action/logout' : undefined
        }
      >
        {!didLoadLogout || logout
          ? intl.formatMessage({
              id: 'login.logout-button',
              defaultMessage: 'Logout',
            })
          : intl.formatMessage({
              id: 'login.2fa.go-back.link',
              defaultMessage: 'Go back',
            })}
      </a>
    </span>
  )
}

function RegistrationCardFooter() {
  const intl = useIntl()
  const { flow, formState, dispatchFormState } = useOryFlow()
  const config = useOryConfiguration()
  const visibleGroups = useNodeGroupsWithVisibleNodes(flow.ui.nodes)
  const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)

  const screenSelectionNode = findScreenSelectionButton(flow.ui.nodes)
  switch (formState.current) {
    case 'method_active':
      if (!screenSelectionNode || Object.entries(authMethodBlocks).length < 2) {
        return null
      }

      return (
        <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
          <button
            className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            onClick={() => {
              dispatchFormState({
                type: 'action_clear_active_method',
              })
            }}
            data-testid={'ory/screen/registration/action/selectMethod'}
            type="button"
          >
            {intl.formatMessage({
              id: 'card.footer.select-another-method',
              defaultMessage: 'Select another method',
            })}
          </button>
        </span>
      )
    case 'select_method':
    default:
      return (
        <span className="leading-normal font-normal text-interface-foreground-default-primary antialiased">
          {intl.formatMessage({
            id: 'registration.login-label',
            defaultMessage: 'Already have an account?',
          })}{' '}
          <a
            className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            href={initFlowUrl(config.sdk.url, 'login', flow)}
            data-testid={'ory/screen/registration/action/login'}
          >
            {intl.formatMessage({
              id: 'registration.login-button',
              defaultMessage: 'Sign in',
            })}
          </a>
        </span>
      )
  }
}

function RecoveryCardFooter() {
  return null
}

function VerificationCardFooter() {
  return null
}

/**
 * Props for the ConsentCardFooter component.
 *
 * @hidden
 * @inline
 */
type ConsentCardFooterProps = {
  /** The consent flow to render the footer for. */
  flow: ConsentFlow
}

function ConsentCardFooter({ flow }: ConsentCardFooterProps) {
  const rememberNode = findNode(flow.ui.nodes, {
    group: 'oauth2_consent',
    node_type: 'input',
    name: 'remember',
  }) as UiNodeInput

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="leading-normal font-medium text-interface-foreground-default-secondary">
          Make sure you trust {flow.consent_request.client?.client_name}
        </p>
        <p className="leading-normal text-interface-foreground-default-secondary">
          You may be sharing sensitive information with this site or application.
        </p>
      </div>
      {rememberNode && <Node.Checkbox node={rememberNode} />}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {flow.ui.nodes
          .filter(
            (n): n is UiNodeInput =>
              n.attributes.node_type === 'input' &&
              n.attributes.type === 'submit' &&
              isUiNodeInput(n),
          )
          .map((n) => {
            return <Node.Button key={n.attributes.value} node={n} />
          })}
      </div>
      <p className="text-sm">
        <span className="text-interface-foreground-default-tertiary">
          Authorizing will redirect to {flow.consent_request.client?.client_name}
        </span>
      </p>
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/card/header.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { messageTestId, useComponents, useOryFlow } from '@ory/elements-react'
import { useCardHeaderText } from '../../utils/constructCardHeader'
import { DefaultCurrentIdentifierButton } from './current-identifier-button'

function InnerCardHeader({
  title,
  text,
  messageId,
}: {
  title: string
  text?: string
  messageId?: string
}) {
  const { Card } = useComponents()
  return (
    <header className="flex flex-col gap-8 antialiased">
      <Card.Logo />
      <div className="flex flex-col gap-2">
        <h2 className="text-lg leading-normal font-semibold text-interface-foreground-default-primary">
          {title}
        </h2>
        <p
          className="leading-normal text-interface-foreground-default-secondary"
          {...(messageId ? messageTestId({ id: messageId }) : {})}
        >
          {text}
        </p>
        <DefaultCurrentIdentifierButton />
      </div>
    </header>
  )
}

/**
 * Renders the default card header component.
 *
 * This component is used to display the header of a card, including the logo, title, description, and current identifier button.
 *
 * @returns the default card header component
 * @group Components
 * @category Default Components
 */
export function DefaultCardHeader() {
  const context = useOryFlow()
  const { title, description, messageId } = useCardHeaderText(context.flow.ui, context)

  return <InnerCardHeader title={title} text={description} messageId={messageId} />
}
```

## ory/packages/elements-react/src/theme/default/components/card/index.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardProps, useOryConfiguration } from '@ory/elements-react'
import { Badge } from './badge'
import { DefaultCardContent } from './content'
import { DefaultCardFooter } from './footer'
import { DefaultCardHeader } from './header'
import { DefaultCardLogo } from './logo'
import { DefaultCurrentIdentifierButton } from './current-identifier-button'
import { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../utils/cn'

/**
 * The DefaultCard component is a styled container that serves as the main card layout for Ory Elements.
 *
 * @param props - The properties for the DefaultCard component.
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultCard({
  children,
  className,
  ...rest
}: OryCardProps & ComponentPropsWithoutRef<'div'>) {
  const { project } = useOryConfiguration()

  return (
    <div className={cn('ory-elements', className)} {...rest}>
      <div className="flex w-full flex-1 items-start justify-center font-sans-default sm:w-[480px] sm:max-w-[480px] sm:items-center">
        <div
          className="relative grid w-full grid-cols-1 gap-8 border-b border-form-border-default bg-form-background-default px-8 py-12 sm:rounded-cards sm:border sm:px-12 sm:py-14"
          data-testid="ory/card"
        >
          {children}
          {!project.hide_ory_branding && <Badge />}
        </div>
      </div>
    </div>
  )
}

export {
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
  DefaultCurrentIdentifierButton,
}
```

## ory/packages/elements-react/src/theme/default/components/card/list-item.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from 'react'
import { SVGIcon } from '../../assets/types'
import { cn } from '../../utils/cn'

type ListItemProps<T extends React.ElementType = 'div'> = {
  icon: SVGIcon
  as?: T
  title: string
  description: string
}

export function ListItem<T extends React.ElementType = 'div'>({
  icon: Icon,
  as,
  title,
  description,
  children,
  className,
  ...props
}: PropsWithChildren<ListItemProps<T>> & React.ComponentPropsWithoutRef<T>) {
  const Comp = as || 'div'

  return (
    <Comp
      {...props}
      className={cn(
        'flex w-full cursor-pointer items-start gap-3 rounded-buttons p-2 text-left hover:bg-interface-background-default-primary-hover',
        'disabled:cursor-default disabled:opacity-50 disabled:hover:bg-ui-transparent',
        className as string,
      )}
    >
      <span className="mt-1">
        {Icon && <Icon size={16} className="text-interface-foreground-brand-primary" />}
      </span>
      <span className="inline-flex max-w-full min-w-1 flex-1 flex-col leading-normal">
        <span className="break-words text-interface-foreground-default-primary">{title}</span>
        <span className="text-interface-foreground-default-secondary">{description}</span>
      </span>
      {children}
    </Comp>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/card/logo.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryConfiguration, useOryFlow } from '@ory/elements-react'

/**
 * Returns the returnTo if defined and it doesn't contain the OAuth2 auth url
 *
 * @param flowReturnTo
 * @returns
 */
function getReturnTo(flowReturnTo: string | undefined) {
  if (!flowReturnTo || flowReturnTo.includes('/oauth2/auth')) {
    return null
  }
  return flowReturnTo
}

/**
 * The DefaultCardLogo component renders the logo from the {@link @ory/elements-react!OryProvider} or falls back to the project name.
 *
 * @returns the default logo for the Ory Card component.
 * @group Components
 * @category Default Components
 * @see {@link @ory/elements-react!OryProvider}
 * @see {@link @ory/elements-react!OryElementsConfiguration}
 */
export function DefaultCardLogo() {
  const config = useOryConfiguration()
  const { flow } = useOryFlow()

  if (config.project.logo_light_url) {
    const returnTo = getReturnTo(flow.return_to) ?? config.project.default_redirect_url
    if (!returnTo) {
      return (
        <img src={config.project.logo_light_url} className="h-full max-h-9 self-start" alt="Logo" />
      )
    }
    return (
      <a href={returnTo} aria-label="Go back to homepage" className="h-full max-h-9 self-start">
        <img src={config.project.logo_light_url} className="h-full max-h-9 w-full" alt="Logo" />
      </a>
    )
  }

  return (
    <h1 className="text-xl leading-normal font-semibold text-interface-foreground-default-primary">
      {config.project.name}
    </h1>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/default-components.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryFlowComponentOverrides, OryFlowComponents } from '@ory/elements-react'
import {
  DefaultCard,
  DefaultCardContent,
  DefaultCardFooter,
  DefaultCardHeader,
  DefaultCardLogo,
} from './card'
import { DefaultAuthMethodListItem } from './card/auth-method-list-item'
import { DefaultFormContainer, DefaultMessage, DefaultMessageContainer } from './form'
import { DefaultButton } from './form/button'
import { DefaultCheckbox } from './form/checkbox'
import { DefaultGroupContainer } from './form/group-container'
import { DefaultHorizontalDivider } from './form/horizontal-divider'
import { DefaultImage } from './form/image'
import { DefaultInput } from './form/input'
import { DefaultLabel } from './form/label'
import { DefaultSelect } from './form/select'
import { DefaultLinkButton } from './form/link-button'
import { DefaultPinCodeInput } from './form/pin-code-input'
import {
  DefaultFormSection,
  DefaultFormSectionContent,
  DefaultFormSectionFooter,
} from './form/section'
import { DefaultButtonSocial, DefaultSocialButtonContainer } from './form/sso'
import { DefaultText } from './form/text'
import { DefaultPageHeader } from './generic/page-header'
import { DefaultSettingsOidc } from './settings/settings-oidc'
import { DefaultSettingsPasskey } from './settings/settings-passkey'
import { DefaultSettingsRecoveryCodes } from './settings/settings-recovery-codes'
import { DefaultSettingsTotp } from './settings/settings-totp'
import { DefaultSettingsWebauthn } from './settings/settings-webauthn'
import { DefaultAuthMethodListContainer } from './card/auth-method-list-container'
import { DefaultCaptcha } from './form/captcha'
import { DefaultConsentScopeCheckbox } from './form/consent-scope-checkbox'
import { DefaultToast } from './generic/toast'

/**
 * Merges the default Ory components with any provided overrides.
 *
 * The output of this function is a complete set of components that can be used in Ory flows.
 *
 * @param overrides - Optional overrides for the default components.
 * @returns
 *
 * @category Utilities
 */
export function getOryComponents(overrides?: OryFlowComponentOverrides): OryFlowComponents {
  // Yes, this could probably be easier by using lodash or a custom merge function.
  // But, this makes it very explicit what can be overridden, and does not introduce issues with merging nested fields.
  return {
    Card: {
      Root: overrides?.Card?.Root ?? DefaultCard,
      Footer: overrides?.Card?.Footer ?? DefaultCardFooter,
      Header: overrides?.Card?.Header ?? DefaultCardHeader,
      Content: overrides?.Card?.Content ?? DefaultCardContent,
      Logo: overrides?.Card?.Logo ?? DefaultCardLogo,
      Divider: overrides?.Card?.Divider ?? DefaultHorizontalDivider,
      AuthMethodListContainer:
        overrides?.Card?.AuthMethodListContainer ?? DefaultAuthMethodListContainer,
      AuthMethodListItem: overrides?.Card?.AuthMethodListItem ?? DefaultAuthMethodListItem,
      SettingsSection: overrides?.Card?.SettingsSection ?? DefaultFormSection,
      SettingsSectionContent: overrides?.Card?.SettingsSectionContent ?? DefaultFormSectionContent,
      SettingsSectionFooter: overrides?.Card?.SettingsSectionFooter ?? DefaultFormSectionFooter,
    },
    Node: {
      Button: overrides?.Node?.Button ?? DefaultButton,
      SsoButton: overrides?.Node?.SsoButton ?? DefaultButtonSocial,
      Input: overrides?.Node?.Input ?? DefaultInput,
      Select: overrides?.Node?.Select ?? DefaultSelect,
      CodeInput: overrides?.Node?.CodeInput ?? DefaultPinCodeInput,
      Image: overrides?.Node?.Image ?? DefaultImage,
      Label: overrides?.Node?.Label ?? DefaultLabel,
      Checkbox: overrides?.Node?.Checkbox ?? DefaultCheckbox,
      Text: overrides?.Node?.Text ?? DefaultText,
      Anchor: overrides?.Node?.Anchor ?? DefaultLinkButton,
      Captcha: overrides?.Node?.Captcha ?? DefaultCaptcha,
      ConsentScopeCheckbox: overrides?.Node?.ConsentScopeCheckbox ?? DefaultConsentScopeCheckbox,
    },
    Form: {
      Root: overrides?.Form?.Root ?? DefaultFormContainer,
      Group: overrides?.Form?.Group ?? DefaultGroupContainer,
      SsoRoot: overrides?.Form?.SsoRoot ?? DefaultSocialButtonContainer,
      RecoveryCodesSettings: overrides?.Form?.RecoveryCodesSettings ?? DefaultSettingsRecoveryCodes,
      TotpSettings: overrides?.Form?.TotpSettings ?? DefaultSettingsTotp,
      SsoSettings: overrides?.Form?.SsoSettings ?? DefaultSettingsOidc,
      WebauthnSettings: overrides?.Form?.WebauthnSettings ?? DefaultSettingsWebauthn,
      PasskeySettings: overrides?.Form?.PasskeySettings ?? DefaultSettingsPasskey,
    },
    Message: {
      Root: overrides?.Message?.Root ?? DefaultMessageContainer,
      Content: overrides?.Message?.Content ?? DefaultMessage,
      Toast: overrides?.Message?.Toast ?? DefaultToast,
    },
    Page: {
      Header: overrides?.Page?.Header ?? DefaultPageHeader,
    },
  }
}
```

## ory/packages/elements-react/src/theme/default/components/form/button.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from '@ory/client-fetch'
import { OryNodeButtonProps, uiTextToFormattedMessage } from '@ory/elements-react'
import { cva } from 'class-variance-authority'
import { useIntl } from 'react-intl'
import { Spinner } from './spinner'
import { useMemo } from 'react'
import { cn } from '../../utils/cn'

export const buttonStyles = cva(
  [
    'group relative flex cursor-pointer justify-center gap-3 overflow-hidden rounded-buttons leading-none font-medium ring-1 ring-inset',
    'disabled:cursor-not-allowed loading:pointer-events-none loading:cursor-wait',
    'transition-colors duration-100 ease-linear',
    'max-w-[488px] p-4',
  ],
  {
    variants: {
      intent: {
        primary: [
          'bg-button-primary-background-default text-button-primary-foreground-default ring-button-primary-border-default',
          'hover:bg-button-primary-background-hover hover:text-button-primary-foreground-hover hover:ring-button-primary-border-hover',
          'disabled:bg-button-primary-background-disabled disabled:text-button-primary-foreground-disabled disabled:ring-button-primary-border-disabled',
          'loading:bg-button-primary-background-default loading:text-button-primary-foreground-default loading:ring-button-primary-border-default',
        ],
        secondary: [
          'bg-button-secondary-background-default text-button-secondary-foreground-default ring-button-secondary-border-default',
          'hover:bg-button-secondary-background-hover hover:text-button-secondary-foreground-hover hover:ring-button-secondary-border-hover',
          'disabled:bg-button-secondary-background-disabled disabled:text-button-secondary-foreground-disabled disabled:ring-button-secondary-border-disabled',
          'loading:bg-button-secondary-background-default loading:text-button-secondary-foreground-default loading:ring-button-secondary-border-default',
        ],
        social: [
          'bg-button-social-background-default text-button-social-foreground-default ring-button-social-border-default',
          'hover:bg-button-social-background-hover hover:text-button-social-foreground-hover hover:ring-button-social-border-hover',
          'disabled:bg-button-social-background-disabled disabled:text-button-social-foreground-disabled disabled:ring-button-social-border-disabled',
          'loading:bg-button-social-background-default loading:text-button-social-foreground-default loading:ring-button-social-border-default',
        ],
      },
    },
  },
)

export const DefaultButton = ({ node, buttonProps, isSubmitting }: OryNodeButtonProps) => {
  const intl = useIntl()
  const label = getNodeLabel(node)

  const isPrimary = useMemo(() => {
    return (
      node.attributes.name === 'method' ||
      node.attributes.name.includes('passkey') ||
      node.attributes.name.includes('webauthn') ||
      node.attributes.name.includes('lookup_secret') ||
      (node.attributes.name.includes('action') && node.attributes.value === 'accept')
    )
  }, [node.attributes.name, node.attributes.value])

  return (
    <button
      {...buttonProps}
      data-testid={`ory/form/node/button/${node.attributes.name}`}
      data-loading={isSubmitting}
      className={buttonStyles({
        intent: isPrimary ? 'primary' : 'secondary',
      })}
    >
      {isSubmitting && (
        <Spinner
          className={cn(
            isPrimary
              ? 'stroke-button-primary-foreground-default'
              : 'stroke-button-secondary-foreground-default',
          )}
        />
      )}
      {label && (
        <span className="group-loading:opacity-20">{uiTextToFormattedMessage(label, intl)}</span>
      )}
    </button>
  )
}

DefaultButton.displayName = 'DefaultButton'
```

## ory/packages/elements-react/src/theme/default/components/form/captcha.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { isUiNodeInputAttributes, UiText } from '@ory/client-fetch'
import { OryNodeCaptchaProps, useComponents, useOryFlow } from '@ory/elements-react'
import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-restricted-imports
import { useFormContext } from 'react-hook-form'
import { cn } from '../../utils/cn'
import { useIntl } from 'react-intl'

type Config = {
  sitekey: string
  action: string
  theme: 'auto' | 'light' | 'dark'
  response_field_name: string
}

export const DefaultCaptcha = ({ node }: OryNodeCaptchaProps) => {
  const { Message } = useComponents()
  const intl = useIntl()
  const { setValue } = useFormContext()
  const { dispatchFormState, formState } = useOryFlow()
  const ref = useRef<TurnstileInstance>()
  const [isInteractive, setInteractive] = useState(false)
  const [errorMessage, setErrorMessage] = useState<UiText | undefined>()
  // In this node, we only care about the `captcha-turnstile-options` node as that contains
  // all required information to render the captcha.

  // Reset widget whenever form is done submitting
  useEffect(() => {
    if (!formState.isSubmitting) {
      dispatchFormState({
        type: 'form_input_loading',
        group: 'captcha',
      })
      // Adding a small timeout to ensure the form submission process has completed
      setTimeout(() => {
        if (ref.current) {
          ref.current.reset()
        }
      }, 100)
    }
  }, [formState.isSubmitting, dispatchFormState])

  useEffect(() => {
    dispatchFormState({
      type: 'form_input_loading',
      group: 'captcha',
    })
  }, [dispatchFormState])

  if (!isUiNodeInputAttributes(node.attributes)) {
    return null
  }

  if (node.attributes.name === 'transient_payload.captcha_turnstile_response') {
    // This is the hidden field that gets populated.
    return null
  } else if (node.attributes.name === 'captcha_turnstile_options') {
    // This is the actual widget
    const options: Config = JSON.parse(node.attributes.value as string)

    return (
      <>
        <Turnstile
          ref={ref}
          siteKey={options.sitekey}
          options={{
            action: options.action,
            size: 'flexible',
            theme: options.theme,
            responseField: true,
            responseFieldName: options.response_field_name,
            appearance: 'interaction-only',
          }}
          className={cn('!block !h-[65px] !w-full !min-w-[300px]', {
            '!hidden': !isInteractive,
          })}
          onBeforeInteractive={() => {
            setInteractive(true)
            dispatchFormState({
              type: 'form_input_ready',
              input: 'captcha',
            })
          }}
          onExpire={() => {
            ref.current?.reset()
            dispatchFormState({
              type: 'form_input_loading',
              group: 'captcha',
            })
          }}
          onSuccess={(token) => {
            setValue(options.response_field_name, token)
            dispatchFormState({
              type: 'form_input_ready',
              input: 'captcha',
            })
          }}
          onError={(error) => {
            console.error('Cloudflare Turnstile Error:', error)
            setErrorMessage({
              id: 5000000,
              text: intl.formatMessage({
                id: 'captcha.error',
                defaultMessage:
                  'Security verification failed. Please try again later. If the problem persists, contact support.',
              }),
              type: 'error',
            })
          }}
        />
        {errorMessage && <Message.Content key={errorMessage.id} message={errorMessage} />}
      </>
    )
  }

  return null
}
```

## ory/packages/elements-react/src/theme/default/components/form/checkbox.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { getNodeLabel } from '@ory/client-fetch'
import { messageTestId, OryNodeCheckboxProps, uiTextToFormattedMessage } from '@ory/elements-react'
import { useIntl } from 'react-intl'
import { cn } from '../../utils/cn'
import { CheckboxLabel } from '../ui/checkbox-label'

function CheckboxSVG() {
  return (
    <svg
      className="absolute hidden size-4 fill-checkbox-foreground-checked peer-checked:block"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6464 5.14645C11.8417 4.95118 12.1583 4.95118 12.3536 5.14645C12.5338 5.32669 12.5477 5.6103 12.3951 5.80645L12.3536 5.85355L7.35355 10.8536C7.17331 11.0338 6.8897 11.0477 6.69355 10.8951L6.64645 10.8536L4.14645 8.35355C3.95118 8.15829 3.95118 7.84171 4.14645 7.64645C4.32669 7.4662 4.6103 7.45234 4.80645 7.60485L4.85355 7.64645L7 9.7925L11.6464 5.14645Z"
      />
    </svg>
  )
}

export const DefaultCheckbox = ({ node, inputProps }: OryNodeCheckboxProps) => {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const hasError = node.messages.some((m) => m.type === 'error')

  return (
    <label className="flex cursor-pointer items-start gap-3 self-stretch antialiased">
      <span className="flex h-5 items-center">
        <input
          {...inputProps}
          className={cn(
            'peer size-4 appearance-none rounded-forms border border-checkbox-border-checkbox-border-default bg-checkbox-background-default checked:border-checkbox-border-checkbox-border-checked checked:bg-checkbox-background-checked',
            hasError && 'border-interface-border-validation-danger',
          )}
          data-testid={`ory/form/node/input/${node.attributes.name}`}
        />
        <CheckboxSVG />
      </span>
      <span className="flex flex-col">
        <span className="leading-tight font-normal text-interface-foreground-default-primary">
          <CheckboxLabel label={label} />
        </span>
        {node.messages.map((message) => (
          <span
            key={message.id}
            className={cn(
              'mt-1',
              message.type === 'error'
                ? 'text-interface-foreground-validation-danger'
                : 'text-interface-foreground-default-secondary',
            )}
            {...messageTestId(message)}
          >
            {uiTextToFormattedMessage(message, intl)}
          </span>
        ))}
      </span>
    </label>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/form/consent-scope-checkbox.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeConsentScopeCheckboxProps } from '@ory/elements-react'
import * as Switch from '@radix-ui/react-switch'
import { defineMessages, useIntl } from 'react-intl'
import IconMessage from '../../assets/icons/message.svg'
import IconPersonal from '../../assets/icons/personal.svg'
import Phone from '../../assets/icons/phone.svg'
import { ListItem } from '../card/list-item'

const ScopeIcons: Record<string, typeof IconPersonal> = {
  openid: IconPersonal,
  offline_access: IconPersonal,
  profile: IconPersonal,
  email: IconMessage,
  phone: Phone,
}

const titles = defineMessages<string>({
  openid: {
    id: 'consent.scope.openid.title',
    defaultMessage: 'Identity',
  },
  offline_access: {
    id: 'consent.scope.offline_access.title',
    defaultMessage: 'Offline Access',
  },
  profile: {
    id: 'consent.scope.profile.title',
    defaultMessage: 'Profile Information',
  },
  email: {
    id: 'consent.scope.email.title',
    defaultMessage: 'Email Address',
  },
  address: {
    id: 'consent.scope.address.title',
    defaultMessage: 'Physical Address',
  },
  phone: {
    id: 'consent.scope.phone.title',
    defaultMessage: 'Phone Number',
  },
})

const descriptions = defineMessages<string>({
  openid: {
    id: 'consent.scope.openid.description',
    defaultMessage:
      'Allows the application to verify your identity. This is required for authentication and a trusted login experience.',
  },
  offline_access: {
    id: 'consent.scope.offline_access.description',
    defaultMessage:
      "Allows this application to keep you signed in even when you're not actively using it.",
  },
  profile: {
    id: 'consent.scope.profile.description',
    defaultMessage:
      'Allows access to your basic profile details, including your username, first name, and last name.',
  },
  email: {
    id: 'consent.scope.email.description',
    defaultMessage: 'Retrieve your email address and its verification status.',
  },
  address: {
    id: 'consent.scope.address.description',
    defaultMessage: 'Access your postal address.',
  },
  phone: {
    id: 'consent.scope.phone.description',
    defaultMessage: 'Retrieve your phone number and its verification status.',
  },
})

export function DefaultConsentScopeCheckbox({
  attributes,
  onCheckedChange,
  inputProps,
}: OryNodeConsentScopeCheckboxProps) {
  const intl = useIntl()
  const Icon = ScopeIcons[attributes.value as string] ?? IconPersonal

  const fallbackTitleMsg = {
    id: `consent.scope.${attributes.value}.title`,
    defaultMessage: attributes.value,
  }
  const fallbackDescriptionMsg = {
    id: `consent.scope.${attributes.value}.description`,
    defaultMessage: [],
  }
  return (
    <ListItem
      as="label"
      icon={Icon}
      title={intl.formatMessage(titles[attributes.value as string] ?? fallbackTitleMsg)}
      description={intl.formatMessage(
        descriptions[attributes.value as string] ?? fallbackDescriptionMsg,
      )}
      className="col-span-2"
      data-testid="ory/screen/consent/scope-checkbox-label"
    >
      <Switch.Root
        className="relative h-4 w-7 rounded-identifier border border-toggle-border-default bg-toggle-background-default p-[3px] transition-all data-[state=checked]:border-toggle-border-checked data-[state=checked]:bg-toggle-background-checked"
        data-testid={`ory/screen/consent/scope-checkbox`}
        {...inputProps}
        onCheckedChange={onCheckedChange}
        defaultChecked={true}
      >
        <Switch.Thumb className="block size-2 rounded-identifier bg-toggle-foreground-default transition-all data-[state=checked]:translate-x-3 data-[state=checked]:bg-toggle-foreground-checked" />
      </Switch.Root>
    </ListItem>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/form/group-container.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryFormGroupProps, useOryFlow } from '@ory/elements-react'
import { cn } from '../../utils/cn'
import { FlowType } from '@ory/client-fetch'
import { countRenderableChildren } from '../../../../util/childCounter'

export function DefaultGroupContainer({ children }: OryFormGroupProps) {
  const { flowType } = useOryFlow()

  const count = countRenderableChildren(children)
  if (count === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'grid',
        flowType === FlowType.OAuth2Consent ? 'grid-cols-2 gap-2' : 'grid-cols-1 gap-8',
      )}
    >
      {children}
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/form/horizontal-divider.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function DefaultHorizontalDivider() {
  return <hr className="border-interface-border-default-primary" />
}
```

## ory/packages/elements-react/src/theme/default/components/form/image.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeImageProps } from '@ory/elements-react'
import { omitInputAttributes } from '../../../../util/omitAttributes'

export function DefaultImage({ node }: OryNodeImageProps) {
  return (
    <figure>
      <img {...omitInputAttributes(node.attributes)} alt={node.meta.label?.text || ''} />
    </figure>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/form/index.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from 'react'
import { cn } from '../../utils/cn'
import { useIntl } from 'react-intl'
import {
  messageTestId,
  OryFormRootProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from '@ory/elements-react'
import { OryMessageContentProps } from '@ory/elements-react'
import { FlowType } from '@ory/client-fetch'

/**
 * The default form container for Ory Elements.
 *
 * @param props - The properties for the DefaultFormContainer component.
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultFormContainer({
  children,
  onSubmit,
  action,
  method,
}: PropsWithChildren<OryFormRootProps>) {
  return (
    <form onSubmit={onSubmit} noValidate action={action} method={method} className={'grid gap-8'}>
      {children}
    </form>
  )
}

/**
 * The default message container for Ory Elements.
 *
 * @param props - The properties for the DefaultMessageContainer component.
 * @returns
 * @group Components
 * @category Default Components
 */
export function DefaultMessageContainer({ children }: PropsWithChildren) {
  const { flowType } = useOryFlow()
  if (!children || (Array.isArray(children) && children.length === 0)) {
    return null
  }

  return (
    <section className={cn(flowType === FlowType.Settings ? 'text-center' : 'text-left')}>
      {children}
    </section>
  )
}

/**
 * The default message component for Ory Elements.
 *
 * @param props - The properties for the DefaultMessage component.
 * @returns
 * @group Components
 * @category Default Components
 * @see {@link @ory/elements-react!uiTextToFormattedMessage}
 */
export function DefaultMessage({ message }: OryMessageContentProps) {
  const intl = useIntl()
  return (
    <span
      className={cn(
        'leading-normal',
        message.type === 'error' && 'text-interface-foreground-validation-danger',
        message.type === 'info' && 'text-interface-foreground-default-secondary',
        message.type === 'success' && 'text-interface-foreground-validation-success',
      )}
      {...messageTestId(message)}
    >
      {uiTextToFormattedMessage(message, intl)}
    </span>
  )
}

export { DefaultButtonSocial } from './sso'
```

## ory/packages/elements-react/src/theme/default/components/form/input.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from '@ory/client-fetch'
import { OryNodeInputProps, useOryFlow } from '@ory/elements-react'
import * as PasswordToggleField from '@radix-ui/react-password-toggle-field'
import { ComponentProps, ComponentPropsWithRef, forwardRef } from 'react'
import EyeOff from '../../assets/icons/eye-off.svg'
import Eye from '../../assets/icons/eye.svg'
import { cn } from '../../utils/cn'

const defaultInputClassName = cn(
  'w-full rounded-forms border leading-tight antialiased transition-colors focus:ring-0 focus-visible:outline-none',
  'border-input-border-default bg-input-background-default text-input-foreground-primary',
  'focus-within:border-input-border-focus focus-visible:border-input-border-focus',
  'hover:bg-input-background-hover',
)

function isAutocompletePassword(
  autocomplete: string | undefined,
): autocomplete is 'new-password' | 'current-password' {
  return autocomplete === 'new-password' || autocomplete === 'current-password'
}

function PasswordInput({ className, ...rest }: ComponentProps<typeof PasswordToggleField.Input>) {
  return (
    <PasswordToggleField.Root>
      <div
        className={cn(
          defaultInputClassName,
          'flex justify-stretch not-focus-within:hover:border-input-border-hover',
          'data-[disabled=true]:border-input-border-disabled data-[disabled=true]:bg-input-background-disabled data-[disabled=true]:text-input-foreground-disabled',
        )}
        data-disabled={rest.disabled}
      >
        <PasswordToggleField.Input
          {...rest}
          className={cn(
            'w-full rounded-l-forms rounded-r-none bg-transparent px-4 py-[13px] text-input-foreground-primary placeholder:h-[20px] placeholder:text-input-foreground-tertiary focus:outline-none disabled:bg-input-background-disabled disabled:text-input-foreground-disabled',
            className,
          )}
        ></PasswordToggleField.Input>
        <PasswordToggleField.Toggle className="cursor-pointer bg-transparent px-2 py-[13px]">
          <PasswordToggleField.Icon visible={<EyeOff />} hidden={<Eye />} />
        </PasswordToggleField.Toggle>
      </div>
    </PasswordToggleField.Root>
  )
}

type InputProps = ComponentPropsWithRef<'input'>

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { flowType } = useOryFlow()
    return (
      <input
        {...props}
        className={cn(
          defaultInputClassName,
          'px-4 py-[13px] hover:border-input-border-hover',
          'placeholder:h-[20px] placeholder:text-input-foreground-tertiary disabled:border-input-border-disabled disabled:bg-input-background-disabled disabled:text-input-foreground-disabled',
          // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
          flowType === FlowType.Settings && 'max-w-[488px]',
          className,
        )}
        ref={ref}
      />
    )
  },
)

const DefaultInputRoot = ({ inputProps }: OryNodeInputProps) => {
  if (inputProps.type === 'password') {
    // Typescript doesn't narrow the type correctly here, so we need to do an explicit check
    const autoComplete = isAutocompletePassword(inputProps.autoComplete)
      ? inputProps.autoComplete
      : undefined

    return (
      <PasswordInput
        data-testid={`ory/form/node/input/${inputProps.name}`}
        {...inputProps}
        autoComplete={autoComplete}
      />
    )
  }

  if (inputProps.type === 'hidden') {
    return <input data-testid={`ory/form/node/input/${inputProps.name}`} {...inputProps} />
  }

  return <TextInput data-testid={`ory/form/node/input/${inputProps.name}`} {...inputProps} />
}

export const DefaultInput = Object.assign(DefaultInputRoot, {
  TextInput,
  PasswordInput,
})
```

## ory/packages/elements-react/src/theme/default/components/form/label.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, getNodeLabel, instanceOfUiText, UiNodeInputAttributes } from '@ory/client-fetch'
import {
  messageTestId,
  OryNodeLabelProps,
  useComponents,
  useOryConfiguration,
  useOryFlow,
  useResendCode,
} from '@ory/elements-react'
import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { resolveLabel } from '../../../../util/nodes'
import { initFlowUrl } from '../../utils/url'
import { kratosMessages } from '../../../../util/i18n/generated/kratosMessages'

export function DefaultLabel({ node, children, attributes, fieldError }: OryNodeLabelProps) {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const { Message } = useComponents()
  const { resendCode, resendCodeNode } = useResendCode()

  return (
    <div className="flex flex-col gap-1 antialiased">
      {label && (
        <span className="inline-flex justify-between">
          <label
            {...messageTestId(label)}
            className="leading-normal text-input-foreground-primary"
            htmlFor={attributes.name}
            data-testid={`ory/form/node/input/label/${attributes.name}`}
          >
            {resolveLabel(label, intl)}
          </label>
          <LabelAction attributes={attributes} />
          {resendCodeNode?.attributes.node_type === 'input' && (
            <button
              type="button"
              name={resendCodeNode.attributes.name}
              value={resendCodeNode.attributes.value}
              onClick={resendCode}
              className="cursor-pointer text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
            >
              {intl.formatMessage(kratosMessages[1070008])}
            </button>
          )}
        </span>
      )}
      {children}
      {node.messages.map((message) => (
        <Message.Content key={message.id} message={message} />
      ))}
      {fieldError && instanceOfUiText(fieldError) && <Message.Content message={fieldError} />}
    </div>
  )
}

type LabelActionProps = {
  attributes: UiNodeInputAttributes
}

function LabelAction({ attributes }: LabelActionProps) {
  const intl = useIntl()
  const { flowType, flow, formState } = useOryFlow()
  const config = useOryConfiguration()

  const action = useMemo(() => {
    if (flowType === FlowType.Login && config.project.recovery_enabled && !flow.refresh) {
      if (formState.current === 'provide_identifier') {
        if (attributes.name === 'identifier') {
          return {
            message: intl.formatMessage({
              id: 'forms.label.recover-account',
              defaultMessage: 'Recover Account',
            }),
            href: initFlowUrl(config.sdk.url, 'recovery', flow),
            testId: 'recover-account',
          }
        }
      } else if (attributes.type === 'password') {
        return {
          message: intl.formatMessage({
            id: 'forms.label.forgot-password',
            defaultMessage: 'Forgot Password?',
          }),
          href: initFlowUrl(config.sdk.url, 'recovery', flow),
          testId: 'forgot-password',
        }
      }
    }
  }, [attributes, config.project.recovery_enabled, flow, flowType, intl, config.sdk.url, formState])

  return action ? (
    <a
      href={action.href}
      className="text-button-link-brand-brand underline transition-colors hover:text-button-link-brand-brand-hover"
      data-testid={`ory/screen/login/action/${action.testId}`}
    >
      {action.message}
    </a>
  ) : null
}
```

## ory/packages/elements-react/src/theme/default/components/form/link-button.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from '@ory/client-fetch'
import { OryNodeAnchorProps, uiTextToFormattedMessage } from '@ory/elements-react'
import { forwardRef } from 'react'
import { useIntl } from 'react-intl'
import { cn } from '../../utils/cn'
import { omitInputAttributes } from '../../../../util/omitAttributes'

export const DefaultLinkButton = forwardRef<HTMLAnchorElement, OryNodeAnchorProps>(
  ({ attributes, node }, ref) => {
    const intl = useIntl()
    const label = getNodeLabel(node)
    return (
      <a
        {...omitInputAttributes(attributes)}
        ref={ref}
        title={label ? uiTextToFormattedMessage(label, intl) : ''}
        data-testid={`ory/form/node/link/${attributes.id}`}
        className={cn(
          'cursor-pointer gap-3 border bg-button-primary-background-default p-4 text-center leading-none font-medium text-button-primary-foreground-default antialiased transition-colors hover:bg-button-primary-background-hover hover:text-button-primary-foreground-hover',
        )}
      >
        {label ? uiTextToFormattedMessage(label, intl) : ''}
      </a>
    )
  },
)

DefaultLinkButton.displayName = 'DefaultLinkButton'
```

## ory/packages/elements-react/src/theme/default/components/form/pin-code-input.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { FlowType } from '@ory/client-fetch'
import { OryNodeInputProps, useOryFlow } from '@ory/elements-react'
import { cn } from '../../utils/cn'
import { InputOTP, InputOTPGroup, InputOTPSlot } from './shadcn/otp-input'

export const DefaultPinCodeInput = ({ node, inputProps }: OryNodeInputProps) => {
  const { flowType } = useOryFlow()

  const { value, maxLength, ...restInputProps } = inputProps
  const elements = maxLength ?? 6

  const valueCasted = value as string

  return (
    <InputOTP
      data-testid={`ory/form/node/input/${node.attributes.name}`}
      {...restInputProps}
      value={valueCasted}
      maxLength={elements}
    >
      <InputOTPGroup
        className={cn(
          'flex w-full justify-stretch gap-2',
          // The settings flow input fields are supposed to be dense, so we don't need the extra padding we want on the user flows.
          flowType === FlowType.Settings && 'max-w-[488px]',
        )}
      >
        {[...Array(elements)].map((_, index) => (
          <InputOTPSlot index={index} key={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/form/section.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryFormSectionProps,
} from '@ory/elements-react'
import { cn } from '../../utils/cn'

const DefaultFormSection = ({ children, nodes: _nodes, ...rest }: OryFormSectionProps) => {
  return (
    <form
      className="flex w-full max-w-(--breakpoint-sm) flex-col px-4 md:max-w-[712px] lg:max-w-[802px] xl:max-w-[896px]"
      {...rest}
    >
      {children}
    </form>
  )
}

const DefaultFormSectionContent = ({
  title,
  description,
  children,
}: OryFormSectionContentProps) => {
  return (
    <div className="flex flex-col gap-8 rounded-t-cards border border-b-0 border-interface-border-default-primary bg-interface-background-default-primary px-6 py-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-interface-foreground-default-primary">{title}</h3>
        <span className="text-interface-foreground-default-secondary">{description}</span>
      </div>
      {children}
    </div>
  )
}

const DefaultFormSectionFooter = ({ children, text }: OryFormSectionFooterProps) => {
  return (
    <div
      className={cn(
        'flex min-h-[72px] items-center justify-between gap-2 rounded-b-cards border border-interface-border-default-primary bg-interface-background-default-secondary px-6 py-4 text-interface-foreground-default-tertiary',
      )}
    >
      <span>{text}</span>
      {children}
    </div>
  )
}

export { DefaultFormSection, DefaultFormSectionContent, DefaultFormSectionFooter }
```

## ory/packages/elements-react/src/theme/default/components/form/select.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from '@ory/client-fetch'
import { OryNodeSelectProps, useOryFlow } from '@ory/elements-react'
import { ComponentPropsWithRef, forwardRef } from 'react'
import { useIntl } from 'react-intl'
import { resolveOptionLabel } from '../../../../util/nodes'
import { cn } from '../../utils/cn'

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-input-foreground-primary"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const defaultSelectClassName = cn(
  'w-full appearance-none rounded-forms border leading-tight antialiased transition-colors focus:ring-0 focus-visible:outline-none',
  'border-input-border-default bg-input-background-default text-input-foreground-primary',
  'focus-within:border-input-border-focus focus-visible:border-input-border-focus',
  'hover:border-input-border-hover hover:bg-input-background-hover',
  'px-4 py-[13px] pr-10',
  'disabled:border-input-border-disabled disabled:bg-input-background-disabled disabled:text-input-foreground-disabled',
)

type SelectElementProps = ComponentPropsWithRef<'select'>

const TextSelect = forwardRef<HTMLSelectElement, SelectElementProps>(
  ({ className, children, ...props }, ref) => {
    const { flowType } = useOryFlow()
    return (
      <div className="relative w-full">
        <select
          {...props}
          ref={ref}
          className={cn(
            defaultSelectClassName,
            flowType === FlowType.Settings && 'max-w-[488px]',
            className,
          )}
        >
          {children}
        </select>
        <ChevronDown />
      </div>
    )
  },
)
TextSelect.displayName = 'TextSelect'

function DefaultSelectRoot({ attributes, inputProps, options }: OryNodeSelectProps) {
  const intl = useIntl()

  // `value` on a native <select> must be a string. react-hook-form passes
  // through whatever the current form state holds, so coerce to a string and
  // avoid passing a React `undefined` controlled/uncontrolled mix.
  const value =
    inputProps.value === undefined || inputProps.value === null ? '' : String(inputProps.value)

  // For required fields the empty option is a placeholder only — disabling
  // and hiding it forces the user to pick a real value. For optional fields
  // we leave the empty option selectable so the user can clear their choice
  // again after picking one.
  const required = attributes.required ?? false

  return (
    <TextSelect
      data-testid={`ory/form/node/input/${inputProps.name}`}
      id={inputProps.id}
      name={inputProps.name}
      disabled={inputProps.disabled}
      onBlur={inputProps.onBlur}
      onChange={inputProps.onChange}
      ref={inputProps.ref}
      value={value}
      required={required}
    >
      <option value="" disabled={required} hidden={required}>
        {inputProps.placeholder}
      </option>
      {options.map((option, index) => {
        const optionValue = String(option.value)
        return (
          <option key={`${optionValue}-${index}`} value={optionValue}>
            {resolveOptionLabel(inputProps.name, option.value, intl)}
          </option>
        )
      })}
    </TextSelect>
  )
}

export const DefaultSelect = Object.assign(DefaultSelectRoot, {
  TextSelect,
})
```

## ory/packages/elements-react/src/theme/default/components/form/shadcn/otp-input.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { cn } from '../../../utils/cn'
import { OTPInput, OTPInputContext } from 'input-otp'
import * as React from 'react'

// This file is a copy from https://ui.shadcn.com/docs/components/input-otp

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn('flex items-center gap-2 has-disabled:opacity-50', containerClassName)}
    className={cn('disabled:cursor-not-allowed', className)}
    {...props}
  />
))
InputOTP.displayName = 'InputOTP'

const InputOTPGroup = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
))
InputOTPGroup.displayName = 'InputOTPGroup'

const InputOTPSlot = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        'w-full rounded-forms border border-solid bg-input-background-default py-[15px] text-center text-input-foreground-primary focus-visible:outline-hidden',
        'relative flex items-center justify-center leading-none transition-all',
        isActive ? 'border-input-border-focus' : 'border-input-border-default',
        className,
      )}
      {...props}
    >
      <span className="inline-block size-4">{char}</span>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-interface-background-brand-primary duration-700" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = 'InputOTPSlot'

export { InputOTP, InputOTPGroup, InputOTPSlot }
```

## ory/packages/elements-react/src/theme/default/components/form/spinner.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { cn } from '../../utils/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      role="status"
      className={cn('pointer-events-none absolute inset-0 m-auto size-8 animate-spin', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3C10.22 3 8.47991 3.52784 6.99987 4.51677C5.51983 5.50571 4.36628 6.91131 3.68509 8.55585C3.0039 10.2004 2.82567 12.01 3.17294 13.7558C3.5202 15.5016 4.37737 17.1053 5.63604 18.364C6.89472 19.6226 8.49836 20.4798 10.2442 20.8271C11.99 21.1743 13.7996 20.9961 15.4442 20.3149C17.0887 19.6337 18.4943 18.4802 19.4832 17.0001C20.4722 15.5201 21 13.78 21 12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/form/sso.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNodeGroupEnum } from '@ory/client-fetch'
import {
  OryFormSsoRootProps,
  OryNodeSsoButtonProps,
  uiTextToFormattedMessage,
  useOryFlow,
} from '@ory/elements-react'
import { ElementType } from 'react'
import { useIntl } from 'react-intl'
import defaultLogos from '../../provider-logos'
import { cn } from '../../utils/cn'
import { Spinner } from './spinner'
import { buttonStyles } from './button'

/**
 * Props for the DefaultButtonSocial component.
 *
 * @inline
 * @hidden
 */
interface DefaultSocialButtonProps extends OryNodeSsoButtonProps {
  /**
   * Logos to use for the social buttons.
   * If not provided, the default logos will be used.
   */
  logos?: Record<string, ElementType>
}

/**
 * The default implementation of a social button for Ory SSO.
 * It renders a button with a logo and an optional label.
 *
 * @param props - The props for the DefaultButtonSocial component.
 * @returns
 * @category Default Components
 * @group Components
 * @inlineType OryNodeSsoButtonProps
 */
export function DefaultButtonSocial({
  node,
  logos: providedLogos,
  isSubmitting,
  buttonProps,
  provider,
}: DefaultSocialButtonProps) {
  const logos = { ...defaultLogos, ...providedLogos }
  const intl = useIntl()
  const {
    flow: { ui },
    flowType,
  } = useOryFlow()

  const ssoNodes = ui.nodes.filter(
    (node) => node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml,
  )

  const ssoNodeCount = ssoNodes.length ?? 0

  const Logo = logos[(node.attributes.value as string).split('-')[0]]

  const showLabel =
    flowType === FlowType.Settings || (ssoNodeCount % 3 !== 0 && ssoNodeCount % 4 !== 0)

  const label = node.meta.label ? uiTextToFormattedMessage(node.meta.label, intl) : ''

  return (
    <button
      className={buttonStyles({
        intent: 'social',
        className: cn(showLabel ? 'p-4' : 'px-4 py-3.5'),
      })}
      data-testid={`ory/form/node/input/${node.attributes.name}`}
      data-loading={isSubmitting}
      aria-label={label}
      {...buttonProps}
    >
      <span
        className={cn(
          'relative group-disabled:opacity-20 group-loading:opacity-20',
          showLabel ? 'size-4' : 'size-5',
        )}
      >
        {Logo ? <Logo size={showLabel ? 16 : 20} /> : <GenericLogo label={provider.slice(0, 1)} />}
      </span>

      {isSubmitting && <Spinner className="size-6 stroke-button-social-foreground-default" />}
      {showLabel && node.meta.label ? (
        <>
          <span className="grow group-disabled:opacity-20 group-loading:opacity-20">{label}</span>
          <span className={cn('block', showLabel ? 'size-4' : 'size-5')}></span>
        </>
      ) : null}
    </button>
  )
}

/**
 * Returns a variant of DefaultButtonSocial that can use your own logos
 *
 * @param logos - a record of provider names and their respective logos
 * @returns a variant of DefaultButtonSocial that uses the provided logos
 */
DefaultButtonSocial.WithLogos =
  (logos: Record<string, ElementType>) => (props: DefaultSocialButtonProps) => (
    <DefaultButtonSocial {...props} logos={logos} />
  )

export function DefaultSocialButtonContainer({ children, nodes }: OryFormSsoRootProps) {
  return (
    <div
      className={cn('grid gap-3', {
        // needed because tailwind is not compiling dynamic classes
        'grid-cols-1': nodes.length % 4 <= 2,
        'grid-cols-3': nodes.length % 3 === 0,
        'grid-cols-4': nodes.length > 1 && nodes.length % 4 === 0,
      })}
    >
      {children}
    </div>
  )
}

const genericLogoStyles = cn(
  'flex size-full items-center justify-center rounded-buttons text-xs',
  'border-button-social-border-generic-provider bg-button-social-background-generic-provider text-button-social-foreground-generic-provider',
)

export function GenericLogo({ label }: { label: string }) {
  return <span className={genericLogoStyles}>{label}</span>
}
```

## ory/packages/elements-react/src/theme/default/components/form/text.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeTextProps, UiNodeInput, uiTextToFormattedMessage } from '@ory/elements-react'
import { useIntl } from 'react-intl'
import { DefaultLabel } from './label'
import { DefaultInput } from './input'
import { UiNodeInputAttributes } from '@ory/client-fetch'

export function DefaultText({ node }: OryNodeTextProps) {
  const intl = useIntl()

  if (node.attributes.id === 'totp_secret_key') {
    // This node represents the TOTP secret key and needs special handling

    return (
      <DefaultLabel
        // TODO(jonas): This is pretty ugly, the type is incorrect, because the label always expects input node, but we're rendering a text node here
        node={node as unknown as UiNodeInput}
        attributes={node.attributes as unknown as UiNodeInputAttributes}
      >
        <div className="relative flex max-w-[488px] justify-stretch">
          <DefaultInput.TextInput
            disabled
            name="totp_secret_key"
            type="text"
            value={node.attributes.text.text}
            data-testid={`ory/form/node/input/totp_secret_key`}
          />
        </div>
      </DefaultLabel>
    )
  }

  if (node.attributes.id === 'lookup_secret_codes') {
    // TODO (jonas): We might want to handle this more gracefully in the future
    // This node is rendered by the settings directly, so we don't need to render it here.
    // The problem is that it would cause an exception in the translation system, because
    // this node has an array of nodes in its context.
    throw new Error('node `lookup_secret_codes` cannot be rendered as text')
  }

  return (
    <p data-testid={`ory/form/node/text/${node.attributes.id}/label`} id={node.attributes.id}>
      {node.meta.label ? <label>{uiTextToFormattedMessage(node.meta.label, intl)}</label> : null}
      {node.attributes.text ? uiTextToFormattedMessage(node.attributes.text, intl) : ''}
    </p>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/generic/page-header.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OryPageHeaderProps,
  useComponents,
  useOryConfiguration,
  useOryFlow,
} from '@ory/elements-react'
import { UserMenu } from '../ui/user-menu'
import { useSession } from '@ory/elements-react/client'
import { useIntl } from 'react-intl'
import ArrowLeft from '../../assets/icons/arrow-left.svg'

export const DefaultPageHeader = (_props: OryPageHeaderProps) => {
  const { Card } = useComponents()
  const { session } = useSession()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const config = useOryConfiguration()

  const returnUrl = flow.return_to ?? config.project.default_redirect_url

  return (
    <div className="mt-4 flex w-full max-w-(--breakpoint-sm) flex-col gap-3 px-4 md:mt-16 md:max-w-[712px] lg:max-w-[802px] xl:max-w-[896px]">
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex max-h-10 flex-1 items-center justify-between gap-2">
          <div className="h-9">
            <Card.Logo />
          </div>
          <UserMenu session={session} />
        </div>

        {returnUrl && (
          <div>
            <a
              data-testid={'ory/screen/settings/back-button'}
              href={returnUrl}
              className="inline-flex items-center gap-2 text-button-link-default-primary hover:text-button-link-default-primary-hover"
            >
              <ArrowLeft />{' '}
              {intl.formatMessage({
                id: 'settings.navigation-back-button',
                defaultMessage: 'Back',
              })}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/generic/toast.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { messageTestId, OryToastProps, uiTextToFormattedMessage } from '@ory/elements-react'
import { toast as sonnerToast } from 'sonner'
import { cn } from '../../utils/cn'
import { useIntl } from 'react-intl'
import IconX from '../../assets/icons/x.svg'

export function DefaultToast({
  message,
  // Id can be used to close the toast later, but we don't use it here
  id,
}: OryToastProps) {
  const intl = useIntl()

  const title =
    message.type === 'error'
      ? intl.formatMessage({
          id: 'settings.messages.toast-title.error',
          defaultMessage: 'Could not update settings',
        })
      : intl.formatMessage({
          id: 'settings.messages.toast-title.success',
          defaultMessage: 'Settings updated',
        })
  const messageText = uiTextToFormattedMessage(message, intl)
  return (
    <div
      className="flex-col rounded-cards border border-interface-border-default-primary bg-interface-background-default-inverted px-4 py-2"
      {...messageTestId(message)}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn('font-medium', {
            'text-interface-foreground-validation-success': message.type === 'success',
            'text-interface-foreground-validation-danger': message.type === 'error',
            'text-interface-foreground-validation-warning':
              // Currently unused from Kratos, but kept for future use
              (message.type as 'warning') === 'warning',
          })}
        >
          {title}
        </p>
        <button
          data-testid={`ory/message/${message.id}.close`}
          className="cursor-pointer text-interface-foreground-default-inverted"
          onClick={() => sonnerToast.dismiss(id)}
        >
          <IconX size={16} />
        </button>
      </div>

      <p className="text-interface-foreground-default-inverted">{messageText}</p>
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export * from './card'
export * from './form'
export * from './default-components'
```

## ory/packages/elements-react/src/theme/default/components/settings/settings-oidc.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OrySettingsSsoProps, UiNodeInput, useComponents } from '@ory/elements-react'
import { useEffect } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { omitInputAttributes } from '../../../../util/omitAttributes'
import Trash from '../../assets/icons/trash.svg'
import logos from '../../provider-logos'
import { DefaultHorizontalDivider } from '../form/horizontal-divider'
import { Spinner } from '../form/spinner'
import { GenericLogo } from '../form/sso'

export function extractProvider(context: object | undefined): string | undefined {
  if (
    context &&
    typeof context === 'object' &&
    'provider' in context &&
    typeof context.provider === 'string'
  ) {
    return context.provider
  }
  return undefined
}

export function DefaultSettingsOidc({
  linkButtons,
  unlinkButtons,
  isSubmitting,
}: OrySettingsSsoProps) {
  const hasLinkButtons = linkButtons.length > 0
  const hasUnlinkButtons = unlinkButtons.length > 0
  const { Node } = useComponents()

  return (
    <div className="flex flex-col gap-8">
      {hasLinkButtons && (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 md:grid-cols-3">
          {linkButtons.map((button) => {
            return (
              <Node.SsoButton
                key={button.attributes.value}
                node={button}
                buttonProps={button.buttonProps}
                attributes={button.attributes}
                isSubmitting={isSubmitting}
                provider={(button.attributes.value + '').split('-')[0]}
              />
            )
          })}
        </div>
      )}
      {hasUnlinkButtons && hasLinkButtons ? <DefaultHorizontalDivider /> : null}
      {unlinkButtons.map((button) => {
        if (button.attributes.node_type !== 'input') {
          return null
        }
        return (
          <UnlinkRow key={button.attributes.value} button={button} isSubmitting={isSubmitting} />
        )
      })}
    </div>
  )
}

type UnlinkRowProps = {
  button: UiNodeInput & { onClick: () => void }
  isSubmitting: boolean
}

function UnlinkRow({ button, isSubmitting }: UnlinkRowProps) {
  // Safari cancels form submission events, if we do a state update in the same tick
  // so we delay the state update by 100ms
  const [clicked, setClicked] = useDebounceValue(false, 100)
  const provider = extractProvider(button.meta.label?.context) ?? ''
  const Logo = logos[(button.attributes.value as string).split('-')[0]]

  const localOnClick = () => {
    button.onClick()
    setClicked(true)
  }

  useEffect(() => {
    if (!isSubmitting) {
      setClicked(false)
    }
  }, [isSubmitting, setClicked])

  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-6">
        {Logo ? <Logo size={32} /> : <GenericLogo label={provider.slice(0, 1)} />}
        <p className="text-sm font-medium text-interface-foreground-default-secondary">
          {provider}
        </p>
      </div>
      <button
        {...omitInputAttributes(button.attributes)}
        type="submit"
        onClick={localOnClick}
        disabled={isSubmitting}
        className="relative"
        title={`Unlink ${provider}`}
      >
        {clicked ? (
          <Spinner className="relative" />
        ) : (
          <Trash
            className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
            size={24}
          />
        )}
      </button>
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/settings/settings-passkey.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { OrySettingsPasskeyProps, useComponents } from '@ory/elements-react'
import Passkey from '../../assets/icons/passkey.svg'
import Trash from '../../assets/icons/trash.svg'
import { DefaultHorizontalDivider } from '../form/horizontal-divider'
import { Spinner } from '../form/spinner'

export function DefaultSettingsPasskey({
  triggerButton,
  removeButtons,
  isSubmitting,
}: OrySettingsPasskeyProps) {
  const { Node } = useComponents()

  const hasRemoveButtons = removeButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-[60%] items-end gap-3">
        {triggerButton && (
          <Node.Button
            node={triggerButton}
            attributes={triggerButton.attributes}
            buttonProps={triggerButton.buttonProps}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
      {hasRemoveButtons ? (
        <div className="flex flex-col gap-8">
          <DefaultHorizontalDivider />
          <div className="flex flex-col gap-2">
            {removeButtons.map((node, i) => {
              const context = node.meta.label?.context ?? {}
              const addedAt = 'added_at' in context ? (context.added_at as string) : null
              const displayName =
                'display_name' in context ? (context.display_name as string) : null
              const keyId = 'value' in node.attributes ? node.attributes.value : null

              return (
                <div
                  className="flex justify-between gap-6 md:items-center"
                  key={`passkey-remove-button-${i}`}
                >
                  <div className="flex flex-1 items-center gap-2 truncate">
                    <Passkey size={32} className="text-interface-foreground-default-primary" />
                    <div className="flex flex-1 flex-col gap-4 truncate md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 flex-col truncate">
                        <p className="truncate text-sm font-medium text-interface-foreground-default-secondary">
                          {displayName}
                        </p>
                        <span className="hidden truncate text-sm text-interface-foreground-default-tertiary sm:block">
                          {keyId}
                        </span>
                      </div>
                      {addedAt && (
                        <p className="text-sm text-interface-foreground-default-tertiary">
                          {new Intl.DateTimeFormat(undefined, {
                            dateStyle: 'long',
                          }).format(new Date(addedAt))}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    {...node.attributes}
                    type="submit"
                    onClick={node.buttonProps.onClick}
                    disabled={isSubmitting}
                    className="relative"
                  >
                    {isSubmitting ? (
                      <Spinner className="relative" />
                    ) : (
                      <Trash
                        className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
                        size={24}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/settings/settings-recovery-codes.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OrySettingsRecoveryCodesProps } from '@ory/elements-react'
import { omitInputAttributes } from '../../../../util/omitAttributes'
import Download from '../../assets/icons/download.svg'
import Eye from '../../assets/icons/eye.svg'
import Refresh from '../../assets/icons/refresh.svg'
import { DefaultHorizontalDivider } from '../form/horizontal-divider'

export function DefaultSettingsRecoveryCodes({
  codes,
  regenerateButton,
  revealButton,
  onRegenerate,
  onReveal,
  isSubmitting,
}: OrySettingsRecoveryCodesProps) {
  const onDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([codes.join('\n')], {
      type: 'text/plain',
    })
    element.href = URL.createObjectURL(file)
    element.download = 'recovery-codes.txt'
    document.body.appendChild(element)
    element.click()
  }

  const hasCodes = codes.length >= 1

  return (
    <div className="flex flex-col gap-8">
      {codes.length > 0 && <DefaultHorizontalDivider />}
      <div className="flex justify-between gap-4">
        <span className="text-interface-foreground-default-tertiary">
          {revealButton && 'Reveal recovery codes'}
        </span>
        <div className="flex gap-2">
          {regenerateButton && codes.length > 0 && (
            <button
              {...omitInputAttributes(regenerateButton.attributes)}
              type="submit"
              className="ml-auto"
              onClick={onRegenerate}
              disabled={isSubmitting}
              data-loading={isSubmitting}
            >
              <Refresh
                size={24}
                className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
              />
            </button>
          )}
          {revealButton && (
            <>
              <button
                {...revealButton.attributes}
                type="submit"
                className="ml-auto"
                onClick={onReveal}
                title="Reveal recovery codes"
              >
                <Eye
                  size={24}
                  className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
                />
              </button>
            </>
          )}
          {hasCodes && (
            <button
              onClick={onDownload}
              type="button"
              className="ml-auto"
              data-testid="ory/screen/settings/group/recovery_code/download"
              title="Download recovery codes"
            >
              <Download
                size={24}
                className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
              />
            </button>
          )}
        </div>
      </div>
      {hasCodes ? (
        <div className="rounded-general border-interface-border-default-primary bg-interface-background-default-secondary p-6">
          <div
            className="grid grid-cols-2 flex-wrap gap-4 text-sm text-interface-foreground-default-primary sm:grid-cols-3 md:grid-cols-5"
            data-testid="ory/screen/settings/group/recovery_code/codes"
          >
            {codes.map((code) => (
              <p key={code}>{code}</p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/settings/settings-totp.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from '@ory/client-fetch'
import { Node, OrySettingsTotpProps, useComponents } from '@ory/elements-react'
import { UiNodeImage, UiNodeInput, UiNodeText } from '../../../../util/utilFixSDKTypesHelper'
import QrCode from '../../assets/icons/qrcode.svg'
import Trash from '../../assets/icons/trash.svg'
import { DefaultHorizontalDivider } from '../form/horizontal-divider'
import { Spinner } from '../form/spinner'

export function DefaultSettingsTotp({
  totpImage,
  totpInput,
  totpSecret,
  totpUnlink,
  onUnlink,
  isSubmitting,
}: OrySettingsTotpProps) {
  if (totpUnlink) {
    return (
      <SettingsTotpUnlink
        totpUnlinkAttributes={totpUnlink.attributes}
        onUnlink={onUnlink}
        isSubmitting={isSubmitting}
      />
    )
  }

  if (totpImage && totpSecret && totpInput) {
    return <SettingsTotpLink totpImage={totpImage} totpSecret={totpSecret} totpInput={totpInput} />
  }
}

type SettingsTotpUnlinkProps = {
  totpUnlinkAttributes: UiNodeInputAttributes
  onUnlink: () => void
  isSubmitting: boolean
}

function SettingsTotpUnlink({
  totpUnlinkAttributes,
  onUnlink,
  isSubmitting,
}: SettingsTotpUnlinkProps) {
  const { Card } = useComponents()
  const {
    type,
    autocomplete: _ignoredAutocomplete,
    label: _ignoredLabel,
    node_type: _ignoredNodeType,
    ...buttonAttrs
  } = totpUnlinkAttributes

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="col-span-full">
        <Card.Divider />
      </div>
      <div className="col-span-full flex items-center gap-6">
        <div className="aspect-square size-8">
          <QrCode size={32} />
        </div>
        <div className="mr-auto flex flex-col">
          <p className="text-sm font-medium text-interface-foreground-default-primary">
            Authenticator app
          </p>
        </div>
        <button
          type={type === 'button' ? 'button' : 'submit'}
          {...buttonAttrs}
          onClick={onUnlink}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner className="relative" />
          ) : (
            <Trash
              className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
              size={24}
            />
          )}
        </button>
      </div>
    </div>
  )
}

type SettingsTotpLinkProps = {
  totpImage: UiNodeImage
  totpSecret: UiNodeText
  totpInput: UiNodeInput
}

function SettingsTotpLink({ totpImage, totpSecret, totpInput }: SettingsTotpLinkProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="col-span-full">
        <DefaultHorizontalDivider />
      </div>
      <div className="flex justify-center rounded-cards bg-interface-background-default-secondary p-8">
        <div className="aspect-square h-44 bg-[white]">
          <div className="-m-3 antialiased mix-blend-multiply">
            <Node node={totpImage} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Node node={totpSecret} />
        <Node node={totpInput} />
      </div>
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/settings/settings-webauthn.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Node, OrySettingsWebauthnProps, useComponents } from '@ory/elements-react'
import { omitInputAttributes } from '../../../../util/omitAttributes'
import Key from '../../assets/icons/key.svg'
import Trash from '../../assets/icons/trash.svg'
import { Spinner } from '../form/spinner'

export function DefaultSettingsWebauthn({
  nameInput,
  triggerButton,
  removeButtons,
  isSubmitting,
}: OrySettingsWebauthnProps) {
  const { Card } = useComponents()
  const hasRemoveButtons = removeButtons.length > 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end md:max-w-96">
        <div className="flex-1">
          <Node.Input node={nameInput} />
        </div>
        {triggerButton ? <Node.Button node={triggerButton} /> : null}
      </div>
      {hasRemoveButtons ? (
        <div className="flex flex-col gap-8">
          <Card.Divider />
          <div className="flex flex-col gap-4">
            {removeButtons.map((node, i) => {
              const context = node.meta.label?.context ?? {}
              const addedAt = 'added_at' in context ? (context.added_at as string) : null
              const displayName =
                'display_name' in context ? (context.display_name as string) : null
              const keyId = 'value' in node.attributes ? node.attributes.value : null

              return (
                <div
                  className="flex justify-between gap-6 md:items-center"
                  key={`webauthn-remove-button-${i}`}
                >
                  <div className="flex flex-1 items-center gap-2 truncate">
                    <Key size={32} className="text-interface-foreground-default-primary" />
                    <div className="flex flex-1 flex-col gap-4 truncate md:flex-row md:items-center md:justify-between">
                      <div className="flex-1 flex-col truncate">
                        <p className="truncate text-sm font-medium text-interface-foreground-default-secondary">
                          {displayName}
                        </p>
                        <span className="hidden truncate text-sm text-interface-foreground-default-tertiary sm:block">
                          {keyId}
                        </span>
                      </div>
                      {addedAt && (
                        <p className="text-sm text-interface-foreground-default-tertiary">
                          {new Intl.DateTimeFormat(undefined, {
                            dateStyle: 'long',
                          }).format(new Date(addedAt))}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    {...omitInputAttributes(node.attributes)}
                    type="submit"
                    onClick={node.buttonProps.onClick}
                    disabled={isSubmitting}
                    className="relative cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Spinner className="relative" />
                    ) : (
                      <Trash
                        className="text-button-link-default-secondary hover:text-button-link-default-secondary-hover"
                        size={24}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
```

## ory/packages/elements-react/src/theme/default/components/ui/checkbox-label.spec.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { render } from '@testing-library/react'
import { CheckboxLabel } from './checkbox-label'
import { IntlProvider } from 'react-intl'
import { PropsWithChildren } from 'react'

const wrapper = ({ children }: PropsWithChildren) => (
  <IntlProvider locale="en">{children}</IntlProvider>
)

describe('computeLabelElements', () => {
  test('renders plain text without links correctly', () => {
    const labelText = 'This is just plain text'

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: 'info' }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test('renders a text with a single markdown link correctly', () => {
    const labelText = 'This is a [link](https://example.com)'

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: 'info' }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test('renders a text with multiple markdown links correctly', () => {
    const labelText =
      'This [first link](https://first.com) and this [second link](https://second.com)'

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: 'info' }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test('renders a text with link and extra text around it correctly', () => {
    const labelText = 'Click [here](https://example.com) to visit, or go elsewhere.'

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: 'info' }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test('handles a label with no text but a link', () => {
    const labelText = '[Click here](https://example.com)'

    const { container } = render(
      <CheckboxLabel label={{ text: labelText, id: 0, type: 'info' }} />,
      { wrapper },
    )
    expect(container).toMatchSnapshot()
  })

  test('renders null if label is undefined', () => {
    const { container } = render(<CheckboxLabel label={undefined} />, {
      wrapper,
    })
    expect(container).toMatchSnapshot()
  })
})
```

## ory/packages/elements-react/src/theme/default/components/ui/checkbox-label.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from '@ory/client-fetch'
import { useIntl } from 'react-intl'
import { resolveLabel } from '../../../../util/nodes'

type CheckboxLabelProps = {
  label?: UiText
}

const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g

export function computeLabelElements(labelText: string) {
  const elements = []
  let lastIndex = 0

  // Use matchAll to find all markdown links
  for (const match of labelText.matchAll(linkRegex)) {
    const linkText = match[1]
    const url = match[2]
    const matchStart = match.index
    if (typeof matchStart === 'undefined') {
      // Some types seem to be wrong somewhere, eslint complains that matchStart can be undefined, but it can't?
      // So we just skip this match, if it is undefined
      continue
    }

    // Push the text before the match
    if (matchStart > lastIndex) {
      elements.push(labelText.slice(lastIndex, matchStart))
    }

    // Push the <a> tag for the markdown link
    elements.push(
      <a
        key={matchStart}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-button-link-brand-brand underline hover:text-button-link-brand-brand-hover"
      >
        {linkText}
      </a>,
    )

    // Update lastIndex to the end of the current match
    lastIndex = matchStart + match[0].length
  }

  // Push any remaining text after the last match
  if (lastIndex < labelText.length) {
    elements.push(labelText.slice(lastIndex))
  }
  return elements
}

export function CheckboxLabel({ label }: CheckboxLabelProps) {
  const intl = useIntl()
  if (!label) {
    return null
  }

  const labelText = resolveLabel(label, intl)

  return <>{computeLabelElements(labelText)}</>
}
```

## ory/packages/elements-react/src/theme/default/components/ui/dropdown-menu.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '../../utils/cn'

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 16, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    {/*
     * The `ory-elements` class re-establishes the scope that `postcss-scope`
     * applies to all utility classes. Without it, the portaled content lives
     * outside any `.ory-elements` ancestor and none of the Tailwind utilities
     * match. The inner `contents` wrapper is required because the scoped
     * `.ory-elements .contents` selector only matches descendants, and it
     * keeps the wrapped content out of the layout tree so Radix's popper
     * positioning is unaffected.
     */}
    <div className="ory-elements">
      <div className="contents">
        <DropdownMenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          align="end"
          className={cn(
            'z-50 min-w-76 origin-top-right animate-drop-down-in overflow-hidden will-change-[opacity,transform] data-[state=closed]:animate-drop-down-out',
            'rounded-cards border border-interface-border-default-primary bg-interface-background-default-primary',
            className,
          )}
          {...props}
        />
      </div>
    </div>
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer items-center outline-hidden transition-colors select-none data-disabled:pointer-events-none',
      'gap-6 px-8 py-3 text-sm lg:py-4.5',
      'border-t border-button-secondary-border-default first:border-0 hover:border-button-social-border-hover',
      'bg-button-secondary-background-default text-button-secondary-foreground-default',
      'hover:bg-button-secondary-background-hover hover:text-button-secondary-foreground-hover',
      'data-[disabled]:bg-button-secondary-background-disabled data-[disabled]:text-button-secondary-foreground-disabled',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuLabel = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
}
```

## ory/packages/elements-react/src/theme/default/components/ui/user-avater.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { UserInitials } from '../../utils/user'
import IconUser from '../../assets/icons/user.svg'

type UserAvatarProps = {
  initials: UserInitials
} & ComponentPropsWithoutRef<'button'>

export const UserAvatar = forwardRef<HTMLButtonElement, UserAvatarProps>(
  ({ initials, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className="relative flex size-10 items-center justify-center overflow-hidden rounded-[999px] bg-button-primary-background-default hover:bg-button-primary-background-hover"
        {...rest}
      >
        <div className="relative flex size-full items-center justify-center">
          {initials.avatar ? (
            <img src={initials.avatar} alt={initials.primary} className="w-full object-contain" />
          ) : (
            <IconUser size={24} className="text-button-primary-foreground-default" />
          )}
        </div>
      </button>
    )
  },
)
UserAvatar.displayName = 'UserAvatar'
```

## ory/packages/elements-react/src/theme/default/components/ui/user-menu.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow, Session } from '@ory/client-fetch'
import { useOryConfiguration } from '@ory/elements-react'
import IconLogout from '../../assets/icons/logout.svg'
import IconSettings from '../../assets/icons/settings.svg'
import { useClientLogout } from '../../utils/logout'
import { getUserInitials } from '../../utils/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { UserAvatar } from './user-avater'

type UserMenuProps = {
  session: Session | null
  logoutFlow?: LogoutFlow
}

export const UserMenu = ({ session }: UserMenuProps) => {
  const config = useOryConfiguration()
  const initials = getUserInitials(session)
  const { logoutFlow } = useClientLogout(config)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar initials={initials} title="User Menu" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex gap-3 px-5 py-4.5">
          <UserAvatar disabled initials={initials} />
          <div className="flex flex-col justify-center text-sm leading-tight">
            <div className="leading-tight font-medium text-interface-foreground-default-primary">
              {initials.primary}
            </div>
            {initials.secondary && (
              <div className="leading-tight text-interface-foreground-default-tertiary">
                {initials.secondary}
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <a href={config.project.settings_ui_url}>
            <IconSettings size={16} /> User settings
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild disabled={!logoutFlow?.logout_url}>
          <a href={logoutFlow?.logout_url}>
            <IconLogout size={16} /> Logout
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## ory/packages/elements-react/src/theme/default/flows/consent.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, OAuth2ConsentRequest, Session } from '@ory/client-fetch'
import {
  OryClientConfiguration,
  OryConsentCard,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryProvider,
  OrySuccessHandler,
} from '@ory/elements-react'
import { getOryComponents } from '../components'
import { translateConsentChallengeToUiNodes } from '../utils/oauth2'

/**
 * All the props that are passed to the Consent component.
 *
 * @hidden
 * @inline
 */
export type ConsentFlowProps = {
  /**
   * The OAuth2 consent request object.
   */
  consentChallenge: OAuth2ConsentRequest
  /**
   * The session object.
   *
   * Since the consent flow is used in the context of a logged-in user, the session object is required.
   * It contains information about the user, such as their ID and any associated metadata.
   * This information is used to accept or reject the consent request based on the user's preferences.
   * The session object is typically obtained from the Ory Kratos session API.
   */
  session: Session
  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL
   */
  config: OryClientConfiguration
  /**
   * The CSRF token to protect against CSRF attacks.
   *
   * This token is used to prevent cross-site request forgery attacks by ensuring that the request
   * is coming from the same origin as the consent flow.
   */
  csrfToken: string
  /**
   * The URL to submit the consent form to.
   *
   * This URL is typically an endpoint on the server that handles the consent request.
   *
   * Make sure that this endpoint handles CSRF protection. During the form submission
   * the Consent component will send along the CSRF token passed in the props.
   * The server should validate this token before processing the consent request.
   */
  formActionUrl: string
  /**
   * The components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the consent flow.
   */
  components?: OryFlowComponentOverrides

  /**
   * Optional children to render inside the Consent component.
   *
   * If not provided, the default OryConsentCard will be rendered.
   */
  children?: React.ReactNode

  /**
   * Optional callback invoked on successful consent submission.
   *
   * @see {@link OrySuccessHandler}
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked on consent errors.
   *
   * @see {@link OryErrorHandler}
   */
  onError?: OryErrorHandler
}
/**
 * The Consent component allows you to render the consent flow for Ory OAuth2.
 *
 * It is used to request user consent for accessing their data and resources.
 * The component takes in the OAuth2 consent request object, the session object,
 * the Ory client configuration, a CSRF token, and the URL to submit the consent form to.
 *
 * @param props - The props for the Consent component.
 * @returns the Consent component.
 * @group Components
 * @category Flows
 */
export function Consent({
  consentChallenge,
  session,
  config,
  components: Passed,
  children,
  csrfToken,
  formActionUrl,
  onSuccess,
  onError,
}: ConsentFlowProps) {
  const components = getOryComponents(Passed)

  const flow = translateConsentChallengeToUiNodes(
    consentChallenge,
    csrfToken,
    formActionUrl,
    session,
  )

  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.OAuth2Consent}
      components={components}
      onSuccess={onSuccess}
      onError={onError}
    >
      {children ?? <OryConsentCard />}
    </OryProvider>
  )
}
```

## ory/packages/elements-react/src/theme/default/flows/error.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import {
  FlowError,
  GenericError,
  instanceOfFlowError,
  instanceOfGenericError,
  Session,
} from '@ory/client-fetch'
import {
  OryClientConfiguration,
  OryConfigurationProvider,
  OryFlowComponentOverrides,
  useOryConfiguration,
} from '@ory/elements-react'
import { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { IntlProvider } from '../../../context/intl-context'
import { DefaultCard } from '../components'
import { DefaultHorizontalDivider } from '../components/form/horizontal-divider'
import { useClientLogout } from '../utils/logout'

/**
 * A union type of all possible errors that can be returned by the Ory SDK.
 * @hidden
 * @inline
 */
export type OryError = {
  correlationId?: string
} & (FlowError | OAuth2Error | { error: GenericError })

/**
 * An OAuth2 error response.
 * @hidden
 * @inline
 */
export type OAuth2Error = {
  error: string
  error_description: string
}

function isOAuth2Error(error: unknown): error is OAuth2Error {
  return !!error && typeof error === 'object' && 'error' in error && 'error_description' in error
}

/**
 * Props for the Error component.
 *
 * @inline
 * @hidden
 */
export type ErrorFlowContextProps = {
  /**
   * The error object returned by the Ory SDK.
   * This can be a FlowError, OAuth2Error, or a GenericError.
   */
  error: OryError
  /**
   * The components to override the default ones.
   * This allows you to customize the appearance and behavior of the error flow.
   */
  components?: OryFlowComponentOverrides
  /**
   * The Ory client configuration object.
   * This object contains the configuration for the Ory client, such as the base URL and project information.
   */
  config: OryClientConfiguration
  /**
   * The session object, if available.
   * This is used to determine if the user is logged in and to provide appropriate actions.
   */
  session?: Session
}

const errorDescriptions: Record<number, string> = {
  4: 'The server could not handle your request, because it was malformed',
  5: 'The server encountered an error and could not complete your request',
}

type InternalStandardizedError = {
  code: number
  message?: string
  status?: string
  reason?: string
  id?: string
  timestamp?: Date
}

function useStandardize(error: OryError): InternalStandardizedError {
  // Memoize the error to keep the timestamp consistent
  return useMemo(() => {
    if (isOAuth2Error(error)) {
      return {
        code: 400,
        message: error.error_description,
        status: error.error,
        timestamp: new Date(),
      }
    }
    if (instanceOfFlowError(error)) {
      const parsed = error.error as InternalStandardizedError
      return {
        ...parsed,
        id: error.id,
        timestamp: error.created_at,
      }
    } else if (error.error && instanceOfGenericError(error.error)) {
      return {
        code: error.error.code ?? 500,
        message: error.error.message,
        status: error.error.status,
        reason: error.error.reason,
        timestamp: new Date(),
      }
    }
    return {
      code: 500,
      message: 'An error occurred',
      status: 'error',
    }
  }, [error])
}

/**
 * The Error component is used to display an error message to the user.
 *
 * @param props - The props for the Error component.
 * @returns
 * @group Components
 * @category Flows
 */
export function Error({ error, components: Components, config, session }: ErrorFlowContextProps) {
  const Card = Components?.Card?.Root ?? DefaultCard
  const Divider = Components?.Card?.Divider ?? DefaultHorizontalDivider
  const parsed = useStandardize(error)

  const description = errorDescriptions[Math.floor(parsed.code / 100)]

  return (
    <OryConfigurationProvider sdk={config.sdk} project={config.project}>
      <IntlProvider
        locale={config.intl?.locale ?? 'en'}
        customTranslations={config.intl?.customTranslations}
      >
        <Card>
          <div className="flex flex-col gap-6 antialiased" data-testid={'ory/screen/error'}>
            <header className="flex flex-col gap-8 antialiased">
              <div className="max-h-9 self-start">
                <ErrorLogo />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-lg leading-normal font-semibold text-interface-foreground-default-primary">
                  <FormattedMessage
                    id="error.title.what-happened"
                    defaultMessage="What happened?"
                  />
                </h2>
                <p className="leading-normal text-interface-foreground-default-secondary">
                  {parsed.message ?? description}
                </p>
                {parsed.reason && (
                  <p className="leading-normal text-interface-foreground-default-secondary">
                    {parsed.reason}
                  </p>
                )}
              </div>
            </header>
            <Divider />

            <div className="flex flex-col gap-2">
              <h2 className="text-lg leading-normal font-semibold text-interface-foreground-default-primary">
                <FormattedMessage id="error.title.what-can-i-do" defaultMessage="What can I do?" />
              </h2>
              <p className="leading-normal text-interface-foreground-default-secondary">
                <FormattedMessage
                  id="error.instructions"
                  defaultMessage="Please try again in a few minutes or contact the website operator."
                />
              </p>
              <div>{session ? <LoggedInActions /> : <GoBackButton />}</div>
            </div>

            <Divider />
            <div className="flex flex-col gap-2 leading-normal font-normal antialiased">
              <span className="text-sm text-interface-foreground-default-primary">
                <FormattedMessage
                  id="error.footer.text"
                  defaultMessage="When reporting this error, please include the following information:"
                />
              </span>

              {parsed.id && (
                <p className="text-sm text-interface-foreground-default-secondary">
                  ID: <code>{parsed.id}</code>
                </p>
              )}
              <p className="text-sm text-interface-foreground-default-secondary">
                Time: <code>{parsed.timestamp?.toUTCString()}</code>
              </p>
              {error.correlationId && (
                <p className="text-sm text-interface-foreground-default-secondary">
                  Correlation ID: <code>{error.correlationId}</code>
                </p>
              )}
              {parsed.reason && (
                <p className="text-sm text-interface-foreground-default-secondary">
                  Message: <code data-testid={'ory/screen/error/message'}>{parsed.reason}</code>
                </p>
              )}

              <div>
                <button
                  className="cursor-pointer text-interface-foreground-default-primary underline"
                  onClick={() => {
                    const text = `${parsed.id ? `ID: ${parsed.id}` : ''}
Time: ${parsed.timestamp?.toUTCString()}
${parsed.reason ? `Message: ${parsed.reason}` : ''}
${error.correlationId ? `Correlation ID: ${error.correlationId}` : ''}
`
                    void navigator.clipboard.writeText(text)
                  }}
                >
                  <FormattedMessage id="error.footer.copy" defaultMessage="Copy" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </IntlProvider>
    </OryConfigurationProvider>
  )
}

function LoggedInActions() {
  const config = useOryConfiguration()
  const { logoutFlow } = useClientLogout(config)

  return (
    <a
      href={logoutFlow?.logout_url}
      className="text-interface-foreground-default-primary underline"
    >
      <FormattedMessage id="login.logout-button" defaultMessage="Logout" />
    </a>
  )
}

function GoBackButton() {
  const config = useOryConfiguration()
  if ('default_redirect_url' in config.project) {
    return (
      <a
        className="text-interface-foreground-default-primary underline"
        href={config.project.default_redirect_url}
      >
        <FormattedMessage id="error.action.go-back" defaultMessage="Go back" />
      </a>
    )
  }

  return null
}

function ErrorLogo() {
  const { project } = useOryConfiguration()
  if (project.logo_light_url) {
    return <img src={project.logo_light_url} className="h-full" alt="Logo" />
  }

  return (
    <h1 className="text-xl leading-normal font-semibold text-interface-foreground-default-primary">
      {project.name}
    </h1>
  )
}
```

## ory/packages/elements-react/src/theme/default/flows/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export * from './error'
export * from './login'
export * from './recovery'
export * from './registration'
export * from './settings'
export * from './verification'
export * from './consent'
```

## ory/packages/elements-react/src/theme/default/flows/login.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { FlowType, LoginFlow } from '@ory/client-fetch'
import {
  OryClientConfiguration,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
  OrySuccessHandler,
  OryTransientPayload,
  OryValidationErrorHandler,
} from '@ory/elements-react'
import { getOryComponents } from '../components'

/**
 * Props for the Login component.
 *
 * @inline
 * @hidden
 */
export type LoginFlowContextProps = {
  /**
   * The login flow object containing the state and data for the login process.
   */
  flow: LoginFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the login flow.
   */
  components?: OryFlowComponentOverrides
  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL and other settings.
   */
  config: OryClientConfiguration

  /**
   * Optional children to render
   *
   * If not provided, the default OrySelfServiceFlowCard will be rendered.
   */
  children?: React.ReactNode

  /**
   * Optional callback invoked on successful flow completion.
   *
   * @see {@link OrySuccessHandler}
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * @see {@link OryValidationErrorHandler}
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on flow-level errors.
   *
   * @see {@link OryErrorHandler}
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload.
   *
   * @see {@link OryTransientPayload}
   */
  transientPayload?: OryTransientPayload
}

/**
 * The `Login` component is used to render the login flow in Ory Elements.
 *
 * It provides the necessary context and components for the login flow, allowing you to customize the appearance and behavior of the login form.
 *
 * @param props - The props for the Login component.
 * @group Components
 * @category Flows
 */
export function Login({
  flow,
  config,
  children,
  components: flowOverrideComponents,
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
}: LoginFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Login}
      components={components}
      onSuccess={onSuccess}
      onValidationError={onValidationError}
      onError={onError}
      transientPayload={transientPayload}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
```

## ory/packages/elements-react/src/theme/default/flows/recovery.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { FlowType, RecoveryFlow } from '@ory/client-fetch'
import {
  OryClientConfiguration,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
  OrySuccessHandler,
  OryTransientPayload,
  OryValidationErrorHandler,
} from '@ory/elements-react'
import { getOryComponents } from '../components'

/**
 * Props for the Recovery component.
 * @inline
 * @hidden
 */
export type RecoveryFlowContextProps = {
  /**
   * The recovery flow object containing the state and data for the recovery process.
   */
  flow: RecoveryFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the recovery flow.
   */
  components?: OryFlowComponentOverrides
  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL and other settings.
   */
  config: OryClientConfiguration

  /**
   * Optional children to render
   *
   * If not provided, the default OrySelfServiceFlowCard will be rendered.
   */
  children?: React.ReactNode

  /**
   * Optional callback invoked on successful flow completion.
   *
   * @see {@link OrySuccessHandler}
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * @see {@link OryValidationErrorHandler}
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on flow-level errors.
   *
   * @see {@link OryErrorHandler}
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload.
   *
   * @see {@link OryTransientPayload}
   */
  transientPayload?: OryTransientPayload
}

/**
 * The `Recovery` component is used to render the recovery flow in Ory Elements.
 *
 * @param props - The props for the Recovery component.
 * @returns the recovery flow component.
 * @group Components
 * @category Flows
 */
export function Recovery({
  flow,
  config,
  children,
  components: flowOverrideComponents,
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
}: RecoveryFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Recovery}
      components={components}
      onSuccess={onSuccess}
      onValidationError={onValidationError}
      onError={onError}
      transientPayload={transientPayload}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
```

## ory/packages/elements-react/src/theme/default/flows/registration.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { FlowType, RegistrationFlow } from '@ory/client-fetch'
import {
  OryClientConfiguration,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
  OrySuccessHandler,
  OryTransientPayload,
  OryValidationErrorHandler,
} from '@ory/elements-react'
import { getOryComponents } from '../components'

/**
 * Props for the Registration component.
 *
 * @inline
 * @hidden
 */
type RegistrationFlowContextProps = {
  /**
   * The registration flow object containing the state and data for the registration process.
   */
  flow: RegistrationFlow

  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the registration flow.
   */
  components?: OryFlowComponentOverrides

  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL and other settings.
   */
  config: OryClientConfiguration

  /**
   * Optional children to render
   *
   * If not provided, the default OrySelfServiceFlowCard will be rendered.
   */
  children?: React.ReactNode

  /**
   * Optional callback invoked on successful flow completion.
   *
   * @see {@link OrySuccessHandler}
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * @see {@link OryValidationErrorHandler}
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on flow-level errors.
   *
   * @see {@link OryErrorHandler}
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload.
   *
   * @see {@link OryTransientPayload}
   */
  transientPayload?: OryTransientPayload
}

/**
 * The `Registration` component is used to render the registration flow in Ory Elements.
 *
 * @param props - The props for the Registration component.
 * @returns
 * @group Components
 * @category Flows
 */
export function Registration({
  flow,
  children,
  components: flowOverrideComponents,
  config,
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
}: RegistrationFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Registration}
      components={components}
      onSuccess={onSuccess}
      onValidationError={onValidationError}
      onError={onError}
      transientPayload={transientPayload}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
```

## ory/packages/elements-react/src/theme/default/flows/settings.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { FlowType, SettingsFlow } from '@ory/client-fetch'
import {
  OryClientConfiguration,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryPageHeader,
  OryProvider,
  OrySettingsCard,
  OrySuccessHandler,
  OryTransientPayload,
  OryValidationErrorHandler,
} from '@ory/elements-react'
import { ComponentPropsWithoutRef } from 'react'
import { getOryComponents } from '../components'
import { cn } from '../utils/cn'

/**
 * Props for the Settings component.
 *
 * @inline
 * @hidden
 */
export type SettingsFlowContextProps = {
  /**
   * The settings flow object containing the state and data for the settings process.
   */
  flow: SettingsFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the settings flow.
   */
  components?: OryFlowComponentOverrides
  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL and other settings.
   */
  config: OryClientConfiguration
  /**
   * Optional children to render
   *
   * If not provided, the default OrySettingsCard will be rendered.
   */
  children?: React.ReactNode

  /**
   * Optional callback invoked on successful flow completion.
   *
   * @see {@link OrySuccessHandler}
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * @see {@link OryValidationErrorHandler}
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on flow-level errors.
   *
   * @see {@link OryErrorHandler}
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload.
   *
   * @see {@link OryTransientPayload}
   */
  transientPayload?: OryTransientPayload
} & Omit<ComponentPropsWithoutRef<'div'>, 'onError'>

/**
 * The `Settings` component is used to render the settings flow in Ory Elements.
 *
 * It provides the necessary context and components for the settings flow, allowing you to customize the appearance and behavior of the settings form.
 *
 * @param props - The props for the Settings component.
 * @group Components
 * @category Flows
 */
export function Settings({
  flow,
  config,
  children,
  components: flowOverrideComponents,
  className,
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
  ...rest
}: SettingsFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)

  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Settings}
      components={components}
      onSuccess={onSuccess}
      onValidationError={onValidationError}
      onError={onError}
      transientPayload={transientPayload}
    >
      {children ?? (
        <div className={cn('ory-elements', className)} {...rest}>
          <div className="flex flex-col items-center justify-start gap-8 pb-12 font-sans-default">
            <OryPageHeader />
            <OrySettingsCard />
          </div>
        </div>
      )}
    </OryProvider>
  )
}
```

## ory/packages/elements-react/src/theme/default/flows/verification.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { FlowType, VerificationFlow } from '@ory/client-fetch'
import {
  OryClientConfiguration,
  OryErrorHandler,
  OryFlowComponentOverrides,
  OryProvider,
  OrySelfServiceFlowCard,
  OrySuccessHandler,
  OryTransientPayload,
  OryValidationErrorHandler,
} from '@ory/elements-react'
import { getOryComponents } from '../components'

/**
 * Props for the Verification component.
 *
 * @inline
 * @hidden
 */
export type VerificationFlowContextProps = {
  /**
   * The verification flow object containing the state and data for the verification process.
   */
  flow: VerificationFlow
  /**
   * Optional components to override the default ones.
   *
   * This allows you to customize the appearance and behavior of the verification flow.
   */
  components?: OryFlowComponentOverrides
  /**
   * The Ory client configuration object.
   *
   * This object contains the configuration for the Ory client, such as the base URL and other settings.
   */
  config: OryClientConfiguration
  /**
   * Optional children to render
   *
   * If not provided, the default OrySelfServiceFlowCard will be rendered.
   */
  children?: React.ReactNode

  /**
   * Optional callback invoked on successful flow completion.
   *
   * @see {@link OrySuccessHandler}
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * @see {@link OryValidationErrorHandler}
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked on flow-level errors.
   *
   * @see {@link OryErrorHandler}
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload.
   *
   * @see {@link OryTransientPayload}
   */
  transientPayload?: OryTransientPayload
}

/**
 * The `Verification` component is used to render the verification flow in Ory Elements.
 *
 * It provides the necessary context and components for the verification flow, allowing you to customize the appearance and behavior of the verification form.
 *
 * @param props - The props for the Verification component.
 * @group Components
 * @category Flows
 */
export function Verification({
  flow,
  config,
  children,
  components: flowOverrideComponents,
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
}: VerificationFlowContextProps) {
  const components = getOryComponents(flowOverrideComponents)
  return (
    <OryProvider
      config={config}
      flow={flow}
      flowType={FlowType.Verification}
      components={components}
      onSuccess={onSuccess}
      onValidationError={onValidationError}
      onError={onError}
      transientPayload={transientPayload}
    >
      {children ?? <OrySelfServiceFlowCard />}
    </OryProvider>
  )
}
```

## ory/packages/elements-react/src/theme/default/global.css

```css
/* Copyright © 2024 Ory Corp */
/* SPDX-License-Identifier: Apache-2.0 */

@layer ory-elements;

@import 'tailwindcss/preflight' layer(ory-elements);
@import 'tailwindcss/utilities' layer(ory-elements);
@import 'tailwindcss/theme' layer(ory-elements);

@import '../../../tailwind/generated/variables.css';

@theme {
  --font-sans: initial;
  --font-sans-default: var(--font-sans);
  --animate-caret-blink: caret-blink 1.25s ease-out infinite;
  @keyframes caret-blink {
    0%,
    70%,
    100% {
      opacity: 1;
    }
    20%,
    50% {
      opacity: 0;
    }
  }

  --animate-drop-down-in: drop-down-in 400ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes drop-down-in {
    from {
      opacity: 0;
      transform: scale(0.75);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  --animate-drop-down-out: drop-down-out 400ms cubic-bezier(0.16, 1, 0.3, 1);
  @keyframes drop-down-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.96);
    }
  }
}

@custom-variant loading {
  &[data-loading='true'] {
    @slot;
  }
}
```

## ory/packages/elements-react/src/theme/default/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * This package provides the default theme for Ory Elements React.
 *
 * @packageDocumentation
 * @module default-theme
 */

import './global.css'
export * from './components'
export * from './flows'
```

## ory/packages/elements-react/src/theme/default/provider-logos/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import apple from './apple.svg'
import auth0 from './auth0.svg'
import discord from './discord.svg'
import facebook from './facebook.svg'
import github from './github.svg'
import gitlab from './gitlab.svg'
import google from './google.svg'
import linkedin from './linkedin.svg'
import microsoft from './microsoft.svg'
import slack from './slack.svg'
import spotify from './spotify.svg'
import yandex from './yandex.svg'
import x from './x.svg'

const logos: Record<string, typeof apple> = {
  apple,
  auth0,
  discord,
  facebook,
  github,
  gitlab,
  google,
  linkedin,
  microsoft,
  slack,
  spotify,
  yandex,
  x,
}
export default logos
```

## ory/packages/elements-react/src/theme/default/utils/attributes.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function omit<OBJ extends object>(
  obj: OBJ,
  keys: (keyof OBJ)[],
): Omit<typeof obj, (typeof keys)[number]> {
  const ret = { ...obj }
  for (const key of keys) {
    delete ret[key]
  }
  return ret
}
```

## ory/packages/elements-react/src/theme/default/utils/cn.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## ory/packages/elements-react/src/theme/default/utils/constructCardHeader.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  AuthenticatorAssuranceLevel,
  FlowType,
  isUiNodeInputAttributes,
  OAuth2ConsentRequest,
  Session,
  UiContainer,
  UiNodeGroupEnum,
} from '@ory/client-fetch'
import { defineMessages, useIntl } from 'react-intl'
import { FormState } from '../../../context'
import { uiTextToFormattedMessage } from '../../../util'
import { kratosMessages } from '../../../util/i18n/generated/kratosMessages'
import { resolveLabel } from '../../../util/nodes'
import { findNode } from '../../../util/ui'

function joinWithCommaOr(list: string[], orText = 'or'): string {
  if (list.length === 0) {
    return '.'
  } else if (list.length === 1) {
    return list[0]
  } else {
    const last = list.pop()
    return `${list.join(', ')} ${orText} ${last}`
  }
}

export type CardHeaderTextOptions =
  | {
      flowType: FlowType.Login
      flow: {
        refresh?: boolean
        requested_aal?: AuthenticatorAssuranceLevel
      }
      formState?: FormState
    }
  | {
      flowType: FlowType.Registration
      formState?: FormState
    }
  | {
      flowType: FlowType.OAuth2Consent
      flow: {
        consent_request: OAuth2ConsentRequest
        session: Session
      }
    }
  | {
      flowType: FlowType.Error | FlowType.Verification | FlowType.Recovery | FlowType.Settings
    }

const loginSubtitles = defineMessages<string>({
  [UiNodeGroupEnum.Code]: {
    id: 'login.code.subtitle',
    defaultMessage: 'A verification code will be sent by email',
  },
  [UiNodeGroupEnum.Webauthn]: {
    id: 'login.webauthn.subtitle',
    defaultMessage: 'Please prepare your WebAuthN device',
  },
  [UiNodeGroupEnum.Totp]: {
    id: 'login.totp.subtitle',
    defaultMessage: 'Please enter the code generated by your Authenticator App',
  },
  [UiNodeGroupEnum.LookupSecret]: {
    id: 'login.lookup_secret.subtitle',
    defaultMessage: 'Please enter one of your 8-digit backup recovery codes',
  },
})

/**
 * Constructs a title and a description for the card header.
 *
 * The title is a title suitable for the current flow, e.g. "Sign in" or "Update your account".
 *
 * The description for a login & registration flow, is a collection of the labels of the input fields.
 * For example, if the user has a password and an email address, the description will be "Sign in with your email and password".
 * And for registration, the listed options depend on the project configuration.
 *
 * For verification, recovery and settings flows, the description is a generic one, e.g. "Enter the email address associated with your account to verify it".
 *
 *
 * @param nodes - the UI nodes of the current flow
 * @param opts - can be a flow object, only needed for the refresh login flow
 * @returns a title and a description for the card header
 */
export function useCardHeaderText(
  container: UiContainer,
  opts: CardHeaderTextOptions,
): { title: string; description: string; messageId?: string } {
  const nodes = container.nodes
  const intl = useIntl()
  switch (opts.flowType) {
    case FlowType.Recovery: {
      const recoveryV2Message = container.messages?.find((m) =>
        [1060006, 1060005, 1060004].includes(m.id),
      )

      if (recoveryV2Message) {
        return {
          title: intl.formatMessage({
            id: 'recovery.title',
            defaultMessage: 'Recover your account',
          }),
          description: uiTextToFormattedMessage(recoveryV2Message, intl),
          messageId: recoveryV2Message.id + '',
        }
      } else if (
        nodes.find((node) => 'name' in node.attributes && node.attributes.name === 'code')
      ) {
        return {
          title: intl.formatMessage({
            id: 'recovery.title',
            defaultMessage: 'Recover your account',
          }),
          description: intl.formatMessage(kratosMessages[1060003]),
          messageId: '1060003',
        }
      }
      return {
        title: intl.formatMessage({
          id: 'recovery.title',
          defaultMessage: 'Recover your account',
        }),
        description: intl.formatMessage({
          id: 'recovery.subtitle',
          defaultMessage:
            'Enter the identifier associated with your account to receive a one-time access code',
        }),
      }
    }
    case FlowType.Settings:
      return {
        title: intl.formatMessage({
          id: 'settings.title',
          defaultMessage: 'Account Settings',
        }),
        description: intl.formatMessage({
          id: 'settings.subtitle',
          defaultMessage: 'Update your account settings',
        }),
      }
    case FlowType.Verification:
      if (nodes.find((node) => 'name' in node.attributes && node.attributes.name === 'code')) {
        return {
          title: intl.formatMessage({
            id: 'verification.title',
            defaultMessage: 'Verify your account',
          }),
          description: intl.formatMessage(kratosMessages[1080003]),
          messageId: '1080003',
        }
      }
      return {
        title: intl.formatMessage({
          id: 'verification.title',
          defaultMessage: 'Verify your account',
        }),
        description: intl.formatMessage({
          id: 'verification.subtitle',
          defaultMessage: 'Enter the email address associated with your account to verify it',
        }),
      }
    case FlowType.Login: {
      // account linking
      const accountLinkingMessage = container.messages?.find((m) => m.id === 1010016)
      if (accountLinkingMessage) {
        return {
          title: intl.formatMessage({
            id: 'account-linking.title',
            defaultMessage: 'Link account',
          }),
          description: intl.formatMessage(
            kratosMessages[1010016],
            accountLinkingMessage.context as Record<string, string>,
          ),
          messageId: '1010016',
        }
      }
    }
  }

  const parts = []

  if (nodes.find((node) => node.group === 'password')) {
    switch (opts.flowType) {
      case FlowType.Registration:
        parts.push(
          intl.formatMessage(
            {
              id: 'card.header.parts.password.registration',
              defaultMessage: 'your {identifierLabel} and a password',
            },
            // TODO: make this generic for other labels
            { identifierLabel: 'email' },
          ),
        )
        break
      default:
        parts.push(
          intl.formatMessage(
            {
              id: 'card.header.parts.password.login',
              defaultMessage: 'your {identifierLabel} and password',
            },
            // TODO: make this generic for other labels
            { identifierLabel: 'email' },
          ),
        )
    }
  }

  if (nodes.find((node) => node.group === 'oidc' || node.group === 'saml')) {
    parts.push(
      intl.formatMessage({
        id: 'card.header.parts.oidc',
        defaultMessage: 'a social provider',
      }),
    )
  }

  if (nodes.find((node) => node.group === 'code')) {
    parts.push(
      intl.formatMessage({
        id: 'card.header.parts.code',
        defaultMessage: 'a one-time code',
      }),
    )
  }

  if (nodes.find((node) => node.group === 'totp')) {
    parts.push(
      intl.formatMessage({
        id: 'card.header.parts.totp',
        defaultMessage: 'your authenticator app',
      }),
    )
  }

  if (nodes.find((node) => node.group === 'lookup_secret')) {
    parts.push(
      intl.formatMessage({
        id: 'card.header.parts.lookup_secret',
        defaultMessage: 'a backup recovery code',
      }),
    )
  }

  if (nodes.find((node) => node.group === 'passkey')) {
    parts.push(
      intl.formatMessage({
        id: 'card.header.parts.passkey',
        defaultMessage: 'a Passkey',
      }),
    )
  }

  if (nodes.find((node) => node.group === 'webauthn')) {
    parts.push(
      intl.formatMessage({
        id: 'card.header.parts.webauthn',
        defaultMessage: 'a security key',
      }),
    )
  }

  if (nodes.find((node) => node.group === 'identifier_first')) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith('identifier') &&
        node.attributes.type !== 'hidden',
    )

    if (identifier) {
      parts.push(
        intl.formatMessage(
          {
            id: 'card.header.parts.identifier-first',
            defaultMessage: 'your {identifierLabel}',
          },
          {
            identifierLabel: identifier.meta.label && resolveLabel(identifier.meta.label, intl),
          },
        ),
      )
    }
  }

  if (nodes.some((node) => node.group === 'profile')) {
    const identifier = nodes.find(
      (node) =>
        isUiNodeInputAttributes(node.attributes) &&
        node.attributes.name.startsWith('traits.') &&
        node.attributes.type !== 'hidden',
    )

    if (identifier) {
      parts.push(
        intl.formatMessage(
          {
            id: 'card.header.parts.identifier-first',
            defaultMessage: 'your {identifierLabel}',
          },
          {
            identifierLabel: identifier.meta.label && resolveLabel(identifier.meta.label, intl),
          },
        ),
      )
    }
  }

  switch (opts.flowType) {
    case FlowType.Login: {
      const codeMethodNode = findNode(container.nodes, {
        node_type: 'input',
        group: 'code',
        name: 'code',
        type: 'text',
      })
      const codeSent =
        codeMethodNode &&
        opts.formState?.current === 'method_active' &&
        opts.formState?.method === 'code'

      const stringifiedParts = joinWithCommaOr(
        parts,
        intl.formatMessage({ id: 'misc.or', defaultMessage: 'or' }),
      )

      if (opts.flow.refresh) {
        const description = codeSent
          ? intl.formatMessage(kratosMessages[1010025])
          : intl.formatMessage(
              {
                id: 'login.subtitle-refresh',
                defaultMessage: 'Confirm your identity with {parts}',
              },
              {
                parts: stringifiedParts,
              },
            )
        return {
          title: intl.formatMessage({
            id: 'login.title-refresh',
            defaultMessage: 'Reauthenticate',
          }),
          description,
          messageId: codeSent ? '1010025' : undefined,
        }
      } else if (opts.flow.requested_aal === 'aal2') {
        const description = codeSent
          ? intl.formatMessage(kratosMessages[1010025])
          : opts.formState?.current === 'method_active'
            ? intl.formatMessage(loginSubtitles[opts.formState.method])
            : intl.formatMessage({
                id: 'login.subtitle-aal2',
                defaultMessage: 'Choose a way to complete your second factor authentication',
              })
        return {
          title: intl.formatMessage({
            id: 'login.title-aal2',
            defaultMessage: 'Second factor authentication',
          }),
          description,
          messageId: codeSent ? '1010025' : undefined,
        }
      }
      const description =
        parts.length > 0
          ? codeSent
            ? intl.formatMessage(kratosMessages[1010014])
            : intl.formatMessage(
                {
                  id: 'login.subtitle',
                  defaultMessage: 'Sign in with {parts}',
                },
                {
                  parts: stringifiedParts,
                },
              )
          : ''
      return {
        title: intl.formatMessage({
          id: 'login.title',
          defaultMessage: 'Sign in',
        }),
        description,
      }
    }
    case FlowType.Registration: {
      const codeMethodNode = findNode(container.nodes, {
        node_type: 'input',
        group: 'code',
        name: 'code',
        type: 'text',
      })
      const codeSent =
        codeMethodNode &&
        opts.formState?.current === 'method_active' &&
        opts.formState?.method === 'code'

      return {
        title: intl.formatMessage({
          id: 'registration.title',
          defaultMessage: 'Register an account',
        }),
        description: codeSent
          ? intl.formatMessage(kratosMessages[1040005])
          : parts.length > 0
            ? intl.formatMessage(
                {
                  id: 'registration.subtitle',
                  defaultMessage: 'Sign up with {parts}',
                },
                {
                  parts: joinWithCommaOr(
                    parts,
                    intl.formatMessage({ id: 'misc.or', defaultMessage: 'or' }),
                  ),
                },
              )
            : '',
      }
    }
    case FlowType.OAuth2Consent:
      return {
        title: intl.formatMessage(
          {
            id: 'consent.title',
            defaultMessage: 'Authorize {party}',
          },
          {
            party: opts.flow.consent_request.client?.client_name,
          },
        ),
        description: intl.formatMessage(
          {
            id: 'consent.subtitle',
            defaultMessage:
              'A third party application wants to access information associated with your account {identifier}.',
          },
          {
            identifier: (opts.flow.session.identity?.traits.email ?? '') as string,
          },
        ),
      }
  }

  // TODO: This should not happen, as the switch is exhaustive, but typescript doesn't think so
  return {
    title: 'Error',
    description: 'An error occurred',
  }
}
```

## ory/packages/elements-react/src/theme/default/utils/form.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function isGroupImmediateSubmit(group: string) {
  // TODO: Other methods might also benefit from this.
  return group === 'code'
}
```

## ory/packages/elements-react/src/theme/default/utils/logout.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { LogoutFlow } from '@ory/client-fetch'
import { useCallback, useEffect, useState } from 'react'
import { frontendClient } from '../../../util/client'
export function useClientLogout(config: { sdk: { url: string } }) {
  const [logoutFlow, setLogoutFlow] = useState<LogoutFlow | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchLogoutFlow = useCallback(async () => {
    try {
      const flow = await frontendClient(config.sdk.url)
        .createBrowserLogoutFlow()
        .catch((err) => {
          // We ignore errors that are thrown because the user is not signed in.
          if (err.response?.status !== 401) {
            throw err
          }
          return undefined
        })
      setLogoutFlow(flow)
    } finally {
      setIsLoading(false)
    }
  }, [config.sdk.url])

  useEffect(() => {
    void fetchLogoutFlow()
  }, [fetchLogoutFlow])

  return { logoutFlow, didLoad: !isLoading }
}
```

## ory/packages/elements-react/src/theme/default/utils/oauth2.ts

```typescript
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  OAuth2ConsentRequest,
  Session,
  UiContainer,
  UiNode,
  UiTextTypeEnum,
} from '@ory/client-fetch'
import { ConsentFlow } from '../../../util'

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

export function translateConsentChallengeToUiNodes(
  consentChallenge: OAuth2ConsentRequest,
  csrfToken: string,
  formAction: string,
  session: Session,
): ConsentFlow {
  const ui: UiContainer = {
    action: formAction,
    nodes: [
      ...scopesToUiNodes(consentChallenge.requested_scope ?? []),
      rememberCheckbox,
      rejectButton,
      acceptButton,
      csrfTokenNode(csrfToken),
      challengeNode(consentChallenge.challenge),
    ],
    method: 'POST',
    messages: [],
  }

  return {
    id: 'UNSET',
    created_at: new Date(),
    expires_at: new Date(),
    issued_at: new Date(),
    state: 'show_form',
    active: 'oauth2_consent',
    ui,
    consent_request: consentChallenge,
    session,
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

function csrfTokenNode(csrfToken: string): UiNode {
  return {
    type: 'input',
    group: 'default',
    meta: {},
    attributes: {
      node_type: 'input',
      name: 'csrf_token',
      value: csrfToken,
      type: 'hidden',
      disabled: false,
    },
    messages: [],
  }
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
```

## ory/packages/elements-react/src/theme/default/utils/url.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export function restartFlowUrl(
  flow: {
    id: string
    request_url?: string
    requested_aal?: string
    return_to?: string
    identity_schema?: string
  },
  fallback: string,
) {
  return (
    flow.request_url ||
    appendReturnToAndIdentitySchema(fallback, flow.return_to, flow.identity_schema)
  )
}

export function initFlowUrl(
  sdkUrl: string,
  flowType: string,
  flow: {
    id: string
    return_to?: string
    oauth2_login_challenge?: string
    identity_schema?: string
  },
) {
  const result = `${sdkUrl}/self-service/${flowType}/browser`
  const qs = new URLSearchParams()

  if (flow.oauth2_login_challenge) {
    qs.set('login_challenge', flow.oauth2_login_challenge)
  }
  if (flow.identity_schema) {
    qs.set('identity_schema', flow.identity_schema)
  }
  if (flow.return_to) {
    qs.set('return_to', flow.return_to)
  } else if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('return_to')) {
      qs.set('return_to', searchParams.get('return_to') || '')
    }
  }

  if (qs.toString().length === 0) {
    return result
  }

  return result + '?' + qs.toString()
}

function appendReturnToAndIdentitySchema(url: string, returnTo?: string, identitySchema?: string) {
  const urlObj = new URL(url)
  if (returnTo) {
    urlObj.searchParams.set('return_to', returnTo)
  }
  if (identitySchema) {
    urlObj.searchParams.set('identity_schema', identitySchema)
  }
  return urlObj.toString()
}
```

## ory/packages/elements-react/src/theme/default/utils/user.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Session } from '@ory/client-fetch'

export type UserInitials = {
  primary: string
  secondary?: string
  avatar?: string
}

function isTraitsIndexable(
  traits: unknown,
): traits is Record<string, string | Record<string, string>> {
  return typeof traits === 'object' && traits !== null
}

export const getUserInitials = (session: Session | null): UserInitials => {
  const avatar = ''
  let primary = ''
  let secondary = ''

  if (!session?.identity?.traits || !isTraitsIndexable(session.identity.traits)) {
    return {
      primary,
      secondary,
      avatar,
    }
  }

  const traits = session.identity?.traits

  if (traits.email && typeof traits.email === 'string') {
    secondary = traits.email
  }

  if (traits.name) {
    if (typeof traits.name === 'string') {
      primary = traits.name
    }

    if (typeof traits.name === 'object' && traits.name && traits.name.first && traits.name.last) {
      primary = traits.name.first + ' ' + traits.name.last
    }
  }

  if (primary === '') {
    primary = secondary
    secondary = ''
  }

  return {
    primary,
    secondary,
    avatar,
  }
}
```

## ory/packages/elements-react/src/context/component.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { createContext, PropsWithChildren, useContext } from 'react'
import { OryFlowComponents } from '../components'
import { defaultNodeSorter } from './defaultNodeSorter'

type ComponentContextValue = {
  components: OryFlowComponents
  nodeSorter: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

const ComponentContext = createContext<ComponentContextValue>({
  components: null!, // fine because we throw an error if it's not provided
  nodeSorter: () => 0,
  groupSorter: () => 0,
})

/**
 * The `useComponents` hook provides access to the Ory Flow components provided in the `OryComponentProvider`.
 *
 * You can use this hook to access the components defined in the `components` prop of the `OryComponentProvider`.
 *
 * @returns the current component context value.
 * @group Hooks
 */
export function useComponents() {
  const ctx = useContext(ComponentContext)
  if (!ctx) {
    throw new Error('useComponents must be used within a ComponentProvider')
  }
  return ctx.components
}

/**
 * The `useNodeSorter` hook provides a way to access the node sorting function
 *
 * The node sorting function is used to determine the order of nodes in a flow based on their attributes and context.
 *
 * To customize the sorting behavior, you can provide a custom `nodeSorter` function to the `OryComponentProvider`.
 *
 * @returns a function that sorts nodes based on the provided context.
 * @group Hooks
 */
export function useNodeSorter() {
  const ctx = useContext(ComponentContext)
  if (!ctx) {
    throw new Error('useNodeSorter must be used within a ComponentProvider')
  }
  return ctx.nodeSorter
}

export function useGroupSorter() {
  const ctx = useContext(ComponentContext)
  if (!ctx) {
    throw new Error('useGroupSorter must be used within a ComponentProvider')
  }
  return ctx.groupSorter
}

const defaultGroupOrder: UiNodeGroupEnum[] = [
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

function defaultGroupSorter(a: UiNodeGroupEnum, b: UiNodeGroupEnum): number {
  const aGroupWeight = defaultGroupOrder.indexOf(a) ?? 999
  const bGroupWeight = defaultGroupOrder.indexOf(b) ?? 999

  return aGroupWeight - bGroupWeight
}

type ComponentProviderProps = {
  components: OryFlowComponents
  nodeSorter?: (a: UiNode, b: UiNode, ctx: { flowType: string }) => number
  groupSorter?: (a: UiNodeGroupEnum, b: UiNodeGroupEnum) => number
}

export function OryComponentProvider({
  children,
  components,
  nodeSorter = defaultNodeSorter,
  groupSorter = defaultGroupSorter,
}: PropsWithChildren<ComponentProviderProps>) {
  return (
    <ComponentContext.Provider
      value={{
        components,
        nodeSorter,
        groupSorter,
      }}
    >
      {children}
    </ComponentContext.Provider>
  )
}
```

## ory/packages/elements-react/src/context/config.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ConfigurationParameters, FrontendApi } from '@ory/client-fetch'
import { createContext, PropsWithChildren, useContext, useRef } from 'react'
import { isProduction } from '../client/config'
import { OryClientConfiguration, ProjectConfiguration } from '../util'
import { frontendClient } from '../util/client'

/**
 * The Ory Elements configuration object.
 *
 * @interface
 */
export type OryElementsConfiguration = {
  /**
   * The Ory SDK configuration.
   * This includes the URL and options for the Ory SDK.
   */
  sdk: OrySDK
  /**
   * The project configuration.
   * This includes the project name, URLs, and other settings for the Ory Elements project.
   */
  project: ProjectConfiguration
}

const defaultProject: ProjectConfiguration = {
  name: 'Ory',
  registration_enabled: true,
  verification_enabled: true,
  recovery_enabled: true,
  recovery_ui_url: '/ui/recovery',
  registration_ui_url: '/ui/registration',
  verification_ui_url: '/ui/verification',
  login_ui_url: '/ui/login',
  settings_ui_url: '/ui/settings',
  default_redirect_url: '/ui/welcome',
  error_ui_url: '/ui/error',
  hide_ory_branding: false,
}

/**
 * The `useOryConfiguration` hook provides access to the Ory Elements configuration.
 *
 * This includes the SDK configuration and the project configuration. To customize the configuration, provide the `sdk` and `project` properties in the `OryConfigurationProvider`.
 *
 * @returns the Ory Elements configuration, which includes the SDK and project configuration.
 * @group Hooks
 */
export function useOryConfiguration(): OryElementsConfiguration {
  const configCtx = useContext(OryConfigurationContext)
  return {
    sdk: {
      ...configCtx.sdk,
      frontend: frontendClient(configCtx.sdk.url, configCtx.sdk.options),
    },
    project: {
      ...configCtx.project,
    },
  }
}

export type OrySDK = SDKConfig & {
  /**
   * The frontend client for the Ory SDK.
   * This client is used to interact with the Ory SDK and should be used to make API calls.
   */
  frontend: FrontendApi
}

type SDKConfig = {
  /**
   * The URL of the Ory SDK.
   * This URL is used to connect to the Ory SDK and should be set to the base URL of your Ory instance.
   */
  url: string
  options?: Partial<ConfigurationParameters>
}

type OryElementsConfigContextType = {
  sdk: SDKConfig
  project: ProjectConfiguration
}

const OryConfigurationContext = createContext<OryElementsConfigContextType>({
  sdk: null!, // This is fine, because we always supply a proper default value for the SDK configuration in the provider
  project: defaultProject,
})

/**
 * Props for the `OryConfigurationProvider` component.
 *
 * @hidden
 * @inline
 */
export interface OryConfigurationProviderProps extends PropsWithChildren {
  /**
   * The Ory SDK configuration to use.
   * If not provided, the SDK URL will be determined automatically based on the environment.
   *
   * Always required for production environments.
   */
  sdk?: OryClientConfiguration['sdk']

  /**
   * This configuration is used to customize the behavior and appearance of Ory Elements.
   */
  project?: Partial<ProjectConfiguration>
}

/**
 * The `OryConfigurationProvider` component provides the Ory Elements configuration to its children.
 *
 * @param props - The properties for the OryConfigurationProvider component.
 * @returns
 * @group Components
 */
export function OryConfigurationProvider({
  children,
  sdk: initialConfig,
  project,
}: OryConfigurationProviderProps) {
  const configRef = useRef({
    sdk: computeSdkConfig(initialConfig),
    project: {
      ...defaultProject,
      ...project,
    },
  })

  return (
    <OryConfigurationContext.Provider value={configRef.current}>
      {children}
    </OryConfigurationContext.Provider>
  )
}

function computeSdkConfig(config?: OryClientConfiguration['sdk']): SDKConfig {
  if (config?.url && typeof config.url === 'string') {
    return {
      url: config.url.replace(/\/$/, ''),
      options: config.options || {},
    }
  }

  return {
    url: getSDKUrl(),
    options: config?.options || {},
  }
}

function getSDKUrl() {
  if (typeof process !== 'undefined' && !!process.env) {
    // process is available, let's try some environment variables
    if (isProduction()) {
      const sdkUrl = process.env['NEXT_PUBLIC_ORY_SDK_URL'] ?? process.env['ORY_SDK_URL']
      if (!sdkUrl) {
        throw new Error(
          'Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL in production environments.',
        )
      }
      return sdkUrl.replace(/\/$/, '')
    } else {
      if (process.env['__NEXT_PRIVATE_ORIGIN']) {
        return process.env['__NEXT_PRIVATE_ORIGIN'].replace(/\/$/, '')
      } else if (process.env['VERCEL_URL']) {
        return `https://${process.env['VERCEL_URL']}`.replace(/\/$/, '')
      }
    }
  }

  if (typeof window !== 'undefined') {
    // we are in the browser

    // Try to use window location
    return window.location.origin
  }
  // We aren't in node, and we don't have a window location.
  // This is probably a test environment, so we can't guess the SDK URL.

  throw new Error(
    'Unable to determine SDK URL. Please set NEXT_PUBLIC_ORY_SDK_URL and/or ORY_SDK_URL or supply the sdk.url parameter in the Ory configuration.',
  )
}
```

## ory/packages/elements-react/src/context/defaultNodeSorter.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeInputAttributes, UiNode } from '@ory/client-fetch'

const defaultNodeOrder = [
  'oidc',
  'saml',
  'identifier_first',
  'default',
  'profile',
  'password',
  'captcha',
  'passkey',
  'code',
  'webauthn',
]

const Slot = {
  Inputs: 0,
  Checkboxes: 1,
  Captcha: 2,
  Buttons: 3,
}

function isUiNodeButton(node: UiNode) {
  return (
    isUiNodeInputAttributes(node.attributes) &&
    (node.attributes.type === 'submit' || node.attributes.type === 'button')
  )
}

// makeUiNodeComparator creates a comparator function for UiNodes based on the provided group order.
// It sorts the nodes first by slot (inputs, checkboxes, captchas, submits), then by group order, and finally by type within the same slot.
function makeUiNodeComparator({ groupOrder = defaultNodeOrder } = {}) {
  const groupRank = new Map(groupOrder.map((g, i) => [g, i]))
  const unknownGroupRank = groupOrder.length

  // Slot rank: 0 inputs, 1 checkboxes, 2 captchas, 3 submit/buttons
  const slotRank = (node: UiNode) => {
    if (isUiNodeInputAttributes(node.attributes) === false) {
      return Slot.Inputs // non-inputs go to default slot
    }
    const { type } = node.attributes

    // Keep webauthn inputs next to the webauthn button by treating them as buttons
    if (node.group === 'webauthn' && type !== 'submit' && type !== 'button') {
      return Slot.Buttons
    }

    if (type === 'checkbox') {
      return Slot.Checkboxes
    }

    // Captcha slot is based on group
    if (node.group === 'captcha') {
      return Slot.Captcha
    }

    if (type === 'submit' || type === 'button') {
      return Slot.Buttons
    }

    // Default: inputs slot
    return Slot.Inputs
  }

  return (a: UiNode, b: UiNode) => {
    const sa = slotRank(a)
    const sb = slotRank(b)
    if (sa !== sb) {
      return sa - sb
    }

    const ga = groupRank.get(a.group) ?? unknownGroupRank
    const gb = groupRank.get(b.group) ?? unknownGroupRank
    if (ga !== gb) {
      return ga - gb
    }

    if (a.group === 'webauthn' && b.group === 'webauthn') {
      const aIsButton = isUiNodeButton(a)
      const bIsButton = isUiNodeButton(b)
      if (aIsButton !== bIsButton) {
        return aIsButton ? 1 : -1
      }
    }

    return 0 // stability handled by wrapper
  }
}

export const defaultNodeSorter = makeUiNodeComparator({
  groupOrder: defaultNodeOrder,
})
```

## ory/packages/elements-react/src/context/flow-context.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { Dispatch, PropsWithChildren, createContext, useContext, useState } from 'react'
import { OryFlowContainer } from '../util/flowContainer'
import { OryErrorHandler, OrySuccessHandler, OryValidationErrorHandler } from '../util/events'
import { OryTransientPayload } from '../util/transientPayload'
import { FormState, FormStateAction, useFormStateReducer } from './form-state'

/**
 * Returns an object that contains the current flow and the flow type, as well as the configuration.
 *
 * @returns The current flow container
 * @group Hooks
 */
export function useOryFlow() {
  const ctx = useContext(OryFlowContext)
  if (!ctx) {
    throw new Error('useOryFlow must be used within a OryFlowProvider')
  }

  return ctx
}

/**
 * Function to set the flow container.
 * @interface
 */
export type FlowContainerSetter = Dispatch<OryFlowContainer>

/**
 * The return value of the OryFlowContext.
 */
export type FlowContextValue = OryFlowContainer & {
  /**
   * Function to set the flow container.
   */
  setFlowContainer: FlowContainerSetter

  /**
   * The current form state.
   * @see FormState
   */
  formState: FormState

  /**
   * Dispatch function to update the form state.
   */
  dispatchFormState: Dispatch<FormStateAction>

  /**
   * Optional callback invoked on successful flow completion.
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked when a flow error occurs.
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in flow submissions.
   */
  transientPayload?: OryTransientPayload
}

// This is fine, because we don't export the context itself and guard from it being null in useOryFlow
const OryFlowContext = createContext<FlowContextValue>(null!)

/**
 * Props type for the OryFlowProvider component.
 *
 * @hidden
 * @inline
 */
export type OryFlowProviderProps = PropsWithChildren<
  OryFlowContainer & {
    onSuccess?: OrySuccessHandler
    onValidationError?: OryValidationErrorHandler
    onError?: OryErrorHandler
    transientPayload?: OryTransientPayload
  }
>

/**
 *
 * @param props - The properties for the OryFlowProvider component.
 * @returns
 */
export function OryFlowProvider({
  children,
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
  ...container
}: OryFlowProviderProps) {
  const [flowContainer, setFlowContainer] = useState(container)
  const [formState, dispatchFormState] = useFormStateReducer(container)

  return (
    <OryFlowContext.Provider
      value={
        {
          ...flowContainer,
          setFlowContainer: (flowContainer) => {
            setFlowContainer(flowContainer)
            dispatchFormState({
              type: 'action_flow_update',
              flow: flowContainer,
            })
          },
          formState,
          dispatchFormState,
          onSuccess,
          onValidationError,
          onError,
          transientPayload,
        } as FlowContextValue
      }
    >
      {children}
    </OryFlowContext.Provider>
  )
}
```

## ory/packages/elements-react/src/context/form-state.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { useReducer, useState } from 'react'
import { isChoosingMethod } from '../components/card/two-step/utils'
import { OryFlowContainer } from '../util'
import { nodesToAuthMethodGroups } from '../util/ui'

/**
 * Represents the state of the form when selecting an authentication method.
 * This type is used when the user is in the process of selecting an authentication method
 * (e.g., password, passkey, etc.) during the login or registration flow.
 * @inline
 * @hidden
 */
export type FormStateSelectMethod = { current: 'select_method' }
/**
 * Represents the state of the form when providing an identifier.
 * This type is used when the user is required to provide an identifier (e.g., email or username)
 * before proceeding with the authentication flow.
 * @inline
 * @hidden
 */
export type FormStateProvideIdentifier = { current: 'provide_identifier' }
/**
 * Represents the state of the form when an authentication method is active.
 * This type is used when the user is interacting with a specific authentication method
 * (e.g., entering a password or entering a code received via email).
 *
 * The `method` field indicates which authentication method is currently active.
 * @inline
 * @hidden
 */
export type FormStateMethodActive = {
  current: 'method_active'
  method: UiNodeGroupEnum
}

type FlowFormState =
  | FormStateSelectMethod
  | FormStateProvideIdentifier
  | FormStateMethodActive
  | { current: 'success_screen' }
  | { current: 'settings' }

type CommonFormStateProperties = {
  isSubmitting: boolean
  isReady: boolean
}

/**
 * Represents the state of the form based on the flow type and active method.
 * This type is used to determine which part of the form should be displayed.
 *
 * It can be one of the following:
 * - `select_method`: The user is selecting an authentication method.
 * - `provide_identifier`: The user is providing an identifier (e.g., email or username).
 * - `method_active`: An authentication method is active, and the user is interacting with it.
 * - `success_screen`: The flow has successfully completed (only used in the verification flow).
 * - `settings`: The user is in the settings flow.
 *
 * In addition, it includes a common properties:
 * - `isSubmitting`: A boolean indicating whether the form is currently being submitted.
 * - `isReady`: A boolean indicating whether the form is ready.
 */
export type FormState = FlowFormState & CommonFormStateProperties

/**
 * Represents the actions that can be dispatched to update the form state.
 * These actions are used to change the current state of the form based on user interactions or flow updates.
 */
export type FormStateAction =
  | {
      /**
       * Action to update the flow state.
       * This action is dispatched when the flow is updated, and it will parse the new flow
       * to determine the current form state.
       */
      type: 'action_flow_update'
      /**
       * The updated flow container that contains the new flow data.
       */
      flow: OryFlowContainer
    }
  | {
      /**
       * Action to select an authentication method.
       * This action is dispatched when the user selects an authentication method
       * (e.g., password, passkey, etc.) from the available options.
       */
      type: 'action_select_method'
      /**
       * The authentication method that the user has selected.
       */
      method: UiNodeGroupEnum
    }
  | {
      /**
       * Action to clear the active authentication method.
       * This action is dispatched when the user wants to clear the currently active method
       * and return to the method selection state.
       */
      type: 'action_clear_active_method'
    }
  | {
      /**
       * Action to indicate that an input group is loading.
       * This action is dispatched when the specified input is in the process of loading,
       * and it sets the form state to not ready.
       */
      type: 'form_input_loading'
      /**
       * The input group that is loading.
       */
      group: UiNodeGroupEnum
    }
  | {
      /**
       * Action to indicate that the input group is ready.
       * This action is dispatched when the specified input has finished loading,
       * and it sets the form state to ready.
       */
      type: 'form_input_ready'
      /**
       * The input group that is ready.
       */
      input: UiNodeGroupEnum
    }
  | {
      /**
       * Action to indicate the start of a form submission.
       * This action is dispatched when the user submits the form, and it sets the submitting state to true.
       */
      type: 'form_submit_start'
    }
  | {
      /**
       * Action to indicate the end of a form submission.
       * This action is dispatched when the form submission is complete, and it sets the submitting state to false.
       */
      type: 'form_submit_end'
    }
  | {
      /**
       * Action to indicate that a page redirect is occurring.
       * This action is dispatched when the form submission results in a page redirect
       * (usually after a successful login, etc. to redirect to the main application's URL),
       * and it keeps the submitting state as true, as the next action is a full page unload.
       *
       * This is necessary, to keep submit buttons in a submitting state while the redirect is in progress,
       * to prevent the user accidentally interacting with the page while it's redirecting causing UX issues.
       */
      type: 'page_redirect'
    }

function findMethodWithMessage(nodes?: UiNode[]) {
  return nodes
    ?.filter((n) => !['default', 'identifier_first'].includes(n.group))
    ?.find((node) => node.messages?.length > 0)
}

function parseStateFromFlow(flow: OryFlowContainer): FlowFormState {
  switch (flow.flowType) {
    case FlowType.Registration:
    case FlowType.Login: {
      const methodWithMessage = findMethodWithMessage(flow.flow.ui.nodes)
      if (flow.flow.active == 'link_recovery') {
        return { current: 'method_active', method: 'link' }
      } else if (flow.flow.active == 'code_recovery') {
        return { current: 'method_active', method: 'code' }
      } else if (methodWithMessage) {
        return { current: 'method_active', method: methodWithMessage.group }
      } else if (flow.flow.ui.messages?.some((m) => m.id === 1010016)) {
        // Account linking edge case
        return { current: 'select_method' }
      } else if (flow.flow.active && !['default', 'identifier_first'].includes(flow.flow.active)) {
        return { current: 'method_active', method: flow.flow.active }
      } else if (isChoosingMethod(flow)) {
        // Login has a special case where we only have one method. Here, we
        // do not want to display the chooser.
        const authMethods = nodesToAuthMethodGroups(flow.flow.ui.nodes)
        if (authMethods.length === 1 && !['code', 'passkey'].includes(authMethods[0])) {
          // TODO: https://github.com/ory/kratos/issues/4271 - once this is fixed in Kratos, we can remove the check for "code"
          return { current: 'method_active', method: authMethods[0] }
        }
        return { current: 'select_method' }
      }
      return { current: 'provide_identifier' }
    }
    case FlowType.Recovery:
    case FlowType.Verification:
      // The API does not provide types for the active field of the recovery flow
      // TODO: Add types for the recovery flow in Kratos
      if (flow.flow.active === 'code' || flow.flow.active === 'link') {
        if (flow.flow.state === 'choose_method') {
          return { current: 'provide_identifier' }
        }
        return { current: 'method_active', method: flow.flow.active }
      }
      break
    case FlowType.Settings:
      return { current: 'settings' }
    case FlowType.OAuth2Consent:
      return { current: 'method_active', method: 'oauth2_consent' }
  }
  console.warn(
    `[Ory/Elements React] Encountered an unknown form state on ${flow.flowType} flow with ID ${flow.flow.id}`,
  )
  throw new Error('Unknown form state')
}

/**
 * The `useFormStateReducer` hook manages the state of the form based on the flow data.
 *
 * It uses a reducer to handle actions that update the form state, such as selecting an authentication method or updating the flow.
 *
 * @see FormState
 * @see FormStateAction
 * @param flow - The flow container that contains the flow data.
 * @returns a tuple containing the current form state and a dispatch function to update the state.
 */
export function useFormStateReducer(flow: OryFlowContainer) {
  const action = parseStateFromFlow(flow)
  const [selectedMethod, setSelectedMethod] = useState<UiNodeGroupEnum | undefined>()
  const [isRedirecting, setRedirecting] = useState(false)
  const [loadingInputs, setLoadingInputs] = useState<Set<UiNodeGroupEnum>>(new Set())

  const formStateReducer = (state: FormState, action: FormStateAction): FormState => {
    switch (action.type) {
      case 'action_flow_update': {
        if (selectedMethod) {
          setLoadingInputs(new Set())
          return {
            current: 'method_active',
            method: selectedMethod,
            isReady: state.isReady,
            isSubmitting: state.isSubmitting,
          }
        }
        const flowFormState = parseStateFromFlow(action.flow)
        return {
          ...flowFormState,
          isReady: state.isReady,
          isSubmitting: state.isSubmitting,
        }
      }
      case 'action_select_method': {
        setSelectedMethod(action.method)
        return {
          current: 'method_active',
          method: action.method,
          isReady: state.isReady,
          isSubmitting: state.isSubmitting,
        }
      }
      case 'action_clear_active_method': {
        return {
          current: 'select_method',
          isReady: state.isReady,
          isSubmitting: state.isSubmitting,
        }
      }
      case 'form_input_loading':
        setLoadingInputs((prev) => new Set(prev).add(action.group))
        return {
          ...state,
          isReady: false,
          isSubmitting: state.isSubmitting,
        }
      case 'form_input_ready': {
        const newLoadingInputs = new Set(loadingInputs)
        newLoadingInputs.delete(action.input)
        setLoadingInputs(newLoadingInputs)
        return {
          ...state,
          isReady: newLoadingInputs.size === 0,
          isSubmitting: state.isSubmitting,
        }
      }
      case 'form_submit_start':
        return {
          ...state,
          isSubmitting: true,
        }
      case 'form_submit_end':
        return {
          ...state,
          // If we ever dispatched a page redirect, we want to keep the submitting state true
          // This is because the page will redirect/is redirecting to a potentially slow loading external page.
          isSubmitting: isRedirecting,
        }
      case 'page_redirect':
        setRedirecting(true)
        return {
          ...state,
          isSubmitting: true,
        }
    }
    return state
  }

  return useReducer(formStateReducer, {
    ...action,
    isReady: true,
    isSubmitting: false,
  })
}
```

## ory/packages/elements-react/src/context/index.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export { useComponents, useNodeSorter } from './component'
export { useOryFlow, type FlowContextValue, type FlowContainerSetter } from './flow-context'
export * from './provider'

export type {
  FormStateSelectMethod,
  FormStateProvideIdentifier,
  FormStateMethodActive,
  FormState,
  FormStateAction,
} from './form-state'

export {
  useOryConfiguration,
  OryConfigurationProvider,
  type OryElementsConfiguration,
} from './config'
```

## ory/packages/elements-react/src/context/intl-context.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren, useContext } from 'react'
import {
  RawIntlProvider,
  IntlContext,
  IntlShape,
  createIntl,
  IntlCache,
  createIntlCache,
} from 'react-intl'
import { OryLocales } from '..'
import { LocaleMap } from '../locales'

// ISO 639-1 language codes
// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
export const LanguageCodes = [
  'ab',
  'aa',
  'af',
  'sq',
  'am',
  'ar',
  'hy',
  'as',
  'ay',
  'az',
  'ba',
  'eu',
  'bn',
  'dz',
  'bh',
  'bi',
  'br',
  'bg',
  'my',
  'be',
  'km',
  'ca',
  'zh',
  'co',
  'hr',
  'cs',
  'da',
  'nl',
  'en',
  'eo',
  'et',
  'fo',
  'fj',
  'fi',
  'fr',
  'fy',
  'gd',
  'gl',
  'ka',
  'de',
  'el',
  'kl',
  'gn',
  'gu',
  'ha',
  'iw',
  'hi',
  'hu',
  'is',
  'in',
  'ia',
  'ie',
  'ik',
  'ga',
  'it',
  'ja',
  'jw',
  'kn',
  'ks',
  'kk',
  'rw',
  'ky',
  'rn',
  'ko',
  'ku',
  'lo',
  'la',
  'lv',
  'ln',
  'lt',
  'mk',
  'mg',
  'ms',
  'ml',
  'mt',
  'mi',
  'mr',
  'mo',
  'mn',
  'na',
  'ne',
  'no',
  'oc',
  'or',
  'om',
  'ps',
  'fa',
  'pl',
  'pt',
  'pa',
  'qu',
  'rm',
  'ro',
  'ru',
  'sm',
  'sg',
  'sa',
  'sr',
  'sh',
  'st',
  'tn',
  'sn',
  'sd',
  'si',
  'ss',
  'sk',
  'sl',
  'so',
  'es',
  'su',
  'sw',
  'sv',
  'tl',
  'tg',
  'ta',
  'tt',
  'te',
  'th',
  'bo',
  'ti',
  'to',
  'ts',
  'tr',
  'tk',
  'tw',
  'uk',
  'ur',
  'uz',
  'vi',
  'vo',
  'cy',
  'wo',
  'xh',
  'ji',
  'yo',
  'zu',
] as const

export type Locale = keyof typeof OryLocales

export type IntlContextProps = {
  locale: Locale
  customTranslations?: Partial<LocaleMap>
}

function mergeTranslations(locale: Locale, customTranslations: Partial<Record<string, string>>) {
  return Object.keys(customTranslations).reduce((acc, key) => {
    return {
      ...acc,
      [key]: customTranslations[key] ?? OryLocales[locale][key],
    }
  }, OryLocales[locale])
}

export const IntlProvider = ({
  children,
  locale,
  customTranslations,
}: PropsWithChildren<IntlContextProps>) => {
  const existingIntlContext = useContext(IntlContext)
  const messages = mergeTranslations(locale, customTranslations?.[locale] ?? {})

  if (existingIntlContext) {
    // If the original context is available, we assume we're in a nested provider
    // and we should not override the context.
    // This is useful for cases where the parent component already provides an Intl context.
    return children
  }

  const cache: IntlCache = createIntlCache()
  const intl: IntlShape = createIntl({ locale, messages: messages }, cache)

  return <RawIntlProvider value={intl}>{children}</RawIntlProvider>
}
```

## ory/packages/elements-react/src/context/provider.tsx

````tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { PropsWithChildren } from 'react'

import { OryFlowComponents } from '../components'
import { OryClientConfiguration } from '../util'
import { OryErrorHandler, OrySuccessHandler, OryValidationErrorHandler } from '../util/events'
import { OryFlowContainer } from '../util/flowContainer'
import { OryTransientPayload } from '../util/transientPayload'
import { OryComponentProvider } from './component'
import { OryConfigurationProvider } from './config'
import { OryFlowProvider } from './flow-context'
import { IntlProvider } from './intl-context'

/**
 * Props type for the OryProvider component.
 */
export type OryProviderProps = {
  /**
   * The components to use for rendering Ory flows.
   * You can provide custom components to override the default Ory components.
   */
  components: OryFlowComponents
  /**
   * The Ory client configuration.
   * This includes the SDK and project configuration.
   */
  config: OryClientConfiguration
  /**
   * Optional callback invoked on successful flow completion.
   *
   * Use this for session stitching and post-authentication analytics.
   *
   * @example
   * ```tsx
   * <OryProvider
   *   config={config}
   *   flow={flow}
   *   flowType={FlowType.Login}
   *   components={components}
   *   onSuccess={async (event) => {
   *     if (event.flowType === FlowType.Login) {
   *       await mixpanel.identify(event.session.identity.id)
   *     }
   *   }}
   * />
   * ```
   */
  onSuccess?: OrySuccessHandler

  /**
   * Optional callback invoked when the flow returns validation errors.
   *
   * Use this to track form friction in your analytics pipeline.
   *
   * @example
   * ```tsx
   * onValidationError={(event) => {
   *   analytics.track("validation_error", { flow: event.flow.id })
   * }}
   * ```
   */
  onValidationError?: OryValidationErrorHandler

  /**
   * Optional callback invoked when a flow error occurs (expired, security violation, etc.).
   *
   * Use this to track error rates and detect integration issues.
   *
   * @example
   * ```tsx
   * onError={(event) => {
   *   if (event.type === "flow_expired") {
   *     analytics.track("flow_expired", { flowType: event.flowType })
   *   }
   * }}
   * ```
   */
  onError?: OryErrorHandler

  /**
   * Optional transient payload to include in all flow submissions.
   *
   * Accepts a static object or a function that receives form values at
   * submission time and returns the payload. Values are merged with any
   * transient payload fields from UI nodes (e.g., captcha), with
   * user-provided values taking priority.
   *
   * @example
   * ```tsx
   * <OryProvider
   *   config={config}
   *   flow={flow}
   *   flowType={FlowType.Registration}
   *   components={components}
   *   transientPayload={{ locale: "en-US", referral_code: "ABC123" }}
   * />
   * ```
   *
   * @example
   * ```tsx
   * <OryProvider
   *   config={config}
   *   flow={flow}
   *   flowType={FlowType.Registration}
   *   components={components}
   *   transientPayload={(formValues) => ({
   *     signup_method: String(formValues.method ?? "unknown"),
   *   })}
   * />
   * ```
   */
  transientPayload?: OryTransientPayload
} & OryFlowContainer &
  PropsWithChildren

/**
 * OryProvider is a React component that provides the necessary context for rendering Ory flows.
 *
 * It wraps the application in several context providers, including {@link OryConfigurationProvider}.
 *
 * You can use this component to set up the Ory SDK, provide custom translations, and specify the components to use for rendering Ory flows.
 *
 * @example
 * ```tsx
 * import { OryProvider, LoginFlow, OryFlowComponents, OryClientConfiguration } from "@ory/elements-react";
 *
 *
 * export type Props = {
 *   flow: LoginFlow
 *   components: OryFlowComponents
 *   config: OryClientConfiguration
 * }
 *
 * function App({
 *   flow,
 *   config,
 *   children,
 *   components,
 * }: PropsWithChildren<Props>) {
 *   return (
 *     <OryProvider
 *       config={config}
 *       flow={flow}
 *       flowType={FlowType.Login}
 *       components={components}
 *     >
 *       {children}
 *     </OryProvider>
 *   )
 * }
 *
 * ```
 *
 * @param props - The properties for the OryProvider component.
 * @returns
 * @group Components
 */
export function OryProvider({
  children,
  components: Components,
  config,
  onSuccess,
  onValidationError,
  onError,
  transientPayload,
  ...oryFlowProps
}: OryProviderProps) {
  return (
    <OryConfigurationProvider sdk={config.sdk} project={config.project}>
      <IntlProvider
        locale={config.intl?.locale ?? 'en'}
        customTranslations={config.intl?.customTranslations}
      >
        <OryFlowProvider
          {...oryFlowProps}
          onSuccess={onSuccess}
          onValidationError={onValidationError}
          onError={onError}
          transientPayload={transientPayload}
        >
          <OryComponentProvider components={Components}>{children}</OryComponentProvider>
        </OryFlowProvider>
      </IntlProvider>
    </OryConfigurationProvider>
  )
}
````

## ory/packages/elements-react/src/components/card/card-consent.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useOryFlow } from '../../context'
import { OryForm } from '../form'
import { Node } from '../form/nodes/node'
import { OryCard } from './card'
import { OryCardContent } from './content'
import { OryCardFooter } from './footer'
import { OryCardHeader } from './header'
import { getNodeId } from '../../util/sdk-helpers/ui'

/**
 * The `OryConsentCard` component renders a card for displaying the OAuth2 consent flow.
 *
 * @returns The consent card component.
 * @group Components
 */
export function OryConsentCard() {
  const { Form, Card } = useComponents()
  const flow = useOryFlow()
  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryForm>
          <Card.Divider />
          <Form.Group>
            {flow.flow.ui.nodes.map((node) => (
              <Node key={getNodeId(node)} node={node} />
            ))}
          </Form.Group>
          <Card.Divider />
          <OryCardFooter />
        </OryForm>
      </OryCardContent>
    </OryCard>
  )
}
```

## ory/packages/elements-react/src/components/card/card-two-step.tsx

````tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from '@ory/client-fetch'
import { MethodActiveForm } from './two-step/state-method-active'
import { ProvideIdentifierForm } from './two-step/state-provide-identifier'
import { SelectMethodForm } from './two-step/state-select-method'
import { OrySettingsCard, useOryFlow } from '@ory/elements-react'

/**
 * The `OrySelfServiceFlowCard` component is an umbrella component that can render the self-service flows.
 *
 * Note: prefer using the {@link @ory/elements-react/theme!Login | <Login /> component}, etc. directly instead of this component.
 *
 * It renders different forms based on the current flow state, such as providing an identifier,
 * entering a password or one time code or selecting a method for authentication.
 *
 * The component must be use within an {@link OryProvider} that provides the flow context and components to use.
 *
 * @example
 * ```jsx
 * import { OrySelfServiceFlowCard } from "@ory/elements-react";
 *
 * function MyComponent() {
 *  return <OryProvider ...>
 *    <OrySelfServiceFlowCard />
 *  </OryProvider>;
 * }
 * ```
 *
 * @returns The Ory Two-Step Card component that renders different forms based on the current flow state.
 * @group Components
 */
export function OrySelfServiceFlowCard() {
  const { formState, flowType } = useOryFlow()

  if (flowType === FlowType.Settings) {
    return <OrySettingsCard />
  }

  switch (formState.current) {
    case 'provide_identifier':
      return <ProvideIdentifierForm />
    case 'select_method':
      return <SelectMethodForm />
    case 'method_active':
      return <MethodActiveForm formState={formState} />
  }

  return <>unknown form state: {formState.current}</>
}
````

## ory/packages/elements-react/src/components/card/card.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from 'react'
import { useComponents } from '../../context'
import { OryFormProvider } from '../form/form-provider'

/**
 * @interface
 */
export type OryCardRootProps = PropsWithChildren

/**
 * The root component of the Ory Card.
 *
 * This can be used to build fully custom implementations of the Ory Flows.
 *
 * However, you most likely want to override the individual components instead.
 *
 * @param props - pass children to render instead of the default Ory Card components
 * @returns
 * @group Components
 */
export function OryCard({ children }: PropsWithChildren) {
  const { Card } = useComponents()
  return (
    <Card.Root>
      <OryFormProvider>{children}</OryFormProvider>
    </Card.Root>
  )
}
```

## ory/packages/elements-react/src/components/card/content.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { PropsWithChildren } from 'react'
import { useComponents } from '../../context'

/**
 * Props for the OryCardContent component.
 */
export type OryCardContentProps = PropsWithChildren

/**
 * A component that renders the content of the Ory Card.
 * This is the main content of the card, such as the flow's form, with it's input fields and messages.
 *
 * You can use this component to build fully custom implementations of the Ory Flows.
 *
 * However, you most likely want to override the individual components instead.
 *
 * @param props - pass children to render instead of the default Ory Card components
 * @returns
 * @group Components
 */
export function OryCardContent({ children }: OryCardContentProps) {
  const { Card } = useComponents()

  return <Card.Content>{children}</Card.Content>
}
```

## ory/packages/elements-react/src/components/card/footer.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from '../../context'

export type OryCardFooterProps = Record<string, never>

/**
 *
 * @returns The footer of a card component.
 * @group Components
 */
export function OryCardFooter() {
  const { Card } = useComponents()
  return <Card.Footer />
}
```

## ory/packages/elements-react/src/components/card/header.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from '../../context'

export type OryCardHeaderProps = Record<string, never>

/**
 * Returns the header of the Ory Card.
 *
 * @returns The header of the Ory Card.
 * @group Components
 */
export function OryCardHeader() {
  const { Card } = useComponents()
  return <Card.Header />
}
```

## ory/packages/elements-react/src/components/card/index.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryCardHeader, OryCardHeaderProps } from './header'
import { OryCard, OryCardRootProps } from './card'
import { OryCardFooter, OryCardFooterProps } from './footer'
import { OryCardContent, OryCardContentProps } from './content'
import { OrySelfServiceFlowCard } from './card-two-step'
import { OryConsentCard } from './card-consent'

export {
  OryCardHeader,
  OryCard,
  OryCardFooter,
  OryCardContent,
  OrySelfServiceFlowCard,
  OryConsentCard,
}

export type {
  OryCardHeaderProps,
  OryCardRootProps as OryCardProps,
  OryCardFooterProps,
  OryCardContentProps,
}
```

## ory/packages/elements-react/src/components/card/two-step/list-methods.tsx

```tsx
// Copyright © 2025 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents, useOryFlow } from '@ory/elements-react'
import { useFormContext } from 'react-hook-form'
import { UiNodeGroupEnum } from '@ory/client-fetch'
import { isGroupImmediateSubmit } from '../../../theme/default/utils/form'
import { findCodeIdentifierNode } from '../../../util/ui'

type AuthMethodListProps = {
  options: UiNodeGroupEnum[]
  setSelectedGroup: (group: UiNodeGroupEnum) => void
}

export function AuthMethodList({ options, setSelectedGroup }: AuthMethodListProps) {
  const { Card } = useComponents()
  const { setValue, getValues, formState } = useFormContext()
  const { formState: oryFormState, flow } = useOryFlow()

  if (options.length === 0) {
    return null
  }

  const handleClick = (group: UiNodeGroupEnum) => {
    if (isGroupImmediateSubmit(group)) {
      // Required because identifier node is not always defined with code method in aal2
      if (group === 'code' && !getValues('identifier')) {
        const identifier = findCodeIdentifierNode(flow.ui.nodes)
        if (identifier) {
          setValue('identifier', identifier.attributes.value)
        }
      }
      // If the method is "immediate submit" (e.g. the method's submit button should be triggered immediately)
      // then the method needs to be added to the form data.
      setValue('method', group)
    } else {
      setSelectedGroup(group)
    }
  }

  return (
    <Card.AuthMethodListContainer>
      {options.map((group) => (
        <Card.AuthMethodListItem
          key={group}
          group={group}
          onClick={() => handleClick(group)}
          disabled={!formState.isReady || !oryFormState.isReady || formState.isSubmitting}
        />
      ))}
    </Card.AuthMethodListContainer>
  )
}
```

## ory/packages/elements-react/src/components/card/two-step/state-method-active.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeScriptAttributes, UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { useComponents, useNodeSorter, useOryFlow } from '../../../context'
import { FormStateMethodActive } from '../../../context/form-state'
import { useNodeGroupsWithVisibleNodes } from '../../../util/ui'
import { OryForm } from '../../form/form'
import { OryCardValidationMessages } from '../../form/messages'
import { Node } from '../../form/nodes/node'
import { OryCardHeader } from '../header'
import { OryCard, OryCardContent, OryCardFooter } from './../'
import { getFinalNodes, handleAfterFormSubmit } from './utils'

export function MethodActiveForm({ formState }: { formState: FormStateMethodActive }) {
  const { Form } = useComponents()
  const { flow, flowType, dispatchFormState } = useOryFlow()
  const { ui } = flow

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })
  const groupsToShow = useNodeGroupsWithVisibleNodes(ui.nodes)
  const finalNodes = getFinalNodes(groupsToShow, formState.method)

  const allNodes = [
    ...new Set([
      ...ui.nodes.filter(
        (n) =>
          isUiNodeScriptAttributes(n.attributes) ||
          n.group === UiNodeGroupEnum.Default ||
          n.group === UiNodeGroupEnum.Profile,
      ),
      ...finalNodes,
    ]),
  ].sort(sortNodes)

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        <OryForm onAfterSubmit={handleAfterFormSubmit(dispatchFormState)}>
          <Form.Group>
            {allNodes.map((node, k) => (
              <Node node={node} key={k} />
            ))}
          </Form.Group>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}
```

## ory/packages/elements-react/src/components/card/two-step/state-provide-identifier.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { useComponents, useNodeSorter, useOryFlow } from '../../../context'
import { isNodeVisible, withoutSingleSignOnNodes } from '../../../util/ui'
import { OryForm } from '../../form/form'
import { OryCardValidationMessages } from '../../form/messages'
import { Node } from '../../form/nodes/node'
import { OryFormSsoForm } from '../../form/social'
import { OryCardHeader } from '../header'
import { OryCard, OryCardContent, OryCardFooter } from './../'
import { handleAfterFormSubmit } from './utils'

export function ProvideIdentifierForm() {
  const { Form, Card } = useComponents()
  const { flowType, flow, dispatchFormState } = useOryFlow()

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const nonSsoNodes = withoutSingleSignOnNodes(flow.ui.nodes).sort(sortNodes)
  const hasSso = flow.ui.nodes
    .filter(isNodeVisible)
    .some((node) => node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml)
  const showSsoDivider = hasSso && nonSsoNodes.some(isNodeVisible)

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        <OryFormSsoForm />
        <OryForm onAfterSubmit={handleAfterFormSubmit(dispatchFormState)}>
          <Form.Group>
            {showSsoDivider && <Card.Divider />}
            {nonSsoNodes.map((node, k) => (
              <Node node={node} key={k} />
            ))}
          </Form.Group>
        </OryForm>
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}
```

## ory/packages/elements-react/src/components/card/two-step/state-select-method.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeScriptAttributes, UiNode, UiNodeGroupEnum, UiText } from '@ory/client-fetch'
import { useIntl } from 'react-intl'
import { useComponents, useNodeSorter, useOryFlow } from '../../../context'
import { kratosMessages } from '../../../util/i18n/generated/kratosMessages'
import {
  GroupedNodes,
  hasSingleSignOnNodes,
  useFunctionalNodes,
  useNodeGroupsWithVisibleNodes,
} from '../../../util/ui'
import { OryForm } from '../../form/form'
import { OryCardValidationMessages } from '../../form/messages'
import { Node } from '../../form/nodes/node'
import { OryFormSsoForm } from '../../form/social'
import { OryCardHeader } from '../header'
import { OryCard, OryCardContent, OryCardFooter } from './../'
import { AuthMethodList } from './list-methods'
import { handleAfterFormSubmit } from './utils'

/**
 * Converts the visible groups of nodes into a format suitable for the
 * AuthMethodOptions
 *
 * @param visibleGroups - The visible groups of nodes
 */
export function toAuthMethodPickerOptions(visibleGroups: GroupedNodes): UiNodeGroupEnum[] {
  return Object.values(UiNodeGroupEnum)
    .filter((group) => visibleGroups[group]?.length)
    .filter(
      (group) =>
        !(
          [
            UiNodeGroupEnum.Oidc,
            UiNodeGroupEnum.Saml,
            UiNodeGroupEnum.Default,
            UiNodeGroupEnum.IdentifierFirst,
            UiNodeGroupEnum.Profile,
            UiNodeGroupEnum.Captcha,
          ] as UiNodeGroupEnum[]
        ).includes(group),
    )
}

export function SelectMethodForm() {
  const { Form, Card } = useComponents()
  const { flow, flowType, dispatchFormState } = useOryFlow()
  const { ui } = flow

  const nodeSorter = useNodeSorter()
  const sortNodes = (a: UiNode, b: UiNode) => nodeSorter(a, b, { flowType })

  const visibleGroups = useNodeGroupsWithVisibleNodes(ui.nodes)
  const authMethodBlocks = toAuthMethodPickerOptions(visibleGroups)
  const authMethodAdditionalNodes = useFunctionalNodes(ui.nodes)
  // TODO(jonas): rework this (again). The above doesn't work to include the credential nodes and the Captcha nodes behave slightly differently.
  // This is a workaround to include the credential nodes in the auth method blocks.
  const hiddenNodes = ui.nodes.filter(
    (n) =>
      n.group !== UiNodeGroupEnum.Captcha &&
      ((n.attributes.node_type === 'input' && n.attributes.type === 'hidden') ||
        isUiNodeScriptAttributes(n.attributes)),
  )

  return (
    <OryCard>
      <OryCardHeader />
      <OryCardContent>
        <OryCardValidationMessages />
        <OryFormSsoForm />
        {Object.entries(authMethodBlocks).length > 0 ? (
          <OryForm onAfterSubmit={handleAfterFormSubmit(dispatchFormState)}>
            <Form.Group>
              <Card.Divider />
              <AuthMethodList
                options={authMethodBlocks}
                setSelectedGroup={(group) =>
                  dispatchFormState({
                    type: 'action_select_method',
                    method: group,
                  })
                }
              />
              {authMethodAdditionalNodes.sort(sortNodes).map((node, k) => (
                <Node node={node} key={k} />
              ))}
            </Form.Group>
            {hiddenNodes.map((node, k) => (
              <Node node={node} key={k} />
            ))}
          </OryForm>
        ) : (
          !hasSingleSignOnNodes(ui.nodes) && <NoMethodsMessage />
        )}
      </OryCardContent>
      <OryCardFooter />
    </OryCard>
  )
}

function NoMethodsMessage() {
  const intl = useIntl()
  const { Message } = useComponents()

  // This is defined in Ory Kratos as well.
  const noMethods: UiText = {
    id: 5000002,
    text: intl.formatMessage(kratosMessages[5000002]),
    type: 'error',
  }

  return (
    <div data-testid={`ory/form/methods/local`}>
      <Message.Root>
        <Message.Content key={noMethods.id} message={noMethods} />
      </Message.Root>
    </div>
  )
}
```

## ory/packages/elements-react/src/components/card/two-step/utils.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { LoginFlowContainer, RegistrationFlowContainer } from '../../../util/flowContainer'
import { isGroupImmediateSubmit } from '../../../theme/default/utils/form'
import { GroupedNodes, isUiNodeGroupEnum } from '../../../util/ui'
import { Dispatch } from 'react'
import { FormStateAction } from '@ory/elements-react'

function isScreenSelectionNode(node: UiNode) {
  if (
    'name' in node.attributes &&
    node.attributes.name === 'screen' &&
    'value' in node.attributes &&
    node.attributes.value === 'previous'
  ) {
    return true
  }
  if (
    node.group === UiNodeGroupEnum.IdentifierFirst &&
    'name' in node.attributes &&
    node.attributes.name === 'identifier' &&
    node.attributes.type === 'hidden'
  ) {
    return true
  }
  return false
}

export function isChoosingMethod(flow: LoginFlowContainer | RegistrationFlowContainer): boolean {
  if (flow.flowType === FlowType.Login) {
    if (flow.flow.requested_aal === 'aal2') {
      return true
    }
    if (
      flow.flow.refresh &&
      // TODO: Once https://github.com/ory/kratos/issues/4194 is fixed, this can be removed
      // Without this, we show the method chooser, and an email input, which looks weird
      !flow.flow.ui.nodes.some((n) => n.group === 'code')
    ) {
      return true
    }
  }
  return flow.flow.ui.nodes.some(isScreenSelectionNode)
}

export function getFinalNodes(
  uniqueGroups: GroupedNodes,
  selectedGroup: UiNodeGroupEnum | undefined,
): UiNode[] {
  const selectedNodes: UiNode[] = selectedGroup ? (uniqueGroups[selectedGroup] ?? []) : []

  return [
    ...(uniqueGroups?.identifier_first ?? []),
    ...(uniqueGroups?.default ?? []),
    ...(uniqueGroups?.captcha ?? []),
  ]
    .flat()
    .filter((node) => 'type' in node.attributes && node.attributes.type === 'hidden')
    .concat(selectedNodes)
}

export const handleAfterFormSubmit =
  (dispatchFormState: Dispatch<FormStateAction>) => (method: unknown) => {
    if (typeof method !== 'string' || !isUiNodeGroupEnum(method)) {
      return
    }

    if (isGroupImmediateSubmit(method)) {
      dispatchFormState({
        type: 'action_select_method',
        method: method,
      })
    }
  }
```

## ory/packages/elements-react/src/components/form/form-helpers.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, isUiNodeInputAttributes, UiNode } from '@ory/client-fetch'
import { FormValues } from '../../types'
import { OryFlowContainer } from '../../util'

/**
 * Input field names that a `login_hint` can pre-fill, in order of preference.
 * `identifier` is used by login flows, `traits.email` by registration flows.
 */
const prefillIdentifierFields = ['identifier', 'traits.email']

/**
 * Extracts and normalizes a `login_hint` value from a URL query string.
 *
 * The hint is purely a UI convenience: it pre-fills the identifier field so the
 * user does not have to retype a known email. It is never used for routing,
 * method selection, or submission.
 *
 * @param search - A URL query string, with or without a leading `?`.
 * @returns The trimmed hint, or `undefined` when it is absent or empty.
 */
export function getLoginHint(search: string): string | undefined {
  const hint = new URLSearchParams(search).get('login_hint')?.trim()
  return hint ? hint : undefined
}

/**
 * Extracts the query string (including the leading `?`) from a URL string.
 *
 * Implemented as a plain index scan instead of `new URL()` so that relative
 * URLs and malformed values cannot throw.
 *
 * @param url - The URL to extract the query string from.
 * @returns The query string, or an empty string when the URL has none.
 */
function searchOf(url: string | undefined): string {
  if (!url) {
    return ''
  }
  const index = url.indexOf('?')
  return index === -1 ? '' : url.slice(index)
}

/**
 * Resolves the `login_hint` to pre-fill the identifier field with
 * (login and registration flows only).
 *
 * The hint is read from the flow's `request_url` — the raw URL of the request
 * that created the flow at Ory, which preserves arbitrary query parameters
 * (e.g. `/self-service/login/browser?login_hint=...`). The page's own URL
 * cannot carry the hint: Ory redirects to the UI with only the flow ID in the
 * query. When the `request_url` has no hint, the OpenID Connect `login_hint`
 * that a relying party sent on an OAuth2 authorization request (carried in
 * `oauth2_login_request.oidc_context`) is used as a fallback.
 *
 * @param flowContainer - The current flow container.
 * @returns The trimmed hint, or `undefined` when no source provides one.
 */
export function resolveLoginHint(flowContainer: OryFlowContainer): string | undefined {
  if (
    flowContainer.flowType !== FlowType.Login &&
    flowContainer.flowType !== FlowType.Registration
  ) {
    return undefined
  }

  const fromRequestUrl = getLoginHint(searchOf(flowContainer.flow.request_url))
  if (fromRequestUrl) {
    return fromRequestUrl
  }

  const fromOidc = flowContainer.flow.oauth2_login_request?.oidc_context?.login_hint?.trim()
  return fromOidc ? fromOidc : undefined
}

export function computeDefaultValues(
  flow: {
    active?: string
    ui: { nodes: UiNode[] }
  },
  loginHint?: string,
): FormValues {
  const defaults = flow.ui.nodes.reduce<FormValues>((acc, node) => {
    const attrs = node.attributes

    if (isUiNodeInputAttributes(attrs)) {
      // TODO: Kratos should return false for the value here, and not undefined.
      if (attrs.type === 'checkbox' && typeof attrs.value === 'undefined') {
        attrs.value = false
      }
      // Skip the "method" field and "submit" button
      if (attrs.name === 'method' || attrs.type === 'submit') {
        return acc
      }

      if (attrs.name.startsWith('grant_scope')) {
        const scope = attrs.value as string
        if (Array.isArray(acc.grant_scope)) {
          return {
            ...acc,
            // We want to have all scopes accepted by default, so that the user has to actively uncheck them.
            grant_scope: [...acc.grant_scope, scope],
          }
        } else if (!acc.grant_scope) {
          return {
            ...acc,
            grant_scope: [scope],
          }
        }
        // This shouldn't happen, but just so that we don't throw an error.
        return acc
      }

      // Unroll nested traits or assign default values
      return unrollTrait(
        {
          name: attrs.name,
          value: attrs.value ?? '',
        },
        acc,
      )
    }

    return acc
  }, {})

  if (flow.active) {
    defaults.method = flow.active
  }

  prefillIdentifierFromHint(flow.ui.nodes, defaults, loginHint)

  return defaults
}

/**
 * Pre-fills the identifier field with a `login_hint`, without overwriting a
 * value the user already entered or that Kratos echoed back.
 */
function prefillIdentifierFromHint(
  nodes: UiNode[],
  defaults: FormValues,
  loginHint?: string,
): void {
  const hint = loginHint?.trim()
  if (!hint) {
    return
  }

  for (const name of prefillIdentifierFields) {
    const node = nodes.find(
      (n) => isUiNodeInputAttributes(n.attributes) && n.attributes.name === name,
    )
    if (!node || !isUiNodeInputAttributes(node.attributes)) {
      continue
    }
    const current = node.attributes.value
    if (current === undefined || current === null || current === '') {
      // The value type is pinned to FormValues' value type so `defaults` (a
      // FormValues) is an accepted accumulator; inferring it from `hint` alone
      // would narrow the parameter to a string-only record.
      unrollTrait<string, FormValues[string]>({ name, value: hint }, defaults)
      // Seed only the most-preferred empty field. A field that is present but
      // already has a value falls through to the next preference instead.
      return
    }
  }
}

export function unrollTrait<T extends string, V>(
  input: { name: T; value: V },
  output: Partial<UnrollTrait<T, V>> = {},
): UnrollTrait<T, V> {
  const keys = input.name.split('.')

  // It's challenging to type this for deeply nested structures because the shape
  // of current changes dynamically as we navigate through levels.
  // TODO(jonas): This is not ideal. We should be able to type this properly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = output
  keys.forEach((key, index) => {
    if (!key) return
    current = current[key] = index === keys.length - 1 ? input.value : current[key] || {}
  })

  return output as UnrollTrait<T, V>
}

type UnrollTrait<T extends string, V> = T extends `${infer Head}.${infer Tail}`
  ? { [K in Head]: UnrollTrait<Tail, V> }
  : { [K in T]: V }
```

## ory/packages/elements-react/src/components/form/form-provider.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { PropsWithChildren, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useOryFlow } from '../../context'
import { computeDefaultValues, resolveLoginHint } from './form-helpers'
import { useOryFormResolver } from './form-resolver'
import { isNodeVisible } from '../../util/ui'
import { isUiNodeInput } from '../../util'

function pickAutofocusField(nodes: UiNode[]) {
  const node = nodes.find((node) => {
    return (
      isNodeVisible(node) &&
      (node.attributes.type === 'text' ||
        node.attributes.type === 'email' ||
        node.attributes.type === 'password')
    )
  })
  if (!node || !isUiNodeInput(node)) {
    return undefined
  }
  return node.attributes.name
}

export function OryFormProvider({ children, nodes }: PropsWithChildren & { nodes?: UiNode[] }) {
  const flowContainer = useOryFlow()
  const defaultNodes = nodes
    ? flowContainer.flow.ui.nodes
        .filter((node) => node.group === UiNodeGroupEnum.Default)
        .concat(nodes)
    : flowContainer.flow.ui.nodes
  const lastAutofocusField = useRef<string | null>(null)

  // The login_hint pre-fills the identifier field as a UI convenience. It is
  // resolved entirely from the flow (request_url, oidc_context), so it works
  // the same during SSR and on the client.
  const loginHint = resolveLoginHint(flowContainer)

  const methods = useForm({
    // TODO: Generify this, so we have typesafety in the submit handler.
    defaultValues: computeDefaultValues(
      {
        active: flowContainer.flow.active,
        ui: { nodes: defaultNodes },
      },
      loginHint,
    ),
    resolver: useOryFormResolver(),
  })

  useEffect(() => {
    if (!flowContainer.formState.isReady || flowContainer.flowType === FlowType.Settings) {
      return
    }
    const field = pickAutofocusField(defaultNodes)
    if (!field) {
      return
    }

    if (lastAutofocusField.current !== field) {
      lastAutofocusField.current = field
      queueMicrotask(() => {
        methods.setFocus(field, { shouldSelect: true })
      })
    }
  }, [
    flowContainer.formState.isReady,
    flowContainer.flowType,
    methods.setFocus,
    defaultNodes,
    methods,
  ])

  return <FormProvider {...methods}>{children}</FormProvider>
}
```

## ory/packages/elements-react/src/components/form/form-resolver.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useOryFlow } from '../../context'
import { FormValues } from '../../types'
import { isUiNodeInputAttributes } from '@ory/client-fetch'

function isCodeResendRequest(data: FormValues) {
  // There are three types of resend
  return data.email ?? data.resend ?? data.recovery_confirm_address
}

/**
 * Creates a resolver for the Ory form
 *
 * The resolver does form validation for missing fields in the form.
 *
 * @returns a react-hook-form resolver for the Ory form
 */
export function useOryFormResolver() {
  const flowContainer = useOryFlow()

  return (data: FormValues) => {
    if (flowContainer.formState.current === 'method_active') {
      // This is a workaround which prevents the flow from being submitted without a code,
      // which in some cases can cause issues in Ory Kratos' resend detection.
      if (
        // When we submit a code
        data.method === 'code' &&
        // And the code is not present
        !data.code &&
        // And the flow is not a code resend request
        !isCodeResendRequest(data) &&
        // And the flow has a code input node
        flowContainer.flow.ui.nodes.find(({ attributes, group }) => {
          if (!isUiNodeInputAttributes(attributes)) {
            return false
          }

          return group === 'code' && attributes.name === 'code' && attributes.type !== 'hidden'
        })
      ) {
        return {
          values: data,
          errors: {
            // We know the code node exists, so we can safely hardcode the ID.
            code: {
              id: 4000002,
              context: {
                property: 'code',
              },
              type: 'error',
              text: 'Property code is missing',
            },
          },
        }
      }
    }
    return {
      values: data,
      errors: {},
    }
  }
}
```

## ory/packages/elements-react/src/components/form/form.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  isUiNodeAnchorAttributes,
  isUiNodeImageAttributes,
  isUiNodeInputAttributes,
  isUiNodeScriptAttributes,
  UiText,
} from '@ory/client-fetch'
import { ComponentType, PropsWithChildren } from 'react'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useComponents, useOryFlow } from '../../context'
import {
  OryCardAuthMethodListItemProps,
  OryCardLogoProps,
  OryFormGroupProps,
  OryFormRootProps,
  OryFormSectionContentProps,
  OryFormSectionFooterProps,
  OryNodeAnchorProps,
  OryNodeButtonProps,
  OryNodeCaptchaProps,
  OryNodeCheckboxProps,
  OryNodeConsentScopeCheckboxProps,
  OryNodeImageProps,
  OryNodeInputProps,
  OryNodeLabelProps,
  OryNodeSelectProps,
  OryNodeSsoButtonProps,
  OryNodeTextProps,
} from '../../types'
import { OryCardFooterProps } from '../card'
import { OryCardRootProps } from '../card/card'
import { OryCardContentProps } from '../card/content'
import { OryPageHeaderProps } from '../generic'
import { OryCardDividerProps } from '../generic/divider'
import {
  OrySettingsSsoProps,
  OrySettingsPasskeyProps,
  OrySettingsRecoveryCodesProps,
  OrySettingsTotpProps,
  OrySettingsWebauthnProps,
} from '../settings'
import { OryMessageContentProps, OryMessageRootProps } from './messages'
import { OryCardSettingsSectionProps } from './settings-section'
import { OryFormSsoRootProps } from './social'
import { useOryFormSubmit } from './useOryFormSubmit'
import { kratosMessages } from '../../util/i18n/generated/kratosMessages'

/**
 * A record of all the components that are used in the OryForm component.
 */
export type OryFlowComponents = {
  Node: {
    /**
     * Button component, rendered whenever a button is encountered in the Ory UI Nodes.
     */
    Button: ComponentType<OryNodeButtonProps>
    /**
     * The SsoButton component is rendered whenever a button of group "oidc" or "saml" node is encountered.
     *
     * It renders the "Login with Google", "Login with Facebook" etc. buttons.
     */
    SsoButton: ComponentType<OryNodeSsoButtonProps>
    /**
     * Anchor component, rendered whenever an "anchor" node is encountered
     */
    Anchor: ComponentType<OryNodeAnchorProps>
    /**
     * The Input component is rendered whenever a "input" node is encountered.
     */
    Input: ComponentType<OryNodeInputProps>
    /**
     * The Select component is rendered whenever an "input" node declares a
     * non-empty `options` list, typically the result of an `enum` constraint
     * in the identity schema. Optional for backward compatibility: when not
     * provided, the dispatch falls back to the regular `Input` renderer so
     * older consumers that constructed `OryFlowComponents` by hand keep
     * compiling and rendering.
     */
    Select?: ComponentType<OryNodeSelectProps>
    /**
     * Special version of the Input component for OTP codes.
     */
    CodeInput: ComponentType<OryNodeInputProps>
    /**
     * The Image component is rendered whenever an "image" node is encountered.
     *
     * For example used in the "Logo" node.
     */
    Image: ComponentType<OryNodeImageProps>
    /**
     * The Label component is rendered around Input components and is used to render form labels.
     */
    Label: ComponentType<OryNodeLabelProps>
    /**
     * The Checkbox component is rendered whenever an input node with of boolean type is encountered.
     */
    Checkbox: ComponentType<OryNodeCheckboxProps>
    /**
     * The Text component is rendered whenever a "text" node is encountered.
     */
    Text: ComponentType<OryNodeTextProps>
    /**
     * The Captcha component is rendered whenever a "captcha" group is encountered.
     */
    Captcha: ComponentType<OryNodeCaptchaProps>

    /**
     * Special version of the Input component for scopes in OAuth2 flows.
     */
    ConsentScopeCheckbox: ComponentType<OryNodeConsentScopeCheckboxProps>
  }
  Card: {
    /**
     * The card container is the main container of the card.
     */
    Root: ComponentType<OryCardRootProps>
    /**
     * The card footer is the footer of the card container.
     */
    Footer: ComponentType<OryCardFooterProps>
    /**
     * The card header is the header of the card container.
     */
    Header: ComponentType<OryCardRootProps>
    /**
     * The card content is the main content of the card container.
     */
    Content: ComponentType<OryCardContentProps>
    /**
     * The card logo is the logo of the card container.
     */
    Logo: ComponentType<OryCardLogoProps>
    /**
     * The HorizontalDivider component is rendered between groups.
     */
    Divider: ComponentType<OryCardDividerProps>

    /**
     * The AuthMethodListContainer component is rendered around the "method" chooser step in the identifier_first login flow.
     *
     * This is only used, if login is configured to use identifier_first authentication.
     */
    AuthMethodListContainer: ComponentType<PropsWithChildren>
    /**
     * The AuthMethodListItem component is rendered on the "method" chooser step in the identifier_first login flow.
     *
     * This is only used, if login is configured to use identifier_first authentication.
     */
    AuthMethodListItem: ComponentType<OryCardAuthMethodListItemProps>

    /**
     * The SettingsSection component is rendered around each section of the settings.
     */
    SettingsSection: ComponentType<OryCardSettingsSectionProps>
    /**
     * The SettingsSectionContent component is rendered around the content of each section of the settings.
     */
    SettingsSectionContent: ComponentType<OryFormSectionContentProps>
    /**
     * The SettingsSectionFooter component is rendered around the footer of each section of the settings.
     */
    SettingsSectionFooter: ComponentType<OryFormSectionFooterProps>
  }
  Form: {
    /**
     * The FormContainer component is the main container of the form.
     *
     * It should render its children.
     *
     * You most likely don't want to override this component directly.
     */
    Root: ComponentType<OryFormRootProps>
    /**
     * A special form group container for the social buttons.
     *
     * This is required, because the social buttons need to be in its form, to not influence the other form groups.
     *
     * You most likely don't want to override this component directly.
     */
    SsoRoot: ComponentType<OryFormSsoRootProps>

    /**
     * The FormGroup is rendered around each group of nodes in the UI nodes.
     */
    Group: ComponentType<OryFormGroupProps>

    /**
     * The section on the settings page, rendering the OIDC settings
     */
    SsoSettings: ComponentType<OrySettingsSsoProps>

    /**
     * The section on the settings page, rendering the Webauthn settings
     */
    WebauthnSettings: ComponentType<OrySettingsWebauthnProps>

    /**
     * The section on the settings page, rendering the Passkey settings
     */
    PasskeySettings: ComponentType<OrySettingsPasskeyProps>

    /**
     * The section on the settings page, rendering the TOTP settings
     */
    TotpSettings: ComponentType<OrySettingsTotpProps>

    /**
     * The section on the settings page, rendering the recovery code settings
     */
    RecoveryCodesSettings: ComponentType<OrySettingsRecoveryCodesProps>
  }
  Message: {
    /**
     * The MessageContainer is rendered around the messages.
     */
    Root: ComponentType<OryMessageRootProps>

    /**
     * The Message component is rendered whenever a message is encountered.
     */
    Content: ComponentType<OryMessageContentProps>

    /**
     * The Toast component is rendered for toast messages.
     *
     * Currently only used in the settings page to display messages.
     */
    Toast: ComponentType<OryToastProps>
  }
  Page: {
    Header: ComponentType<OryPageHeaderProps>
  }
}
export type OryToastProps = {
  message: UiText
  id: string | number
}

/**
 * Makes the components in OryFlowComponents optional, so that you can override only the components you want to change.
 */
export type OryFlowComponentOverrides = {
  [P in keyof OryFlowComponents]?: OryFlowComponents[P] extends object
    ? { [K in keyof OryFlowComponents[P]]?: OryFlowComponents[P][K] }
    : OryFlowComponents[P]
}

/**
 * The props for the OryForm component.
 * @inline
 * @hidden
 */
export interface OryFormProps extends PropsWithChildren {
  /**
   * A callback function that is called after the form is submitted.
   *
   * It is always called after the form is submitted, unless the form submission is prevented by client side
   * validation or the API response dictated that the client should be redirected
   *
   * @param method - The method that was submitted.
   */
  onAfterSubmit?: (method: string | number | boolean | undefined) => void
}

/**
 * The OryForm component is the main form container for Ory flows.
 *
 * It renders the form with the correct action and method, and handles the submission of the form.
 *
 * @param props - The props for the OryForm component.
 * @returns
 * @group Components
 */
export function OryForm({ children, onAfterSubmit }: OryFormProps) {
  const { Form } = useComponents()
  const flowContainer = useOryFlow()
  const methods = useFormContext()
  const { Message } = useComponents()

  const intl = useIntl()

  const onSubmit = useOryFormSubmit(onAfterSubmit)

  const hasMethods = flowContainer.flow.ui.nodes.some((node) => {
    if (isUiNodeInputAttributes(node.attributes)) {
      if (node.attributes.type === 'hidden') {
        return false
      }
      return node.attributes.name !== 'csrf_token'
    } else if (isUiNodeAnchorAttributes(node.attributes)) {
      return true
    } else if (isUiNodeImageAttributes(node.attributes)) {
      return true
    } else if (isUiNodeScriptAttributes(node.attributes)) {
      return true
    }
    return false
  })

  if (!hasMethods) {
    // This is defined in Ory Kratos as well.
    const m: UiText = {
      id: 5000002,
      text: intl.formatMessage(kratosMessages[5000002]),
      type: 'error',
    }

    return (
      <Message.Root>
        <Message.Content key={m.id} message={m} />
      </Message.Root>
    )
  }

  if (
    (flowContainer.flowType === FlowType.Login ||
      flowContainer.flowType === FlowType.Registration) &&
    flowContainer.formState.current === 'method_active' &&
    flowContainer.formState.method === 'code'
  ) {
    // This is enforced here because method code node is sometimes missing
    methods.setValue('method', 'code')
  }

  return (
    <Form.Root
      action={flowContainer.flow.ui.action}
      method={flowContainer.flow.ui.method}
      onSubmit={(e) => void methods.handleSubmit(onSubmit, console.error)(e)}
    >
      {children}
    </Form.Root>
  )
}
```

## ory/packages/elements-react/src/components/form/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export * from './form'
export * from './messages'
export * from './social'
export * from './settings-section'
export { Node, type NodeProps } from './nodes/node'

export { useResendCode } from './useResendCode'
```

## ory/packages/elements-react/src/components/form/messages.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiText } from '@ory/client-fetch'
import { useComponents, useOryFlow } from '../../context'
import { PropsWithChildren } from 'react'

/**
 * Props for the OryMessageContent component.
 *
 * @interface
 */
export type OryMessageContentProps = {
  /**
   * The message to display.
   */
  message: UiText
}

/**
 *
 * @interface
 * @expand
 */
export type OryMessageRootProps = PropsWithChildren

/**
 * Props for the {@link OryCardValidationMessages} component.
 *
 * @inline
 * @hidden
 */
export interface OryCardValidationMessagesProps {
  /**
   * An array of message IDs that should be hidden.
   * This is useful for hiding specific messages that are not relevant to the user or are rendered elsewhere.
   * If not provided, the default list of message IDs to hide will be used.
   * @default [1040009, 1060003, 1080003, 1010004, 1010014, 1040005, 1010016, 1010003]
   *
   * @see https://www.ory.com/docs/kratos/concepts/ui-messages
   */
  hiddenMessageIds?: number[]
}

/**
 * Renders the {@link OryFlowComponents.Message.Content} component for each message in the current flow.
 *
 * See also {@link useOryFlow}
 * @returns
 * @group Components
 */
export function OryCardValidationMessages({
  hiddenMessageIds = [
    1040009, 1060003, 1080003, 1010004, 1010014, 1010025, 1040005, 1010016, 1010003, 1060004,
    1060005, 1060006,
  ],
}: OryCardValidationMessagesProps) {
  const { flow } = useOryFlow()
  const messages = flow.ui.messages?.filter((m) => !hiddenMessageIds.includes(m.id))
  const { Message } = useComponents()

  if (!messages) {
    return null
  }

  return (
    <Message.Root>
      {messages?.map((message) => (
        <Message.Content key={message.id} message={message} />
      ))}
    </Message.Root>
  )
}
```

## ory/packages/elements-react/src/components/form/nodes/hooks/useInputProps.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeInputAttributes } from '@ory/client-fetch'
import { MouseEventHandler } from 'react'
import { useController } from 'react-hook-form'
import { triggerToWindowCall } from '../../../../util/ui'
import { OryNodeInputInputProps } from '../../../../types'
import { useOryFlow } from '../../../../context'

export function useInputProps(
  attributes: UiNodeInputAttributes,
  placeholder?: string,
): OryNodeInputInputProps {
  const {
    formState: { isSubmitting },
  } = useOryFlow()
  const controller = useController({
    name: attributes.name,
    control: undefined,
    disabled: attributes.disabled,
    shouldUnregister: true,
    // TODO: consider adding rules based on attributes.required, attributes.pattern, etc.
  })
  const handleClick: MouseEventHandler = () => {
    if (attributes.onclickTrigger) {
      triggerToWindowCall(attributes.onclickTrigger)
    }
  }
  return {
    ...controller.field,
    id: attributes.name,
    type: attributes.type,
    onClick: handleClick,
    maxLength: attributes.maxlength,
    autoComplete: attributes.autocomplete,
    placeholder: placeholder || '',
    disabled: attributes.disabled || !controller.formState.isReady || isSubmitting,
  }
}
```

## ory/packages/elements-react/src/components/form/nodes/input.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from '@ory/client-fetch'
import { ReactNode, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { useComponents } from '../../../context'
import { triggerToWindowCall } from '../../../util/ui'
import { UiNodeInput } from '../../../util/utilFixSDKTypesHelper'
import { NodeButton } from './node-button'
import { CheckboxRenderer } from './renderer/checkbox-renderer'
import { ConsentCheckboxRenderer } from './renderer/consent-checkbox-renderer'
import { HiddenInputRenderer } from './renderer/hidden-input-renderer'
import { InputRenderer } from './renderer/input-renderer'
import { SelectRenderer } from './renderer/select-renderer'

export const NodeInput = ({
  node,
  attributes,
}: {
  node: UiNodeInput
  attributes: UiNodeInputAttributes
}): ReactNode => {
  const { setValue } = useFormContext()
  const { Node } = useComponents()

  const {
    onloadTrigger,
    // These properties do not exist on input fields so we remove them (as we already have handled them).
    onclick: _ignoredOnclick,
    onload: _ignoredOnload,
    //
    ...attrs
  } = attributes
  const isResendNode = node.meta.label?.id === 1070008
  const isScreenSelectionNode = 'name' in node.attributes && node.attributes.name === 'screen'

  const setFormValue = () => {
    if (
      attrs.value &&
      !(isResendNode || isScreenSelectionNode || node.group === UiNodeGroupEnum.Oauth2Consent)
    ) {
      setValue(attrs.name, attrs.value)
    }
  }

  const hasRun = useRef(false)
  useEffect(
    () => {
      setFormValue()
      if (!hasRun.current && onloadTrigger) {
        hasRun.current = true
        triggerToWindowCall(onloadTrigger)
      }
    },
    // TODO(jonas): make sure onloadTrigger is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ignore onloadTrigger for now, until we make sure this is stable
    [],
  )

  switch (attributes.type) {
    case UiNodeInputAttributesTypeEnum.Submit:
    case UiNodeInputAttributesTypeEnum.Button: {
      return <NodeButton node={node} />
    }
    case UiNodeInputAttributesTypeEnum.DatetimeLocal:
      throw new Error('Not implemented')
    case UiNodeInputAttributesTypeEnum.Checkbox:
      if (node.group === 'oauth2_consent' && node.attributes.node_type === 'input') {
        switch (node.attributes.name) {
          case 'grant_scope':
            return <ConsentCheckboxRenderer node={node} />
          default:
            return null
        }
      }
      return <CheckboxRenderer node={node} />
    case UiNodeInputAttributesTypeEnum.Hidden:
      return <HiddenInputRenderer node={node} />
    default: {
      // Render as a select only when (a) the input declares enum options and
      // (b) the consumer's component contract actually provides a Select
      // implementation. Falling back to InputRenderer keeps older custom
      // component sets that pre-date Node.Select working.
      const options = node.attributes.options
      if (Array.isArray(options) && options.length > 0 && Node.Select) {
        return <SelectRenderer node={node} />
      }
      return <InputRenderer node={node} />
    }
  }
}
```

## ory/packages/elements-react/src/components/form/nodes/node-button.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNodeGroupEnum } from '@ory/client-fetch'
import { UiNodeInput } from '../../../util/utilFixSDKTypesHelper'
import { NodeRenderer } from './renderer'

type NodeButtonProps = {
  node: UiNodeInput
}
export function NodeButton({ node }: NodeButtonProps) {
  const isResendNode = node.meta.label?.id === 1070008

  const isScreenSelectionNode = 'name' in node.attributes && node.attributes.name === 'screen'

  if (isResendNode || isScreenSelectionNode) {
    return null
  }
  if (node.group === 'oauth2_consent') {
    return null
  }

  const isSocial =
    (node.attributes.name === 'provider' || node.attributes.name === 'link') &&
    (node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml)

  if (isSocial) {
    return <NodeRenderer.SsoButton node={node} />
  }
  return <NodeRenderer.Button node={node} />
}
```

## ory/packages/elements-react/src/components/form/nodes/node.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { ReactNode } from 'react'
import { useComponents } from '../../../context'
import {
  isUiNodeAnchor,
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeScript,
  isUiNodeText,
} from '../../../util/utilFixSDKTypesHelper'
import { NodeInput } from './input'
import { NodeRenderer } from './renderer'

export type NodeProps = {
  node: UiNode
}

// Captcha nodes need to be treated specially, as we use the react turnstile package to render them
const ignoredScriptGroups = ['captcha']

const NodeBase = ({ node }: NodeProps): ReactNode => {
  const { Node } = useComponents()

  // Special case for CAPTCHA handling as we need to render a different component
  if (node.group === UiNodeGroupEnum.Captcha) {
    return <Node.Captcha node={node} />
  }

  if (isUiNodeImage(node)) {
    return <NodeRenderer.Image node={node} />
  } else if (isUiNodeText(node)) {
    return <NodeRenderer.Text node={node} />
  } else if (isUiNodeInput(node)) {
    return <NodeInput node={node} attributes={node.attributes} />
  } else if (isUiNodeAnchor(node)) {
    return <Node.Anchor attributes={node.attributes} node={node} />
  } else if (isUiNodeScript(node) && !ignoredScriptGroups.includes(node.group)) {
    const { crossorigin, referrerpolicy, node_type: _nodeType, ...attributes } = node.attributes

    return (
      <script
        crossOrigin={crossorigin as 'anonymous' | 'use-credentials' | '' | undefined}
        referrerPolicy={referrerpolicy as React.HTMLAttributeReferrerPolicy}
        {...attributes}
      />
    )
  }
  return null
}

/**
 * Use this component to render any UiNode. It will automatically pick the correct sub-component based on the node type and use any custom components provided via the ComponentsContext.
 *
 * Make sure to use this component instead of the custom component directly, to make sure it's integrated properly with the form system.
 *
 * @param props - NodeProps containing the UiNode to render
 * @returns A ReactNode rendering the appropriate component for the given UiNode
 * @group Components
 */
export const Node = Object.assign(NodeBase, NodeRenderer)
```

## ory/packages/elements-react/src/components/form/nodes/renderer/button-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDebounceValue } from 'usehooks-ts'
import { useComponents, useOryFlow } from '../../../../context'
import { OryNodeButtonButtonProps } from '../../../../types'
import { triggerToWindowCall } from '../../../../util/ui'
import { UiNodeInput } from '../../../../util/utilFixSDKTypesHelper'

type ButtonRendererProps = {
  node: UiNodeInput
}

export function ButtonRenderer({ node }: ButtonRendererProps) {
  const { Node } = useComponents()
  const { formState, setValue } = useFormContext()
  const { formState: oryFormState } = useOryFlow()
  const [clicked, setClicked] = useDebounceValue(false, 100)

  const handleClick = useCallback(() => {
    setValue(node.attributes.name, node.attributes.value)
    setClicked(true)
    if (node.attributes.onclickTrigger) {
      triggerToWindowCall(node.attributes.onclickTrigger)
    }
  }, [node.attributes, setValue, setClicked])

  const buttonProps = {
    type: node.attributes.type === 'submit' ? 'submit' : 'button',
    name: node.attributes.name,
    value: node.attributes.value,
    onClick: handleClick,
    disabled:
      node.attributes.disabled ||
      !formState.isReady ||
      !oryFormState.isReady ||
      oryFormState.isSubmitting,
  } satisfies OryNodeButtonButtonProps

  useEffect(() => {
    if (!oryFormState.isSubmitting && clicked) {
      setClicked(false)
    }
  }, [oryFormState.isSubmitting, setClicked, clicked])

  return (
    <Node.Button
      attributes={node.attributes}
      node={node}
      buttonProps={buttonProps}
      isSubmitting={clicked && oryFormState.isSubmitting}
    />
  )
}

/**
 * Renders the component passed for button nodes.
 *
 * @param props - The properties of the button node to render.
 * @returns A React element representing the button node.
 */
export type ButtonRenderer = typeof ButtonRenderer
```

## ory/packages/elements-react/src/components/form/nodes/renderer/checkbox-renderer.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useController } from 'react-hook-form'
import { useComponents } from '../../../../context'
import { OryNodeCheckboxInputProps } from '../../../../types'
import { UiNodeInput } from '../../../../util/utilFixSDKTypesHelper'

type CheckboxRendererProps = {
  node: UiNodeInput
}

export function CheckboxRenderer({ node }: CheckboxRendererProps) {
  const attributes = node.attributes
  const { Node } = useComponents()
  const controller = useController({
    name: attributes.name,
    defaultValue: attributes.value,
    disabled: attributes.disabled,
  })

  const inputProps = {
    ...controller.field,
    type: 'checkbox' as const,
    value: controller.field.value === true ? 'true' : 'false',
    checked: controller.field.value === true,
    disabled: attributes.disabled || !controller.formState.isReady,
  } satisfies OryNodeCheckboxInputProps

  return (
    <Node.Label
      // The label is rendered in the checkbox component
      attributes={{ ...attributes, label: undefined }}
      node={{
        ...node,
        meta: { ...node.meta, label: undefined },
        messages: [],
      }}
      fieldError={controller.fieldState.error}
    >
      <Node.Checkbox
        attributes={attributes}
        node={node}
        inputProps={inputProps}
        onClick={() => {}}
      />
    </Node.Label>
  )
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/consent-checkbox-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useComponents } from '../../../../context'
import { OryNodeConsentScopeCheckboxProps } from '../../../../types'
import { UiNodeInput } from '../../../../util/utilFixSDKTypesHelper'

export function ConsentCheckboxRenderer({ node }: { node: UiNodeInput }) {
  const attributes = node.attributes
  const { Node } = useComponents()
  const { setValue, watch, formState } = useFormContext()
  const scopes = watch('grant_scope')
  const checked = useMemo(() => {
    if (Array.isArray(scopes)) {
      return scopes.includes(attributes.value as string)
    }
    return false
  }, [scopes, attributes.value])

  const handleScopeChange = (checked: boolean) => {
    const scopes = watch('grant_scope')
    if (Array.isArray(scopes)) {
      if (checked) {
        setValue('grant_scope', Array.from(new Set([...scopes, attributes.value])))
      } else {
        setValue(
          'grant_scope',
          scopes.filter((scope: string) => scope !== attributes.value),
        )
      }
    }
  }

  const inputProps = {
    value: attributes.value,
    checked: checked === true,
    disabled: attributes.disabled || !formState.isReady,
    name: attributes.name,
  } satisfies OryNodeConsentScopeCheckboxProps['inputProps']

  return (
    <Node.ConsentScopeCheckbox
      attributes={attributes}
      node={node}
      inputProps={inputProps}
      onCheckedChange={handleScopeChange}
      // onClick={() => {}}
    />
  )
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/hidden-input-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from '../../../../context'
import { UiNodeInput } from '../../../../util/utilFixSDKTypesHelper'
import { useInputProps } from '../hooks/useInputProps'

type HiddenInputRendererProps = {
  node: UiNodeInput
}

export function HiddenInputRenderer({ node }: HiddenInputRendererProps) {
  const { Node } = useComponents()
  const attributes = node.attributes
  const inputProps = useInputProps(attributes)

  return (
    <Node.Input inputProps={inputProps} attributes={attributes} node={node} onClick={() => {}} />
  )
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/image-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from '../../../../context'
import { UiNodeImage } from '../../../../util/utilFixSDKTypesHelper'

type ImageRendererProps = {
  node: UiNodeImage
}

export function ImageRenderer({ node }: ImageRendererProps) {
  const { Node } = useComponents()
  return <Node.Image node={node} attributes={node.attributes} />
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/index.ts

```typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { ButtonRenderer } from './button-renderer'
import { CheckboxRenderer } from './checkbox-renderer'
import { ConsentCheckboxRenderer } from './consent-checkbox-renderer'
import { ImageRenderer } from './image-renderer'
import { InputRenderer } from './input-renderer'
import { SelectRenderer } from './select-renderer'
import { SSOButtonRenderer } from './sso-button-renderer'
import { TextRenderer } from './text-renderer'
export { type ButtonRenderer } from './button-renderer'

export const NodeRenderer = {
  Button: ButtonRenderer,
  SsoButton: SSOButtonRenderer,
  ConsentCheckbox: ConsentCheckboxRenderer,
  Input: InputRenderer,
  Checkbox: CheckboxRenderer,
  Image: ImageRenderer,
  Text: TextRenderer,
  Select: SelectRenderer,
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/input-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from '@ory/client-fetch'
import { useComponents } from '../../../../context'
import { UiNodeInput } from '../../../../util/utilFixSDKTypesHelper'
import { useIntl } from 'react-intl'
import { useFormState } from 'react-hook-form'
import { resolvePlaceholder } from '../../../../util'
import { useInputProps } from '../hooks/useInputProps'

type TextBasedInputProps = {
  node: UiNodeInput
}

export function InputRenderer({ node }: TextBasedInputProps) {
  const { Node } = useComponents()
  const label = getNodeLabel(node)
  const intl = useIntl()
  const formState = useFormState()

  const attributes = node.attributes
  const placeholder = label ? resolvePlaceholder(label, intl) : ''
  const inputProps = useInputProps(attributes, placeholder)
  const isPinCodeInput =
    (attributes.name === 'code' && node.group === 'code') ||
    (attributes.name === 'totp_code' && node.group === 'totp')

  const InputComponent = isPinCodeInput ? Node.CodeInput : Node.Input

  return (
    <Node.Label attributes={attributes} node={node} fieldError={formState.errors[attributes.name]}>
      <InputComponent
        attributes={attributes}
        node={node}
        onClick={inputProps.onClick}
        inputProps={inputProps}
      />
    </Node.Label>
  )
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/select-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { getNodeLabel } from '@ory/client-fetch'
import { useFormState } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useComponents } from '../../../../context'
import { resolvePlaceholder } from '../../../../util'
import { UiNodeInput, UiNodeInputAttributesOption } from '../../../../util/utilFixSDKTypesHelper'
import { useInputProps } from '../hooks/useInputProps'

type SelectRendererProps = {
  node: UiNodeInput
}

export function SelectRenderer({ node }: SelectRendererProps) {
  const { Node } = useComponents()
  const label = getNodeLabel(node)
  const intl = useIntl()
  const formState = useFormState()

  const attributes = node.attributes
  const placeholder = label ? resolvePlaceholder(label, intl) : ''
  const inputProps = useInputProps(attributes, placeholder)
  const options: UiNodeInputAttributesOption[] = attributes.options ?? []

  // Defensive: callers reach SelectRenderer only when input.tsx has already
  // verified Node.Select is wired up, but assert here so a misconfigured
  // component set fails loudly instead of crashing inside React.
  if (!Node.Select) {
    throw new Error(
      '[Ory/Elements React] SelectRenderer was reached without a Node.Select ' +
        "component. Provide one via OryProvider's `components` prop or call " +
        '`getOryComponents()` to inherit the default.',
    )
  }

  return (
    <Node.Label attributes={attributes} node={node} fieldError={formState.errors[attributes.name]}>
      <Node.Select attributes={attributes} node={node} inputProps={inputProps} options={options} />
    </Node.Label>
  )
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/sso-button-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDebounceValue } from 'usehooks-ts'
import { useComponents, useOryFlow } from '../../../../context'
import { OryNodeButtonButtonProps } from '../../../../types'
import { UiNodeInput } from '../../../../util/utilFixSDKTypesHelper'

type SsoButtonProps = {
  node: UiNodeInput
}

export function extractProvider(context: object | undefined): string | undefined {
  if (
    context &&
    typeof context === 'object' &&
    'provider' in context &&
    typeof context.provider === 'string'
  ) {
    return context.provider
  }
  return undefined
}

export function SSOButtonRenderer({ node }: SsoButtonProps) {
  const { Node } = useComponents()
  const attributes = node.attributes

  const { formState: oryFormState } = useOryFlow()

  const {
    setValue,
    formState: { isReady },
  } = useFormContext()
  // Safari cancels form submission events, if we do a state update in the same tick
  // so we delay the state update by 100ms
  const [clicked, setClicked] = useDebounceValue(false, 100)

  useEffect(() => {
    if (!oryFormState.isSubmitting && clicked) {
      setClicked(false)
    }
  }, [oryFormState.isSubmitting, setClicked, clicked])

  const clickHandler = useCallback(() => {
    setValue('provider', attributes.value)
    setValue('method', node.group)
    setClicked(true)
  }, [setValue, attributes.value, node.group, setClicked])

  const buttonProps = {
    type: 'submit',
    name: attributes.name,
    value: attributes.value,
    onClick: clickHandler,
    disabled: attributes.disabled || !isReady || !oryFormState.isReady || oryFormState.isSubmitting,
  } satisfies OryNodeButtonButtonProps
  const provider = extractProvider(node.meta.label?.context) ?? ''

  return (
    <Node.SsoButton
      node={node}
      attributes={attributes}
      buttonProps={buttonProps}
      provider={provider}
      isSubmitting={clicked && oryFormState.isSubmitting}
    />
  )
}
```

## ory/packages/elements-react/src/components/form/nodes/renderer/text-renderer.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from '../../../../context'
import { UiNodeText } from '../../../../util/utilFixSDKTypesHelper'

type TextRendererProps = {
  node: UiNodeText
}

export function TextRenderer({ node }: TextRendererProps) {
  const { Node } = useComponents()
  return <Node.Text node={node} attributes={node.attributes} />
}
```

## ory/packages/elements-react/src/components/form/settings-section.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from '@ory/client-fetch'
import { ComponentPropsWithoutRef, FormEventHandler, PropsWithChildren } from 'react'
import { useFormContext } from 'react-hook-form'
import { useComponents } from '../../context/component'
import { OryFormProvider } from './form-provider'
import { useOryFormSubmit } from './useOryFormSubmit'
import { useOryFlow } from '../../context'

/**
 * Props for the OrySettingsFormSection component.
 * This type extends the form element props but omits the `action`, `method`, and `onSubmit` properties.
 */
export type OrySettingsFormProps = Omit<
  ComponentPropsWithoutRef<'form'>,
  'action' | 'method' | 'onSubmit'
>

/**
 * Props for the OrySettingsFormSection component.
 *
 * @inline
 * @hidden
 */
export interface OryFormSectionProps extends PropsWithChildren, OrySettingsFormProps {
  nodes?: UiNode[]
}

export interface OryCardSettingsSectionProps extends PropsWithChildren {
  action: string
  method: string
  onSubmit: FormEventHandler<HTMLFormElement>
}

/**
 * OrySettingsFormSection is a component that provides a form section for Ory settings.
 *
 * Can be used independently to render a form section with Ory nodes.
 *
 * @param props - The properties for the OrySettingsFormSection component.
 * @returns
 * @group Components
 */
export function OrySettingsFormSection({ children, nodes, ...rest }: OryFormSectionProps) {
  return (
    <OryFormProvider nodes={nodes}>
      <OrySettingsFormSectionInner {...rest}>{children}</OrySettingsFormSectionInner>
    </OryFormProvider>
  )
}

function OrySettingsFormSectionInner({
  children,
  ...rest
}: PropsWithChildren<OrySettingsFormProps>) {
  const { Card } = useComponents()
  const flowContainer = useOryFlow()
  const onSubmit = useOryFormSubmit()
  const methods = useFormContext()

  return (
    <Card.SettingsSection
      action={flowContainer.flow.ui.action}
      method={flowContainer.flow.ui.method}
      onSubmit={(e) => void methods.handleSubmit(onSubmit)(e)}
      {...rest}
    >
      {children}
    </Card.SettingsSection>
  )
}
```

## ory/packages/elements-react/src/components/form/social.test.tsx

```tsx
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType, LoginFlow, UiNode } from '@ory/client-fetch'
import { IntlProvider } from '../../context/intl-context'
import { renderWithOryElements } from '../../tests/jest/test-utils'
import { OryFlowContainer } from '../../util'
import { OryFormSsoButtons } from './social'

const oidcNode = (provider: string): UiNode => ({
  type: 'input',
  group: 'oidc',
  messages: [],
  meta: {
    label: {
      id: 1040002,
      text: `Sign in with ${provider}`,
      type: 'info',
      context: { provider, provider_id: provider },
    },
  },
  attributes: {
    name: 'provider',
    type: 'submit',
    value: provider,
    disabled: false,
    node_type: 'input',
  },
})

function multiProviderFlow(): OryFlowContainer {
  return {
    flowType: FlowType.Login,
    flow: {
      id: 'test-flow',
      type: 'browser',
      expires_at: '2026-01-01T00:00:00.000Z',
      issued_at: '2026-01-01T00:00:00.000Z',
      request_url: 'http://localhost/self-service/login/browser',
      ui: {
        action: 'http://localhost/self-service/login',
        method: 'POST',
        nodes: [oidcNode('google'), oidcNode('discord')],
        messages: [],
      },
    } as unknown as LoginFlow,
  }
}

describe('OryFormSsoButtons', () => {
  let errorSpy: jest.SpyInstance

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    errorSpy.mockRestore()
  })

  test('should render unique React keys for multiple OIDC providers', () => {
    // IntlProvider is required at the call site because the default
    // DefaultButtonSocial theme component calls useIntl(), and the
    // test-utils OryProvider does not install an intl context.
    renderWithOryElements(
      <IntlProvider locale="en">
        <OryFormSsoButtons />
      </IntlProvider>,
      {
        flow: multiProviderFlow(),
      },
    )

    const duplicateKeyWarnings = errorSpy.mock.calls.filter(
      (call) =>
        typeof call[0] === 'string' &&
        call[0].includes('Encountered two children with the same key'),
    )

    expect(duplicateKeyWarnings).toEqual([])
  })
})
```

## ory/packages/elements-react/src/components/form/social.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { getNodeId } from '../../util/sdk-helpers/ui'
import { PropsWithChildren } from 'react'
import { useComponents, useOryFlow } from '../../context'
import { OryForm } from './form'
import { OryFormProvider } from './form-provider'
import { Node } from './nodes/node'

export type OryFormSsoRootProps = PropsWithChildren<{
  nodes: UiNode[]
}>

/**
 * Renders the flow's OIDC buttons.
 *
 * @returns a React component that renders the OIDC buttons.
 * @group Components
 */
export function OryFormSsoButtons() {
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter(
    (node) => node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml,
  )

  const { Form } = useComponents()

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <Form.SsoRoot nodes={filteredNodes}>
      {filteredNodes.map((node) => (
        <Node node={node} key={getNodeId(node)} />
      ))}
    </Form.SsoRoot>
  )
}

/**
 * The `OryFormSsoForm` component renders the Ory Form for SSO methods (OIDC and SAML).
 *
 * It needs to be its own form, as the OIDC buttons are form submits but are not related to the main form.
 *
 * @returns a React component that renders the Ory Form for SSO methods.
 * @group Components
 */
export function OryFormSsoForm() {
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter(
    (node) => node.group === UiNodeGroupEnum.Saml || node.group === UiNodeGroupEnum.Oidc,
  )

  if (filteredNodes.length === 0) {
    return null
  }

  return (
    <OryFormProvider>
      <OryForm data-testid={`ory/form/methods/oidc-saml`}>
        <OryFormSsoButtons />
      </OryForm>
    </OryFormProvider>
  )
}
```

## ory/packages/elements-react/src/components/form/useOryFormSubmit.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import {
  FlowType,
  OnRedirectHandler,
  UiNodeGroupEnum,
  UpdateLoginFlowBody,
  UpdateRecoveryFlowBody,
  UpdateRegistrationFlowBody,
  UpdateSettingsFlowBody,
  UpdateVerificationFlowBody,
} from '@ory/client-fetch'
import { SubmitHandler, useFormContext } from 'react-hook-form'
import { useOryConfiguration, useOryFlow } from '../../context'
import { FormValues } from '../../types'
import { OryFlowContainer } from '../../util'
import { onSubmitLogin } from '../../util/onSubmitLogin'
import { onSubmitRecovery } from '../../util/onSubmitRecovery'
import { onSubmitRegistration } from '../../util/onSubmitRegistration'
import { onSubmitSettings } from '../../util/onSubmitSettings'
import { onSubmitVerification } from '../../util/onSubmitVerification'
import { removeEmptyStrings } from '../../util/removeFalsyValues'
import { resolveTransientPayload } from '../../util/transientPayload'
import { computeDefaultValues } from './form-helpers'

// The "select_account" prompt is supported by the following providers.
// This prompt forces the user to select an account, even if they are already logged in.
// This is useful when the user wants to link an account, for example.
// TODO: this list could likely be extended, but the parameter is poorly documented.
const supportsSelectAccountPrompt = ['google', 'github']

export function useOryFormSubmit(
  onAfterSubmit?: (method: string | number | boolean | undefined) => void,
) {
  const flowContainer = useOryFlow()
  const methods = useFormContext()
  const config = useOryConfiguration()

  const { onSuccess, onValidationError, onError, transientPayload } = flowContainer

  const handleSuccess = (flow: OryFlowContainer) => {
    flowContainer.dispatchFormState({ type: 'form_submit_end' })
    flowContainer.setFlowContainer(flow)
    const newValues = computeDefaultValues(flow.flow)
    methods.reset(newValues, {
      keepSubmitCount: true,
    })
  }

  const onRedirect: OnRedirectHandler = (url, _external) => {
    flowContainer.dispatchFormState({ type: 'page_redirect' })
    window.location.assign(url)
  }

  const mergeTransientPayload = (data: FormValues): Record<string, unknown> | undefined => {
    if (!transientPayload && !data.transient_payload) {
      return undefined
    }

    const existingNodeValues =
      typeof data.transient_payload === 'object' &&
      data.transient_payload &&
      !Array.isArray(data.transient_payload)
        ? (data.transient_payload as unknown as Record<string, unknown>)
        : undefined

    const resolved = resolveTransientPayload(
      transientPayload,
      data,
      existingNodeValues ?? undefined,
    )

    return Object.keys(resolved).length > 0 ? resolved : undefined
  }

  const onSubmit: SubmitHandler<FormValues> = async (initialData) => {
    flowContainer.dispatchFormState({ type: 'form_submit_start' })
    // This is necessary to avoid sending empty strings to the backend, which can cause validation errors.
    // TODO: Kratos could be improved to handle this better, and treat empty strings as missing values.
    try {
      const data = removeEmptyStrings(initialData)
      switch (flowContainer.flowType) {
        case FlowType.Login: {
          const submitData: UpdateLoginFlowBody = {
            ...(data as unknown as UpdateLoginFlowBody),
          }
          if (submitData.method === 'code' && data.code) {
            submitData.resend = ''
          }

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitLogin(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError,
          })
          break
        }
        case FlowType.Registration: {
          const submitData: UpdateRegistrationFlowBody = {
            ...(data as unknown as UpdateRegistrationFlowBody),
          }

          if (submitData.method === 'code' && submitData.code) {
            submitData.resend = ''
          }

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitRegistration(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError,
          })
          break
        }
        case FlowType.Verification: {
          const submitData = {
            ...(data as unknown as UpdateVerificationFlowBody),
          }
          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }
          await onSubmitVerification(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError,
          })
          break
        }
        case FlowType.Recovery: {
          const submitData: UpdateRecoveryFlowBody = {
            ...(data as unknown as UpdateRecoveryFlowBody),
          }
          // TODO: We should probably fix this in Kratos, and give the code priority over the email. However, that would be breaking :(
          if (data.code) {
            submitData.email = ''
          }

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitRecovery(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError,
          })
          break
        }
        case FlowType.Settings: {
          const submitData: UpdateSettingsFlowBody = {
            ...(data as unknown as UpdateSettingsFlowBody),
          }

          if ('totp_unlink' in submitData) {
            submitData.method = 'totp'
          }

          if (
            'lookup_secret_confirm' in submitData ||
            'lookup_secret_reveal' in submitData ||
            'lookup_secret_regenerate' in submitData ||
            'lookup_secret_disable' in submitData
          ) {
            submitData.method = 'lookup_secret'
          }

          // Force the account selection screen on link to provide a better use experience.
          // https://github.com/ory/elements/issues/268
          // TODO: Maybe this needs to be configurable in the configuration
          if (
            submitData.method === UiNodeGroupEnum.Oidc &&
            submitData.link &&
            supportsSelectAccountPrompt.includes(submitData.link)
          ) {
            submitData.upstream_parameters = {
              prompt: 'select_account',
            }
          }

          if ('webauthn_remove' in submitData) {
            submitData.method = 'webauthn'
          }

          if ('passkey_remove' in submitData) {
            submitData.method = 'passkey'
          }

          const mergedTransientPayload = mergeTransientPayload(data)
          if (mergedTransientPayload) {
            Object.assign(submitData, {
              transient_payload: mergedTransientPayload,
            })
          }

          await onSubmitSettings(flowContainer, config, {
            onRedirect,
            setFlowContainer: handleSuccess,
            body: submitData,
            onSuccess,
            onValidationError,
            onError,
          })
          break
        }
        case FlowType.OAuth2Consent: {
          // TODO: move this to a full fleged SDK method?
          const response = await fetch(flowContainer.flow.ui.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const oauth2Success = await response.json()
          if (oauth2Success.redirect_to && typeof oauth2Success.redirect_to === 'string') {
            await onSuccess?.({
              flowType: FlowType.OAuth2Consent,
              consentRequest: flowContainer.flow.consent_request,
            })
            onRedirect(oauth2Success.redirect_to as string, true)
            break
          }
          await onError?.({
            type: 'consent_error',
            flowType: FlowType.OAuth2Consent,
            consentRequest: flowContainer.flow.consent_request,
          })
          throw new Error(
            `[Ory/Elements]: OAuth2 consent flow not completed. This indicates a bug in Ory. Please report this issue to github.com/ory/elements. \nResponse from ${flowContainer.flow.ui.action}: ${JSON.stringify(oauth2Success)}`,
          )
        }
      }
      if ('password' in data) {
        methods.setValue('password', '')
      }
      if ('code' in data) {
        methods.setValue('code', '')
      }
      if ('totp_code' in data) {
        methods.setValue('totp_code', '')
      }
      onAfterSubmit?.(data.method)
    } catch (error) {
      // Fail safe, ensure that the submit state is ended
      // But in practice none of the above methods should throw
      flowContainer.dispatchFormState({ type: 'form_submit_end' })
      throw error
    }
  }

  return onSubmit
}
```

## ory/packages/elements-react/src/components/form/useResendCode.ts

````typescript
// Copyright © 2026 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from '@ory/client-fetch'
import { useOryFlow } from '../../context'
import { useOryFormSubmit } from './useOryFormSubmit'
import { computeDefaultValues } from './form-helpers'
import { FormValues } from '../../types'
import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

function findResendNode(nodes: UiNode[]) {
  return nodes.find(
    (n) =>
      'name' in n.attributes &&
      ((['email', 'recovery_confirm_address'].includes(n.attributes.name) &&
        n.attributes.type === 'submit') ||
        n.attributes.name === 'resend'),
  )
}

/**
 * useResendCode provides a callback to trigger a code resend in the current flow.
 *
 * You may use this hook to implement a "Resend Code" button in your forms.
 *
 * If the current flow does not support code resending, `resendCodeNode` will be `undefined` and `resendCode` will be a no-op.
 *
 * Example:
 * ```tsx
 * const { resendCode, resendCodeNode } = useResendCode();
 *
 * return (
 *  {resendCodeNode && (
 *    <button onClick={resendCode}>Resend Code</button>
 *  )}
 * )
 * ```
 *
 * @returns the callback to trigger a code resend
 * @group Hooks
 */
export function useResendCode() {
  const flowContainer = useOryFlow()
  const { watch } = useFormContext()
  const resendCodeNode = findResendNode(flowContainer.flow.ui.nodes)
  const formSubmit = useOryFormSubmit()
  const [turnstileResponse, setTurnstileResponse] = useState<string | undefined>()

  // This workaround ensures that CAPTCHA response token is also included when resending the code.
  const captchaVerificationValue = watch('transient_payload')?.captcha_turnstile_response as
    string | undefined
  useEffect(() => {
    if (captchaVerificationValue) {
      setTurnstileResponse(captchaVerificationValue)
    }
  }, [captchaVerificationValue])

  const handleResend = useCallback(() => {
    const hiddenFields = flowContainer.flow.ui.nodes
      .filter(
        (n) =>
          n.attributes.node_type === 'input' &&
          (n.attributes.type === 'hidden' || n.group === 'default'),
      )
      .map((n) => {
        if (
          n.attributes.node_type === 'input' &&
          n.attributes.name === 'transient_payload.captcha_turnstile_response' &&
          turnstileResponse
        ) {
          n.attributes.value = turnstileResponse
        }
        return n
      })

    const hiddenData = computeDefaultValues({
      active: flowContainer.flow.active,
      ui: { nodes: hiddenFields },
    })

    if (resendCodeNode?.attributes && 'name' in resendCodeNode.attributes) {
      const data: FormValues = {
        code: undefined,
        [resendCodeNode.attributes.name]: resendCodeNode.attributes.value,
        method: 'code',
      }
      formSubmit({ ...hiddenData, ...data })
    }
  }, [
    flowContainer.flow.active,
    flowContainer.flow.ui.nodes,
    formSubmit,
    resendCodeNode?.attributes,
    turnstileResponse,
  ])

  return {
    resendCode: handleResend,
    resendCodeNode,
  }
}
````

## ory/packages/elements-react/src/components/generic/divider.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from '../../context'
import { useOryFlow } from '../../context'
import { UiNodeGroupEnum } from '@ory/client-fetch'

/**
 * Props type for the Form Group Divider component.
 */
export type OryCardDividerProps = Record<string, never>

/**
 * Renders the {@link OryFlowComponents.Card.Divider} between the groups of nodes in the Ory Form.
 *
 * You can use this component to build fully custom implementations of the Ory Flows.
 *
 * However, you most likely want to override the individual components instead.
 *
 * @returns
 * @group Components
 */
export function OryFormGroupDivider() {
  const { Card } = useComponents()
  const {
    flow: { ui },
  } = useOryFlow()

  // Only get the oidc nodes.
  const filteredNodes = ui.nodes.filter(
    (node) => node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml,
  )

  // Are there other first-factor nodes available?
  const otherNodes = ui.nodes.filter(
    (node) =>
      !(node.group === UiNodeGroupEnum.Oidc || node.group === UiNodeGroupEnum.Saml) &&
      node.group !== 'default',
  )

  if (filteredNodes.length > 0 && otherNodes.length > 0) {
    return <Card.Divider />
  }

  return null
}
```

## ory/packages/elements-react/src/components/generic/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export * from './divider'
export * from './page-header'
```

## ory/packages/elements-react/src/components/generic/page-header.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { useComponents } from '../../context'

export type OryPageHeaderProps = Record<never, never>

/**
 * The OryPageHeader component renders the header of the page.
 *
 * Customize the header by providing a custom {@link OryFlowComponents.Page.Header} component in the `components` prop of the {@link OryProvider}.
 *
 * @returns a React component that renders the page header.
 * @group Components
 */
export const OryPageHeader = () => {
  const { Page } = useComponents()

  return <Page.Header />
}
```

## ory/packages/elements-react/src/components/index.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export * from './card'
export * from './form'
export * from './generic'
export * from './settings'
```

## ory/packages/elements-react/src/components/settings/index.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeButtonButtonProps } from '../../types'
import { UiNodeImage, UiNodeInput, UiNodeText } from '../../util/utilFixSDKTypesHelper'

export * from './settings-card'

export type OrySettingsRecoveryCodesProps = {
  codes: string[]
  regenerateButton: UiNodeInput | undefined
  revealButton: UiNodeInput | undefined
  onRegenerate: () => void
  onReveal: () => void
  isSubmitting: boolean
}

export type OrySettingsTotpProps = {
  totpImage: UiNodeImage | undefined
  totpSecret: UiNodeText | undefined
  totpInput: UiNodeInput | undefined
  totpUnlink: UiNodeInput | undefined
  onUnlink: () => void
  isSubmitting: boolean
}

/**
 * Props for a button used in the settings flow
 */
export type OryNodeSettingsButton = {
  /** @deprecated - use buttonProps.onClick */
  onClick: () => void
  buttonProps: OryNodeButtonButtonProps
} & UiNodeInput

export type OrySettingsSsoProps = {
  linkButtons: OryNodeSettingsButton[]
  unlinkButtons: OryNodeSettingsButton[]
  isSubmitting: boolean
}

export type OrySettingsWebauthnProps = {
  nameInput: UiNodeInput
  triggerButton: OryNodeSettingsButton
  removeButtons: OryNodeSettingsButton[]
  isSubmitting: boolean
}

export type OrySettingsPasskeyProps = {
  triggerButton: OryNodeSettingsButton
  removeButtons: OryNodeSettingsButton[]
  isSubmitting: boolean
}
```

## ory/packages/elements-react/src/components/settings/oidc-settings.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from '@ory/client-fetch'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { OryNodeSettingsButton } from '.'
import { useComponents } from '../../context'
import { settingsCardDescriptions, settingsCardTitles } from '../../util/i18n/settingsCardMessages'
import { isUiNodeInput, UiNodeInput } from '../../util/utilFixSDKTypesHelper'

const getLinkButtons = (nodes: UiNode[]): UiNodeInput[] =>
  nodes
    .filter((node) => 'name' in node.attributes && node.attributes.name === 'link')
    .filter(isUiNodeInput)

const getUnlinkButtons = (nodes: UiNode[]): UiNodeInput[] =>
  nodes
    .filter((node) => 'name' in node.attributes && node.attributes.name === 'unlink')
    .filter(isUiNodeInput)

export interface HeadlessSettingsOidcProps {
  nodes: UiNode[]
}

export function OrySettingsOidc({ nodes }: HeadlessSettingsOidcProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue, formState } = useFormContext()

  const linkButtons: OryNodeSettingsButton[] = getLinkButtons(nodes).map((node) => {
    const clickHandler = function () {
      if (node.attributes.node_type === 'input') {
        setValue('link', node.attributes.value)
        setValue('method', node.group)
      }
    }
    return {
      ...node,
      onClick: clickHandler,
      buttonProps: {
        name: node.attributes.name,
        value: node.attributes.value,
        onClick: clickHandler,
        type: 'submit',
      },
    }
  })

  const unlinkButtons: OryNodeSettingsButton[] = getUnlinkButtons(nodes).map((node) => {
    const clickHandler = function () {
      if (node.attributes.node_type === 'input') {
        setValue('unlink', node.attributes.value)
        setValue('method', node.group)
      }
    }
    return {
      ...node,
      onClick: clickHandler,
      buttonProps: {
        name: node.attributes.name,
        value: node.attributes.value,
        onClick: clickHandler,
        type: 'submit',
      },
    }
  })

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitles.oidc)}
        description={intl.formatMessage(settingsCardDescriptions.oidc)}
      >
        <Form.SsoSettings
          linkButtons={linkButtons}
          unlinkButtons={unlinkButtons}
          isSubmitting={formState.isSubmitting}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({
          id: 'settings.oidc.info',
          defaultMessage:
            'Connected accounts from these providers can be used to login to your account',
        })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
```

## ory/packages/elements-react/src/components/settings/passkey-settings.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from '@ory/client-fetch'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useComponents } from '../../context'
import { triggerToWindowCall } from '../../util/ui'
import { isUiNodeInput, UiNodeInput } from '../../util/utilFixSDKTypesHelper'
import { Node } from '../form/nodes/node'
import { settingsCardDescriptions, settingsCardTitles } from '../../util/i18n/settingsCardMessages'

const getTriggerNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes
    .filter(isUiNodeInput)
    .find(
      (node) => 'name' in node.attributes && node.attributes.name === 'passkey_register_trigger',
    )

const getSettingsNodes = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) =>
      'name' in node.attributes &&
      (node.attributes.name === 'passkey_settings_register' ||
        node.attributes.name === 'passkey_create_data'),
  )

const getRemoveNodes = (nodes: UiNode[]): UiNodeInput[] =>
  nodes
    .filter((node) => 'name' in node.attributes && node.attributes.name === 'passkey_remove')
    .filter(isUiNodeInput)

interface HeadlessSettingsPasskeyProps {
  nodes: UiNode[]
}

export function OrySettingsPasskey({ nodes }: HeadlessSettingsPasskeyProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue, formState } = useFormContext()

  const triggerButton = getTriggerNode(nodes)
  const settingsNodes = getSettingsNodes(nodes)
  const removeNodes = getRemoveNodes(nodes)

  if (!triggerButton) {
    return null
  }

  const {
    onclick: _onClick,
    onclickTrigger,
    ...triggerAttributes
  } = triggerButton.attributes as UiNodeInputAttributes

  const onTriggerClick = () => {
    triggerToWindowCall(onclickTrigger)
  }

  const removePasskeyHandler = (value: string) => {
    return () => {
      setValue('passkey_remove', value)
      setValue('method', 'passkey')
    }
  }

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitles.passkey)}
        description={intl.formatMessage(settingsCardDescriptions.passkey)}
      >
        {settingsNodes.map((node, i) => (
          <Node key={`passkey-settings-nodes-${i}`} node={node} />
        ))}
        <Form.PasskeySettings
          isSubmitting={formState.isSubmitting}
          triggerButton={{
            ...triggerButton,
            onClick: onTriggerClick,
            buttonProps: {
              name: triggerAttributes.name,
              value: triggerAttributes.value,
              onClick: onTriggerClick,
              type: 'button',
            },
          }}
          removeButtons={removeNodes.map((node) => ({
            ...node,
            onClick:
              node.attributes.node_type === 'input'
                ? removePasskeyHandler(node.attributes.value as string)
                : () => {},
            buttonProps: {
              name: node.attributes.name,
              value: node.attributes.value,
              onClick:
                node.attributes.node_type === 'input'
                  ? removePasskeyHandler(node.attributes.value as string)
                  : () => {},
              type: 'button',
            },
          }))}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({
          id: 'settings.passkey.info',
          defaultMessage: 'Manage your passkey settings',
        })}
      ></Card.SettingsSectionFooter>
    </>
  )
}
```

## ory/packages/elements-react/src/components/settings/recovery-codes-settings.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from '@ory/client-fetch'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useComponents } from '../../context'
import {
  isUiNodeInput,
  isUiNodeText,
  UiNodeInput,
  UiNodeText,
} from '../../util/utilFixSDKTypesHelper'
import { Node } from '../form/nodes/node'
import { settingsCardDescriptions, settingsCardTitles } from '../../util/i18n/settingsCardMessages'

const getRegenerateNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      'name' in node.attributes &&
      node.attributes.name === 'lookup_secret_regenerate' &&
      isUiNodeInput(node),
  )

const getRevealNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      'name' in node.attributes &&
      node.attributes.name === 'lookup_secret_reveal' &&
      isUiNodeInput(node),
  )

const getRecoveryCodes = (nodes: UiNode[]): UiNodeText | undefined =>
  nodes.find(
    (node): node is UiNodeText =>
      'id' in node.attributes && node.attributes.id === 'lookup_secret_codes' && isUiNodeText(node),
  )

const getDisableNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      'name' in node.attributes &&
      node.attributes.name === 'lookup_secret_disable' &&
      isUiNodeInput(node),
  )

const getConfirmNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      'name' in node.attributes &&
      node.attributes.name === 'lookup_secret_confirm' &&
      isUiNodeInput(node),
  )

interface HeadlessSettingsRecoveryCodesProps {
  nodes: UiNode[]
}

export function OrySettingsRecoveryCodes({ nodes }: HeadlessSettingsRecoveryCodesProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()

  const codesNode = getRecoveryCodes(nodes)
  const revealNode = getRevealNode(nodes)
  const regenerateNode = getRegenerateNode(nodes)
  const disableNode = getDisableNode(nodes)
  const confirmNode = getConfirmNode(nodes)
  const { setValue, formState } = useFormContext()

  const codesContext =
    (codesNode?.attributes?.text.context as {
      secrets?: { text: string }[]
    }) ?? {}
  const secrets = codesContext.secrets ? codesContext.secrets.map((i) => i.text) : []

  const onRegenerate = () => {
    if (regenerateNode?.attributes.node_type === 'input') {
      setValue(regenerateNode?.attributes.name, 'true')
      setValue('method', 'lookup_secret')
    }
  }

  const onReveal = () => {
    if (revealNode?.attributes.node_type === 'input') {
      setValue(revealNode?.attributes.name, 'true')
      setValue('method', 'lookup_secret')
    }
  }

  const footerNode = disableNode ?? regenerateNode ?? confirmNode

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitles.lookup_secret)}
        description={intl.formatMessage(settingsCardDescriptions.lookup_secret)}
      >
        <Form.RecoveryCodesSettings
          codes={secrets}
          revealButton={revealNode}
          regenerateButton={regenerateNode}
          onRegenerate={onRegenerate}
          onReveal={onReveal}
          isSubmitting={formState.isSubmitting}
        />
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter>
        {footerNode && <Node node={footerNode} />}
      </Card.SettingsSectionFooter>
    </>
  )
}
```

## ory/packages/elements-react/src/components/settings/settings-card.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { isUiNodeScriptAttributes, UiNode, UiNodeGroupEnum } from '@ory/client-fetch'
import { getNodeId } from '../../util/sdk-helpers/ui'
import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { Toaster } from 'sonner'
import { useComponents, useOryFlow } from '../../context'
import {
  settingsCardDescriptionMessage,
  settingsCardTitleMessage,
} from '../../util/i18n/settingsCardMessages'
import { showToast } from '../../util/showToast'
import { useNodesGroups } from '../../util/ui'
import { Node } from '../form/nodes/node'
import { OrySettingsFormSection } from '../form/settings-section'
import { OrySettingsOidc } from './oidc-settings'
import { OrySettingsPasskey } from './passkey-settings'
import { OrySettingsRecoveryCodes } from './recovery-codes-settings'
import { OrySettingsTotp } from './totp-settings'
import { OrySettingsWebauthn } from './webauthn-settings'

type SettingsSectionProps = {
  group: UiNodeGroupEnum
  nodes: UiNode[]
}

function SettingsSectionContent({ group, nodes }: SettingsSectionProps) {
  const { Card } = useComponents()
  const intl = useIntl()
  const { flow } = useOryFlow()
  const groupedNodes = useNodesGroups(flow.ui.nodes, {
    // Script nodes are already handled by the parent component.
    omit: ['script'],
  })

  if (group === UiNodeGroupEnum.Totp) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.totp}
        data-testid="ory/screen/settings/group/totp"
      >
        <OrySettingsTotp nodes={groupedNodes.groups.totp ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.LookupSecret) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.lookup_secret}
        data-testid="ory/screen/settings/group/lookup_secret"
      >
        <OrySettingsRecoveryCodes nodes={groupedNodes.groups.lookup_secret ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Oidc) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.oidc}
        data-testid="ory/screen/settings/group/oidc"
      >
        <OrySettingsOidc nodes={groupedNodes.groups.oidc ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Webauthn) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.webauthn}
        data-testid="ory/screen/settings/group/webauthn"
      >
        <OrySettingsWebauthn nodes={groupedNodes.groups.webauthn ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  if (group === UiNodeGroupEnum.Passkey) {
    return (
      <OrySettingsFormSection
        nodes={groupedNodes.groups.passkey}
        data-testid="ory/screen/settings/group/passkey"
      >
        <OrySettingsPasskey nodes={groupedNodes.groups.passkey ?? []} />
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
      </OrySettingsFormSection>
    )
  }

  return (
    <OrySettingsFormSection nodes={nodes} data-testid={`ory/screen/settings/group/${group}`}>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitleMessage(group))}
        description={intl.formatMessage(settingsCardDescriptionMessage(group))}
      >
        {groupedNodes.groups.default?.map((node) => (
          <Node key={getNodeId(node)} node={node} />
        ))}
        {nodes
          .filter((node) => 'type' in node.attributes && node.attributes.type !== 'submit')
          .map((node) => (
            <Node key={getNodeId(node)} node={node} />
          ))}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter>
        {nodes
          .filter((node) => 'type' in node.attributes && node.attributes.type === 'submit')
          .map((node) => (
            <Node key={getNodeId(node)} node={node} />
          ))}
      </Card.SettingsSectionFooter>
    </OrySettingsFormSection>
  )
}

const onlyScriptNodes = (nodes: UiNode[]): UiNode[] =>
  nodes.filter(
    (node) => isUiNodeScriptAttributes(node.attributes) && node.attributes.id === 'webauthn_script',
  )

/**
 * Renders the Ory Settings Card component.
 *
 * This component is used to display the settings flow for the user.
 * It utilizes the `useOryFlow` hook to access the current flow and renders the nodes with components
 * provided by the Ory Elements context.
 *
 * @returns The Ory Settings Card component that renders the settings flow.
 * @group Components
 */
export function OrySettingsCard() {
  const { flow } = useOryFlow()

  // Script nodes render individually so we don't render blocks for them.
  const uniqueGroups = useNodesGroups(flow.ui.nodes, { omit: ['script'] })
  const scriptNodes = onlyScriptNodes(flow.ui.nodes)

  return (
    <>
      {scriptNodes.map((n) => (
        <Node node={n} key={getNodeId(n)} />
      ))}
      {uniqueGroups.entries.map(([group, nodes]) => {
        if (group === UiNodeGroupEnum.Default) {
          return null
        }

        return <SettingsSectionContent key={group} group={group} nodes={nodes} />
      })}
      <SettingsMessageToaster />
    </>
  )
}

function SettingsMessageToaster() {
  const { flow } = useOryFlow()
  const { Message } = useComponents()

  useEffect(() => {
    if (!flow.ui.messages) {
      return
    }
    flow.ui.messages.forEach((message) => {
      showToast(
        {
          message,
        },
        Message.Toast,
      )
    })
  }, [flow.ui.messages, Message.Toast])

  return <Toaster />
}
```

## ory/packages/elements-react/src/components/settings/totp-settings.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode } from '@ory/client-fetch'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useComponents } from '../../context'
import {
  isUiNodeImage,
  isUiNodeInput,
  isUiNodeText,
  UiNodeImage,
  UiNodeInput,
  UiNodeText,
} from '../../util/utilFixSDKTypesHelper'
import { Node } from '../form/nodes/node'
import { settingsCardDescriptions, settingsCardTitles } from '../../util/i18n/settingsCardMessages'

const getQrCodeNode = (nodes: UiNode[]): UiNodeImage | undefined =>
  nodes.find(
    (node): node is UiNodeImage =>
      'id' in node.attributes && node.attributes.id === 'totp_qr' && isUiNodeImage(node),
  )

const getTotpSecretNode = (nodes: UiNode[]): UiNodeText | undefined =>
  nodes.find<UiNodeText>(
    (node): node is UiNodeText =>
      'id' in node.attributes && node.attributes.id === 'totp_secret_key' && isUiNodeText(node),
  )

const getTotpInputNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      'name' in node.attributes && node.attributes.name === 'totp_code' && isUiNodeInput(node),
  )

const getTotpUnlinkInput = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      'name' in node.attributes && node.attributes.name === 'totp_unlink' && isUiNodeInput(node),
  )

const getTotpLinkButton = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node): node is UiNodeInput =>
      'name' in node.attributes && node.attributes.name === 'method' && isUiNodeInput(node),
  )

type HeadlessSettingsTotpProps = {
  nodes: UiNode[]
}

export function OrySettingsTotp({ nodes }: HeadlessSettingsTotpProps) {
  const { Card, Form } = useComponents()
  const intl = useIntl()
  const { setValue, formState } = useFormContext()

  const totpUnlink = getTotpUnlinkInput(nodes)
  const qrNode = getQrCodeNode(nodes)
  const secretNode = getTotpSecretNode(nodes)
  const totpCodeNode = getTotpInputNode(nodes)
  const totpLinkButton = getTotpLinkButton(nodes)

  const handleUnlink = () => {
    if (totpUnlink?.attributes.node_type === 'input') {
      setValue(totpUnlink.attributes.name, totpUnlink.attributes.value)
      setValue('method', 'totp')
    }
  }

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitles.totp)}
        description={intl.formatMessage(settingsCardDescriptions.totp)}
      >
        {qrNode && secretNode && totpCodeNode && !totpUnlink ? (
          <TotpSettingsLink totpImage={qrNode} totpSecret={secretNode} totpInput={totpCodeNode} />
        ) : (
          <Form.TotpSettings
            totpImage={qrNode}
            totpSecret={secretNode}
            totpInput={undefined}
            totpUnlink={totpUnlink}
            onUnlink={handleUnlink}
            isSubmitting={formState.isSubmitting}
          />
        )}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={
          totpUnlink
            ? intl.formatMessage({
                id: 'settings.totp.info.linked',
                defaultMessage: 'You currently have an authenticator app connected.',
              })
            : intl.formatMessage({
                id: 'settings.totp.info.not-linked',
                defaultMessage:
                  'To enable scan the QR code with your authenticator and enter the code.',
              })
        }
      >
        {totpLinkButton && <Node node={totpLinkButton} />}
      </Card.SettingsSectionFooter>
    </>
  )
}

type TotpSettingsLinkProps = {
  totpImage: UiNodeImage
  totpSecret: UiNodeText
  totpInput: UiNodeInput
}

function TotpSettingsLink({ totpImage, totpSecret, totpInput }: TotpSettingsLinkProps) {
  const { formState } = useFormContext()
  const { Form } = useComponents()
  return (
    <Form.TotpSettings
      totpImage={totpImage}
      totpSecret={totpSecret}
      totpInput={totpInput}
      totpUnlink={undefined}
      onUnlink={() => {}}
      isSubmitting={formState.isSubmitting}
    />
  )
}
```

## ory/packages/elements-react/src/components/settings/webauthn-settings.tsx

```tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { UiNode, UiNodeInputAttributes } from '@ory/client-fetch'
import { useFormContext } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useComponents } from '../../context'
import { settingsCardDescriptions, settingsCardTitles } from '../../util/i18n/settingsCardMessages'
import { triggerToWindowCall } from '../../util/ui'
import { UiNodeInput } from '../../util/utilFixSDKTypesHelper'
import { Node } from '../form/nodes/node'

const getInputNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node) => 'name' in node.attributes && node.attributes.name === 'webauthn_register_displayname',
  ) as UiNodeInput | undefined

const getTriggerNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node) => 'name' in node.attributes && node.attributes.name === 'webauthn_register_trigger',
  ) as UiNodeInput | undefined

const getRemoveButtons = (nodes: UiNode[]): UiNodeInput[] =>
  nodes.filter(
    (node) => 'name' in node.attributes && node.attributes.name === 'webauthn_remove',
  ) as UiNodeInput[]

const getRegisterNode = (nodes: UiNode[]): UiNodeInput | undefined =>
  nodes.find(
    (node) => 'name' in node.attributes && node.attributes.name === 'webauthn_register',
  ) as UiNodeInput | undefined

type HeadlessSettingsWebauthnProps = {
  nodes: UiNode[]
}

export function OrySettingsWebauthn({ nodes }: HeadlessSettingsWebauthnProps) {
  const { Card } = useComponents()
  const intl = useIntl()
  const triggerButton = getTriggerNode(nodes)
  const inputNode = getInputNode(nodes)
  const registerNode = getRegisterNode(nodes)

  if (!inputNode || !triggerButton || inputNode.attributes.node_type !== 'input') {
    return null
  }

  return (
    <>
      <Card.SettingsSectionContent
        title={intl.formatMessage(settingsCardTitles.webauthn)}
        description={intl.formatMessage(settingsCardDescriptions.webauthn)}
      >
        <WebauthnForm inputNode={inputNode} nodes={nodes} triggerButton={triggerButton} />
        {registerNode && <Node node={registerNode} />}
      </Card.SettingsSectionContent>
      <Card.SettingsSectionFooter
        text={intl.formatMessage({
          id: 'settings.webauthn.info',
          defaultMessage:
            'Hardware Tokens are used for second-factor authentication or as first-factor with Passkeys',
        })}
      ></Card.SettingsSectionFooter>
    </>
  )
}

type WebauthnFormProps = {
  inputNode: UiNodeInput
  triggerButton: UiNodeInput
  nodes: UiNode[]
}

function WebauthnForm({ inputNode, triggerButton, nodes }: WebauthnFormProps) {
  const { Form } = useComponents()
  const { setValue, formState } = useFormContext()
  const removeButtons = getRemoveButtons(nodes)

  const {
    onclick: _onClick,
    onclickTrigger,
    ...triggerAttributes
  } = triggerButton.attributes as UiNodeInputAttributes
  const onTriggerClick = () => {
    triggerToWindowCall(onclickTrigger)
  }
  const removeWebauthnKeyHandler = (value: string) => {
    return () => {
      setValue('webauthn_remove', value)
      setValue('method', 'webauthn')
    }
  }
  return (
    <Form.WebauthnSettings
      isSubmitting={formState.isSubmitting}
      nameInput={inputNode}
      triggerButton={{
        ...triggerButton,
        onClick: onTriggerClick,
        buttonProps: {
          name: triggerAttributes.name,
          value: triggerAttributes.value,
          onClick: onTriggerClick,
          type: 'button',
        },
      }}
      removeButtons={removeButtons.map((node) => ({
        ...node,
        onClick:
          node.attributes.node_type === 'input'
            ? removeWebauthnKeyHandler(node.attributes.value as string)
            : () => {},
        buttonProps: {
          name: node.attributes.name,
          value: node.attributes.value,
          onClick:
            node.attributes.node_type === 'input'
              ? removeWebauthnKeyHandler(node.attributes.value as string)
              : () => {},
          type: 'submit',
        },
      }))}
    />
  )
}
```

## ory/packages/elements-react/src/client/config.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

/**
 * This function returns the base URL of the Ory SDK as set by environment variables `NEXT_PUBLIC_ORY_SDK_URL` or `ORY_SDK_URL`.
 */
export function orySdkUrl() {
  let baseUrl

  if (process.env.NEXT_PUBLIC_ORY_SDK_URL) {
    baseUrl = process.env.NEXT_PUBLIC_ORY_SDK_URL
  }

  if (process.env.ORY_SDK_URL) {
    baseUrl = process.env.ORY_SDK_URL
  }

  if (!baseUrl) {
    throw new Error(
      "You need to set environment variable `NEXT_PUBLIC_ORY_SDK_URL` or if you don't use Next.js `ORY_SDK_URL` to your Ory Network SDK URL.",
    )
  }

  return baseUrl.replace(/\/$/, '')
}

/**
 * This function returns whether the current environment is a production environment.
 */
export function isProduction() {
  return ['production', 'prod'].indexOf(process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? '') > -1
}

/**
 * This function returns the Ory SDK URL. If the environment is not production, it tries to guess the SDK URL based on the environment variables, assuming
 * that Ory APIs are proxied through the same domain as the application.
 *
 * Currently, this is only tested for Vercel deployments.
 *
 * @param options - Options for guessing the SDK URL.
 */
export function guessPotentiallyProxiedOrySdkUrl(options?: { knownProxiedUrl?: string }) {
  if (isProduction()) {
    // In production, we use the production custom domain
    return orySdkUrl()
  }

  if (process.env.VERCEL_ENV) {
    // We are in vercel

    // The domain name of the generated deployment URL. Example: *.vercel.app. The value does not include the protocol scheme https://.
    //
    // This is only available for preview deployments on Vercel.
    if (!isProduction() && process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`.replace(/\/$/, '')
    }

    // This is sometimes set by the render server.
    if (process.env.__NEXT_PRIVATE_ORIGIN) {
      return process.env.__NEXT_PRIVATE_ORIGIN.replace(/\/$/, '')
    }
  }

  // Unable to figure out the SDK URL. Either because we are not using Vercel or because we are on a local machine.
  // Let's try to use the window location.
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  if (options?.knownProxiedUrl) {
    return options.knownProxiedUrl
  }

  // We tried everything. Let's use the SDK URL.
  const final = orySdkUrl()
  console.warn(
    `Unable to determine a suitable SDK URL for setting up the Next.js integration of Ory Elements. Will proceed using default Ory SDK URL "${final}". This is likely not what you want for local development and your authentication and login may not work.`,
  )

  return final
}
```

## ory/packages/elements-react/src/client/frontendClient.ts

```typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
'use client'
import { Configuration, ConfigurationParameters, FrontendApi, OAuth2Api } from '@ory/client-fetch'
import { guessPotentiallyProxiedOrySdkUrl } from './config'

export function frontendClient(
  { forceBaseUrl, ...opts }: Partial<ConfigurationParameters & { forceBaseUrl?: string }> = {
    credentials: 'include',
  },
) {
  const basePath =
    forceBaseUrl ??
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: window.location.origin,
    })

  const config = new Configuration({
    ...opts,
    basePath: basePath?.replace(/\/$/, ''),
    credentials: opts.credentials ?? 'include',
    headers: {
      Accept: 'application/json',
      ...opts.headers,
    },
  })
  return new FrontendApi(config)
}

export function oauth2Client(
  { forceBaseUrl, ...opts }: Partial<ConfigurationParameters & { forceBaseUrl?: string }> = {
    credentials: 'include',
  },
) {
  const basePath =
    forceBaseUrl ??
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: window.location.origin,
    })

  const config = new Configuration({
    ...opts,
    basePath: basePath?.replace(/\/$/, ''),
    credentials: opts.credentials ?? 'include',
    headers: {
      Accept: 'application/json',
      ...opts.headers,
    },
  })
  return new OAuth2Api(config)
}
```

## ory/packages/elements-react/src/client/index.ts

```typescript
'use client'
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

export {
  SessionProvider,
  type SessionContextData,
  type SessionProviderProps,
} from './session-provider'
export { useSession } from './useSession'
```

## ory/packages/elements-react/src/client/session-provider.tsx

````tsx
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

'use client'
import { Session } from '@ory/client-fetch'
import { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { frontendClient } from './frontendClient'

type SessionState =
  | {
      session: Session
      state: 'authenticated'
    }
  | {
      state: 'unauthenticated'
    }
  | {
      state: 'error'
      error: Error
    }

/**
 * Holds the session context data.
 * This context is used to provide the session data to the children of the provider.
 * It is used by the {@link useSession} hook to access the session data.
 */
export type SessionContextData = {
  /**
   * Whether the session is currently being loaded
   */
  isLoading: boolean
  /**
   * Whether the session is being loaded for the first time
   * Never true, if a session was passed to the provider
   */
  initialized: boolean
  /**
   * The current session or null if the user is not authenticated or an error occurred,
   * when fetching the session
   */
  session: Session | null
  /**
   * The error that occurred when fetching the session if any
   */
  error: Error | undefined
  /**
   * Refetches the session
   */
  refetch: () => Promise<void>
}

export const SessionContext = createContext<SessionContextData>({
  session: null,
  isLoading: false,
  initialized: false,
  error: undefined,
  refetch: async () => {},
})

export type SessionProviderProps = {
  session?: Session | null
  baseUrl?: string
} & React.PropsWithChildren

/**
 * A provider that fetches the session from the Ory Network and provides it to the children.
 *
 * To use this provider, wrap your application in it:
 *
 * ```tsx
 * import { SessionProvider } from "@ory/elements-react"
 *
 * export default function App() {
 *   return (
 *     <SessionProvider>
 *       <MyApp />
 *     </SessionProvider>
 *   )
 * }
 * ```
 *
 * If you have a session from the server, you can pass it to the provider:
 *
 * ```tsx
 * <SessionProvider session={serverSession}>
 * ```
 *
 * @see {@link useSession}
 * @param props - The provider props
 */
export function SessionProvider({
  session: initialSession,
  children,
  baseUrl,
}: SessionProviderProps) {
  const initialized = useRef(!!initialSession)
  const [isLoading, setLoading] = useState(false)
  const [sessionState, setSessionState] = useState<SessionState | undefined>(() => {
    if (initialSession) {
      return {
        session: initialSession,
        state: initialSession.active ? 'authenticated' : 'unauthenticated',
      }
    }

    return undefined
  })

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true)
      const session = await frontendClient({
        forceBaseUrl: baseUrl,
      }).toSession()

      setSessionState({
        session,
        state: session.active ? 'authenticated' : 'unauthenticated',
      })
    } catch (error) {
      setSessionState({ state: 'error', error: error as Error })
    } finally {
      setLoading(false)
    }
  }, [baseUrl])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      void fetchSession()
    }
  }, [fetchSession])

  return (
    <SessionContext.Provider
      value={{
        error: sessionState?.state === 'error' ? sessionState.error : undefined,
        session: sessionState?.state === 'authenticated' ? sessionState.session : null,
        isLoading,
        initialized: initialized.current,
        refetch: fetchSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
````

## ory/packages/elements-react/src/client/useSession.ts

````typescript
// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
'use client'

import { useContext } from 'react'
import { SessionContext } from './session-provider'

/**
 * A hook to get the current session from the Ory Network.
 *
 * Usage:
 * ```ts
 * const session = useSession()
 *
 * if (session.state == "loading") {
 *  return <div>Loading...</div>
 * }
 *
 * if (session.state == "authenticated") {
 *  return <div>Session: {session.session.id}</div>
 * }
 * ```
 *
 * :::note
 * This is a client-side hook and must be used within a React component.
 * On the server, you can use the getServerSession function from `@ory/nextjs`
 * and hydrate SessionProvider with the session.
 * :::
 *
 * @returns The current session, and error or loading state.
 */

export function useSession() {
  if (!SessionContext) {
    throw new Error('[Ory/Elements] useSession must be used on the client')
  }
  return useContext(SessionContext)
}
````
