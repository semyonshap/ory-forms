import * as client from "openid-client";
import { NextRequest, NextResponse } from "next/server";
import { getOidcClient } from "../app/client";
import type { OidcSession } from "../types";
import { SESSION_COOKIE_NAME } from "../types";
import { getLogger } from "@/lib/logger";
import { oidcConfig } from "@/lib/oidc";

const log = getLogger(["oidc", "revoke"]);

export async function handleRevoke(
  req: NextRequest,
  postLogoutRedirectTo?: string,
): Promise<NextResponse> {
  const config = await getOidcClient(oidcConfig);

  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  let session: OidcSession | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(sessionCookie) as OidcSession;
    } catch {
      // Malformed session — proceed to clear it anyway
    }
  }

  // Revoke tokens if available
  if (session) {
    const tokenToRevoke = session.refreshToken ?? session.accessToken;

    try {
      await client.tokenRevocation(config, tokenToRevoke);
    } catch (err) {
      // Non-fatal: provider may not support revocation, or token expired
      log.warn("[OIDC] Token revocation failed (non-fatal):", { err });
    }
  }

  const postLogoutUri =
    postLogoutRedirectTo ??
    oidcConfig.postLogoutRedirectUri ??
    new URL("/", req.url).href;

  // Attempt RP-initiated logout if the provider supports end_session_endpoint
  let logoutUrl: string | null = null;

  try {
    const endSessionParams: Record<string, string> = {
      post_logout_redirect_uri: postLogoutUri,
    };
    if (session?.idToken) {
      endSessionParams.id_token_hint = session.idToken;
    }
    const endSessionUrl = client.buildEndSessionUrl(config, endSessionParams);
    logoutUrl = endSessionUrl.href;
  } catch {
    // Provider doesn't support end_session_endpoint — fall back to local logout
  }

  const redirectTarget = logoutUrl ?? postLogoutUri;
  const response = NextResponse.redirect(redirectTarget);

  // Clear session cookie
  response.cookies.delete(SESSION_COOKIE_NAME);

  return response;
}
