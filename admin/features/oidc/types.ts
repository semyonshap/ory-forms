export interface OidcConfig {
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes?: string[];
  postLogoutRedirectUri?: string;
}

export interface OidcSession {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresAt: number;
  user: OidcUser;
}

export interface OidcUser {
  sub: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface OidcCallbackParams {
  code: string;
  state: string;
}

export const SESSION_COOKIE_NAME = "oidc_session";
export const STATE_COOKIE_NAME = "oidc_state";
export const CODE_VERIFIER_COOKIE_NAME = "oidc_code_verifier";