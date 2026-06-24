import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
  OAuth2Api,
} from "@ory/client-fetch";
import { guessPotentiallyProxiedOrySdkUrl } from "./config";
import { hydraAdminUrl } from "@/features/ory-elements/client/config";

function createBaseConfig(
  opts: Partial<ConfigurationParameters & { forceBaseUrl?: string }> = {
    credentials: "include",
  },
): Configuration {
  const { forceBaseUrl, ...restOpts } = opts;
  const basePath =
    forceBaseUrl ??
    guessPotentiallyProxiedOrySdkUrl({
      knownProxiedUrl: window.location.origin,
    });

  return new Configuration({
    ...restOpts,
    basePath: basePath?.replace(/\/$/, ""),
    credentials: restOpts.credentials ?? "include",
    headers: {
      Accept: "application/json",
      ...restOpts.headers,
    },
  });
}

export function frontendClient(
  opts?: Partial<ConfigurationParameters & { forceBaseUrl?: string }>,
): FrontendApi {
  const config = createBaseConfig(opts);
  return new FrontendApi(config);
}

export function oauth2Client(
  opts?: Partial<ConfigurationParameters & { forceBaseUrl?: string }>,
): OAuth2Api {
  const config = createBaseConfig({
    ...opts,
    forceBaseUrl: opts?.forceBaseUrl ?? hydraAdminUrl(),
  });
  return new OAuth2Api(config);
}
