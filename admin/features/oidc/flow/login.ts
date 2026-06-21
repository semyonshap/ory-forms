import * as client from "openid-client";
import { NextResponse } from "next/server";
import { getOidcClient } from "../app/client";
import { setStateCookie } from "../utils/cookie";
import { oidcConfig } from "@/lib/oidc";

export async function handleLogin(): Promise<NextResponse> {
  const config = await getOidcClient(oidcConfig);
  const state = client.randomState();

  const authorizationUrl = client.buildAuthorizationUrl(config, {
    redirect_uri: oidcConfig.redirectUri,
    scope: (oidcConfig.scopes ?? ["openid", "profile", "email"]).join(" "),
    state,
  });

  const response = NextResponse.redirect(authorizationUrl);

  setStateCookie(response, state, 60 * 10); // 10 minutes

  return response;
}
