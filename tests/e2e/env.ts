const appProtocol = process.env.E2E_APP_PROTOCOL ?? 'myapp'

export const env = {
  authUrl: process.env.E2E_AUTH_URL ?? 'http://localhost:8080',
  hydraPublicUrl:
    process.env.E2E_HYDRA_PUBLIC_URL ?? 'http://localhost:4444',
  hydraAdminUrl:
    process.env.E2E_HYDRA_ADMIN_URL ?? 'http://localhost:4445',
  kratosPublicUrl:
    process.env.E2E_KRATOS_PUBLIC_URL ?? 'http://localhost:4433',
  kratosAdminUrl:
    process.env.E2E_KRATOS_ADMIN_URL ?? 'http://localhost:4434',

  appProtocol,
  appProtocolCallback: `${appProtocol}://oauth/callback`,
  scope: 'openid email profile offline',

  identity: {
    username: process.env.E2E_IDENTITY_USERNAME ?? 'e2e.user',
    email: process.env.E2E_IDENTITY_EMAIL ?? 'e2e@example.com',
    password: process.env.E2E_IDENTITY_PASSWORD ?? 'e2e-password',
    firstName: 'E2E',
    lastName: 'User',
  },
}
