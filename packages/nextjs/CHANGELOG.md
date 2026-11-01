# @ory-forms/nextjs

## 1.1.0

### Minor Changes

- feat: add `customRoutes` to `createOryMiddleware`
- feat: add method and auth checks for custom routes
- feat: add built-in consent custom route
- feat: add built-in logout custom route
- feat: add `buildConsentFlow`
- feat: add `buildLogoutFlow`
- feat: add `UiMessage` type
- feat: add `options` argument to `getFlowFactory`
- feat: add `disableRewrite` option to `getFlowFactory`
- feat: add `orySdkPublicUrl`
- feat: export `buildJsonResponse`
- feat: export `OryMiddlewareOptions`
- feat: add `cookie` argument to `getServerSession`
- feat: add 401 response for unauthorized custom routes
- fix: support `ORY_SDK_URL` fallback in `orySdkUrl`
- refactor!: rename `oauth2_concent` route to `oauth2_consent`
- refactor!: remove `verify` custom route

## 1.0.0

### Major Changes

- chore: first publish of packages
