import {
  Configuration,
  ConfigurationParameters,
  FrontendApi,
  OAuth2Api,
} from "@ory/client-fetch"

type ClientOptions = Partial<ConfigurationParameters & { forceBaseUrl?: string }>


export function orySdkUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_ORY_SDK_URL

  if (!baseUrl) {
    throw new Error(
      "You need to set environment variable `NEXT_PUBLIC_ORY_SDK_URL` to your Ory Network SDK URL.",
    )
  }

  return baseUrl.replace(/\/$/, "")
}

function createClient<T>(
  ApiClass: new (config: Configuration) => T,
  { forceBaseUrl, ...opts }: ClientOptions = { credentials: "include" },
): T {
  const basePath =
    forceBaseUrl ?? orySdkUrl()

  return new ApiClass(
    new Configuration({
      ...opts,
      basePath: basePath?.replace(/\/$/, ""),
      credentials: opts.credentials ?? "include",
      headers: {
        Accept: "application/json",
        ...opts.headers,
      },
    }),
  )
}

export const frontendClient = (opts?: ClientOptions) =>
  createClient(FrontendApi, opts)

export const oauth2Client = (opts?: ClientOptions) =>
  createClient(OAuth2Api, opts)