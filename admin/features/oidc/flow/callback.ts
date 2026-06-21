import * as client from "openid-client";
import { NextRequest, NextResponse } from "next/server";
import { getOidcClient } from "../app/client";
import type { OidcSession } from "../types";
import {
  setSessionCookie,
  clearStateCookie,
  getStateFromRequest,
} from "../utils/cookie";
import { getLogger } from "@/lib/logger";
import { oidcConfig } from "@/lib/oidc";

const log = getLogger(["oidc", "callback"]);

export async function handleCallback(
  req: NextRequest,
  redirectTo = "/",
): Promise<NextResponse> {
  const config = await getOidcClient(oidcConfig);
  const storedState = getStateFromRequest(req);

  if (!storedState) {
    return NextResponse.json(
      { error: "Missing state cookie" },
      { status: 400 },
    );
  }

  try {
    // Обмен code на токены
    const currentUrl = new URL(req.url);
    const tokens = await client.authorizationCodeGrant(
      config,
      currentUrl,
      { expectedState: storedState },
      { redirect_uri: oidcConfig.redirectUri },
    );

    const claims = tokens.claims();

    const userinfo = await client.fetchUserInfo(
      config,
      tokens.access_token,
      claims?.sub ?? "",
    );

    const session: OidcSession = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      idToken: tokens.id_token,
      expiresAt: Math.floor(Date.now() / 1000) + (tokens.expires_in ?? 3600),
      user: {
        ...userinfo,
        email: userinfo.email as string | undefined,
        name: userinfo.name as string | undefined,
      },
    };

    const response = NextResponse.redirect(new URL(redirectTo, req.url));

    // Set session cookie using utility
    setSessionCookie(response, session, 60 * 60 * 8);

    // Clear state cookie
    clearStateCookie(response);

    return response;
  } catch (err) {
    log.error("[OIDC] Callback error:", { err });
    return NextResponse.json(
      { error: "Authentication failed", details: String(err) },
      { status: 400 },
    );
  }
}
