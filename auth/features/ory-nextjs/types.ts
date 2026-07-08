import { OAuth2ConsentRequest, Session, UiContainer } from "@ory/client-fetch"

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
  id: "UNSET"
  active: "oauth2_consent"
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
}
