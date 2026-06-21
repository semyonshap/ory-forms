import * as client from "openid-client";
import { NextRequest, NextResponse } from "next/server";
import { getOidcClient } from "../app/client";
import type { OidcSession } from "../types";
import { getSessionFromRequest, setSessionCookie } from "../utils/cookie";
import { getLogger } from "@/lib/logger";
import { oidcConfig } from "@/lib/oidc";

const log = getLogger(["oidc", "refresh"]);

/**
 * Refreshes the access token using the refresh token.
 * Automatically updates the session cookie and returns appropriate NextResponse.
 */
export async function handleRefresh(req: NextRequest): Promise<NextResponse> {
  const config = await getOidcClient(oidcConfig);

  // Get current session from request
  const session = getSessionFromRequest(req);

  if (!session) {
    log.warn("No session found for refresh");
    return NextResponse.json({ error: "No session found" }, { status: 401 });
  }

  // Check if we have a refresh token
  if (!session.refreshToken) {
    log.warn("No refresh token available");
    return NextResponse.json(
      { error: "No refresh token available" },
      { status: 401 },
    );
  }

  try {
    // Perform the refresh
    const tokenSet = await client.refreshTokenGrant(
      config,
      session.refreshToken,
    );

    // Update session with new tokens
    const updatedSession: OidcSession = {
      ...session,
      accessToken: tokenSet.access_token,
      // Some providers issue a new refresh token on each refresh
      refreshToken: tokenSet.refresh_token ?? session.refreshToken,
      // Update expiry if provided (convert to seconds)
      expiresAt: tokenSet.expires_in
        ? Math.floor(Date.now() / 1000) + tokenSet.expires_in
        : session.expiresAt,
    };

    // Also update id_token if a new one is issued (rare for refresh)
    if (tokenSet.id_token) {
      updatedSession.idToken = tokenSet.id_token;
    }

    log.info("Tokens refreshed successfully");

    // Create response with updated session cookie
    const response = NextResponse.json({
      success: true,
      expiresAt: updatedSession.expiresAt,
    });

    setSessionCookie(response, updatedSession);

    return response;
  } catch (err) {
    log.error("Token refresh failed:", { err });

    const error = err as any;

    if (
      error?.error === "invalid_grant" ||
      error?.message?.includes("invalid_grant")
    ) {
      return NextResponse.json(
        { error: "Refresh token expired or invalid", requiresLogin: true },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Refresh failed", details: error?.message },
      { status: 500 },
    );
  }
}
