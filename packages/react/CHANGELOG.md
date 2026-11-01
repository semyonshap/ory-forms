# @ory-forms/react

## 1.2.0

### Minor Changes

- feat: add `useStoreClient` hook
- feat: pass `store` into every wrapper component
- feat: pass `children` into every wrapper component
- feat: export `WrapperProps`
- feat: add `onSubmitOAuth2Logout`
- feat: add `OAuth2LogoutFlowContainer`
- feat: add `OAuth2LogoutFlowResponse`
- feat: add `UpdateOAuth2LogoutFlowBody`
- feat: add `OryLogoutSuccessEvent`
- feat: add logout form state
- feat: add logout header
- feat: add `OryFrontendApi` with consent and logout custom-service methods
- feat: add `handleOAuth2FlowError`
- feat: add redirect handling for OAuth2 flows
- feat: export `SetExtraNodes`
- refactor!: move `extraNodes` to the `setExtraNodes` config callback

### Patch Changes

- fix: use `NEXT_PUBLIC_ORY_SDK_URL` in `computeSdkConfig`

## 1.1.0

### Minor Changes

- feat: add captcha support
- feat: add zod resolver
- feat: add passkey & WebAuthn support
- feat: add status to server session
- feat: add global messages to `oryStore`
- feat: add style in data input
- feat: add `transientPayload` input
- feat: add hidden input for `transientPayload`
- feat: add `useAnchor` hook
- feat: add WebAuthn loader
- feat: add `useFormNodes` hook
- feat: add `useFormState` hook
- feat: add `isSubmitting` state to form state
- feat: add transient field
- feat: add locales & parameters for all inputs
- feat: integrate translation parameters
- feat: add success screen for verification flow
- refactor: rewrite `oryStore` on zustand

### Patch Changes

- fix: filter inputs by method in resolver
- fix: default value for `totp_secret_key`
- fix: settings resolver with different groups
- fix: multiple bugs with form
- chore: remove `console.log` in production build
- chore: remove peer deps

## 1.0.0

### Major Changes

- chore: first publish of packages
