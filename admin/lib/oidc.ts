import { OidcConfig } from "@/features/oidc";

export const oidcConfig: OidcConfig = {
  issuer: process.env.OIDC_ISSUER!,
  clientId: process.env.OIDC_CLIENT_ID!,
  clientSecret: process.env.OIDC_CLIENT_SECRET!,
	redirectUri: process.env.OIDC_REDIRECT_URI!,
	scopes: ["openid", "profile", "email", "offline_access"],
	postLogoutRedirectUri: process.env.OIDC_POST_LOGOUT_REDIRECT_URI!,
};
