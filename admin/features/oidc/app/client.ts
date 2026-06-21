import * as client from "openid-client";
import type { OidcConfig } from "../types";

let _config: client.Configuration | null = null;
let _oidcConfig: OidcConfig | null = null;

/**
 * Initializes and caches the openid-client Configuration.
 * Performs OIDC Discovery against the issuer.
 */
export async function getOidcClient(
  oidcConfig: OidcConfig,
): Promise<client.Configuration> {
  // Return cached instance if config hasn't changed
  if (_config && _oidcConfig?.issuer === oidcConfig.issuer) {
    return _config;
  }

  const issuerUrl = new URL(oidcConfig.issuer);

  const options: client.DiscoveryRequestOptions = {};
  if (process.env.NODE_ENV !== "production") {
    options.execute = [client.allowInsecureRequests];
  }

  _config = await client.discovery(
    issuerUrl,
    oidcConfig.clientId,
    oidcConfig.clientSecret,
    undefined,
    options,
  );

  _oidcConfig = oidcConfig;
  return _config;
}
