import { NextRequest, NextResponse } from 'next/server'
import {
  AccountExperienceConfiguration,
  LoginFlow,
  OAuth2ConsentRequest,
  OAuth2LogoutRequest,
  RecoveryFlow,
  RegistrationFlow,
  Session,
  SettingsFlow,
  UiContainer,
  VerificationFlow,
} from '@ory/client-fetch'

export type QueryParams = Record<string, string | string[] | undefined>

export enum OryFlowType {
  Login = 'login',
  Registration = 'registration',
  Recovery = 'recovery',
  Verification = 'verification',
  Settings = 'settings',
  OAuth2Login = 'oauth2_login',
  OAuth2Consent = 'oauth2_consent',
  OAuth2Logout = 'oauth2_logout',
  Error = 'error',
  Navigation = 'navigation',
}

export interface OryFlowConfig {
  project: {
    login_ui_url: string
    registration_ui_url: string
    recovery_ui_url: string
    verification_ui_url: string
    settings_ui_url: string
    default_redirect_url: string
    error_ui_url?: string
    oauth2_login_ui_url?: string
    oauth2_consent_ui_url?: string
  }
}

export type OryAccept = 'text/html' | 'application/json'

export interface OryFlowOptions {
  accept?: OryAccept
}

export interface OryPageParams {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export interface OryMiddlewareCustomRoute {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  handler: (request: NextRequest) => NextResponse | Promise<NextResponse>
  auth?: {
    type: 'cookie' | 'header'
    key?: string
    secret?: string
  }
}

export interface OryMiddlewareOptions {
  forwardAdditionalHeaders?: string[]
  forceCookieDomain?: string
  project?: Partial<AccountExperienceConfiguration>
  customRoutes?: OryMiddlewareCustomRoute[]
}

export const initOverrides: RequestInit = {
  cache: 'no-cache',
}

export interface SessionWithStatus {
  status: 'authenticated' | '2fa_required' | 'unauthenticated'
  session: Session | null
}

export interface UiMessage {
  id: number
  type: 'error' | 'info' | 'success'
  text: string
  context?: Record<string, unknown>
}

export interface OryError {
  code: number
  message?: string
  status?: string
  reason?: string
  id?: string
  timestamp?: Date
  correlationId?: string
}

export interface ErrorFlow {
  id: string
  active: 'error'
  ui: UiContainer
  session: Session | null
  return_to?: string
  error: OryError
}

export interface NavigationFlow {
  id: 'UNSET'
  active: 'navigation'
  ui: UiContainer
  session: Session | null
  return_to?: string
}

export interface OAuth2ConsentFlow {
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

export interface OAuth2LogoutFlow {
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

interface LoginFlowContainer {
  flowType: OryFlowType.Login
  flow: LoginFlow
}

interface RegistrationFlowContainer {
  flowType: OryFlowType.Registration
  flow: RegistrationFlow
}

interface RecoveryFlowContainer {
  flowType: OryFlowType.Recovery
  flow: RecoveryFlow
}

interface VerificationFlowContainer {
  flowType: OryFlowType.Verification
  flow: VerificationFlow
}

interface SettingsFlowContainer {
  flowType: OryFlowType.Settings
  flow: SettingsFlow
}

interface OAuth2ConsentFlowContainer {
  flowType: OryFlowType.OAuth2Consent
  flow: OAuth2ConsentFlow
}

interface OAuth2LogoutFlowContainer {
  flowType: OryFlowType.OAuth2Logout
  flow: OAuth2LogoutFlow
}

interface NavigationFlowContainer {
  flowType: OryFlowType.Navigation
  flow: NavigationFlow
}

interface ErrorFlowContainer {
  flowType: OryFlowType.Error
  flow: ErrorFlow
}

export type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
  | OAuth2ConsentFlowContainer
  | OAuth2LogoutFlowContainer
  | NavigationFlowContainer
  | ErrorFlowContainer
