# @ory-forms/react

## 1.2.0

### Minor Changes

- e1dd0d8: Add useStoreClient hook
- e1dd0d8: Pass store into every wrapper component
- e1dd0d8: Pass children into every wrapper component
- e1dd0d8: Export WrapperProps
- 4e63bf9: Add onSubmitOAuth2Logout
- 4e63bf9: Add OAuth2LogoutFlowContainer
- 4e63bf9: Add OAuth2LogoutFlowResponse
- 4e63bf9: Add UpdateOAuth2LogoutFlowBody
- 4e63bf9: Add OryLogoutSuccessEvent
- 4e63bf9: Add logout form state
- 4e63bf9: Add logout header
- 455cd3c: Add OryFrontendApi with consent and logout custom-service methods
- 455cd3c: Add handleOAuth2FlowError
- 455cd3c: Add redirect handling for OAuth2 flows
- 3d899c7: Move extraNodes to setExtraNodes config callback
- 3d899c7: Export SetExtraNodes
- 9409d84: Use NEXT_PUBLIC_ORY_SDK_URL in computeSdkConfig

## 1.1.0

### Minor Changes

- bbd9503: Add captcha support
- bbd9503: Refactor oryStore to zustand
- 33049a4: Add zod resolver
- 33049a4: Add passkey & WebAuthn support
- 33049a4: Add status to server session
- 33049a4: Add global messages to oryStore
- 33049a4: Add style in data input
- 330aa5e: Add transientPayload input
- 330aa5e: Add hidden input for transientPayload
- 330aa5e: Add useAnchor hook
- 330aa5e: Add WebAuthn loader
- cfdd82b: Add useFormNodes hook
- cfdd82b: Add useFormState hook
- cfdd82b: Add isSubmitting state to form state
- cfdd82b: Filter inputs by method in resolver
- 03c42fc: Add transient field
- 7e4e71e: Add locales & parameters for all inputs
- 4523636: Integrate translation parameters
- 50594ee: Add success screen for verification flow

### Patch Changes

- 33049a4: Fix default value for totp_secret_key
- 330aa5e: Fix settings resolver with different groups
- 03c42fc: Fix multiple bugs with form
- 3c381cd: Remove console.log in production build
- 4cb33eb: Remove peer deps

## 1.0.0

### Major Changes

- first publish packages
