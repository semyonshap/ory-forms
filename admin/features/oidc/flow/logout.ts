import * as client from "openid-client";
import { NextRequest, NextResponse } from "next/server";
import { getOidcClient } from "../app/client";
import { getSessionFromRequest, clearSessionCookie } from "../utils/cookie";
import { getLogger } from "@/lib/logger";
import { oidcConfig } from "@/lib/oidc";

const log = getLogger(["oidc", "logout"]);

export async function handleLogout(
  req: NextRequest,
  postLogoutRedirectTo?: string,
): Promise<NextResponse> {
  const config = await getOidcClient(oidcConfig);

  // Get current session from request
  const session = getSessionFromRequest(req);

  // Determine where to redirect after logout
  const postLogoutUri =
    postLogoutRedirectTo ??
    oidcConfig.postLogoutRedirectUri ??
    new URL("/", req.url).href;

  let logoutUrl: string | null = null;

  // Try to perform RP-Initiated Logout if provider supports it
  if (session?.idToken) {
    try {
      const endSessionUrl = client.buildEndSessionUrl(config, {
        post_logout_redirect_uri: postLogoutUri,
        id_token_hint: session.idToken,
      });
      logoutUrl = endSessionUrl.href;
    } catch (err) {
      // Provider doesn't support end_session_endpoint or error occurred
      log.debug("end_session_endpoint not supported", { err });
    }
  }

  // Create response — redirect to provider's logout page or directly to app
  const redirectTarget = logoutUrl ?? postLogoutUri;
  const response = NextResponse.redirect(redirectTarget);

  // Clear local session cookie
  clearSessionCookie(response);

  return response;
}
