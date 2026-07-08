import {
  OAuth2ConsentRequest,
  OAuth2LogoutRequest,
  Session,
  UiContainer,
} from "@ory/client-fetch"

export type QueryParams = { [key: string]: string | string[] | undefined }

export interface OryPageParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const initOverrides: RequestInit = {
  cache: "no-cache",
}

export type FlowParams = {
  id: string
  cookie: string | undefined
  return_to: string
}

export type OAuth2ConsentFlow = {
  id: "UNSET"
  active: "oauth2_consent"
  ui: UiContainer
  session: Session
  return_to?: string
  consent_request: OAuth2ConsentRequest
}

export type OAuth2LogoutFlow = {
  id: "UNSET"
  active: "oauth2_logout"
  ui: UiContainer
  return_to?: string
  logout_request: OAuth2LogoutRequest
}
