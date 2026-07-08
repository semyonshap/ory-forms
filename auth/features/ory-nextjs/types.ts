import { OAuth2ConsentRequest, UiContainer } from "@ory/client-fetch"

export type QueryParams = { [key: string]: string | string[] | undefined }

export const initOverrides: RequestInit = {
  cache: "no-cache",
}

export type FlowParams = {
  id: string
  cookie: string | undefined
  return_to: string
}

export type ConsentFlow = {
  consentRequest: OAuth2ConsentRequest
  ui: UiContainer
}
