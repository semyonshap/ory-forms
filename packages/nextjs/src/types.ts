import {
  AccountExperienceConfiguration,
  OAuth2ConsentRequest,
  OAuth2LogoutRequest,
  Session,
  UiContainer,
} from '@ory/client-fetch'
import { NextRequest, NextResponse } from 'next/server'

export type QueryParams = { [key: string]: string | string[] | undefined }

export interface OryPageParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export type OryMiddlewareCustomRoute = {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  handler: (request: NextRequest) => NextResponse | Promise<NextResponse>
  auth?: {
    type: 'cookie' | 'header'
    key?: string
    secret?: string
  }
}

export type OryMiddlewareOptions = {
  forwardAdditionalHeaders?: string[]
  forceCookieDomain?: string
  project?: Partial<AccountExperienceConfiguration>
  customRoutes?: OryMiddlewareCustomRoute[]
}

export const initOverrides: RequestInit = {
  cache: 'no-cache',
}

export type SessionWithStatus = {
  status: 'authenticated' | '2fa_required' | 'unauthenticated'
  session: Session | null
}

export type UiMessage = {
  id: number
  type: 'error' | 'info' | 'success'
  text: string
  context?: Record<string, unknown>
}

export type OryError = {
  code: number
  message?: string
  status?: string
  reason?: string
  id?: string
  timestamp?: Date
  correlationId?: string
}

export type ErrorFlow = {
  id: string
  active: 'error'
  ui: UiContainer
  session: Session | null
  return_to?: string
  error: OryError
}

export type NavigationFlow = {
  id: 'UNSET'
  active: 'navigation'
  ui: UiContainer
  session: Session | null
  return_to?: string
}

export type OAuth2ConsentFlow = {
  id: 'UNSET'
  active: 'oauth2_consent'
  state: 'show_form' | 'rejected' | 'accepted'
  created_at: Date
  issued_at: Date
  expires_at: Date
  ui: UiContainer
  session: Session
  return_to?: string
  consent_request: OAuth2ConsentRequest
}

export type OAuth2LogoutFlow = {
  id: 'UNSET'
  active: 'oauth2_logout'
  state: 'show_form' | 'rejected' | 'accepted'
  created_at: Date
  issued_at: Date
  expires_at: Date
  ui: UiContainer
  return_to?: string
  logout_request: OAuth2LogoutRequest
}
