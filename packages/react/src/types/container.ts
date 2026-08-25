import {
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

import { FormState } from '.'

export enum OryFlowType {
  Login = 'login',
  Registration = 'registration',
  Recovery = 'recovery',
  Verification = 'verification',
  Settings = 'settings',
  OAuth2Consent = 'oauth2_consent',
  OAuth2Logout = 'oauth2_logout',
  Error = 'error',
  Navigation = 'navigation',
}

export interface LoginFlowContainer {
  flowType: OryFlowType.Login
  flow: LoginFlow
}

export interface RegistrationFlowContainer {
  flowType: OryFlowType.Registration
  flow: RegistrationFlow
}

export interface RecoveryFlowContainer {
  flowType: OryFlowType.Recovery
  flow: RecoveryFlow
}

export interface VerificationFlowContainer {
  flowType: OryFlowType.Verification
  flow: VerificationFlow
}

export interface SettingsFlowContainer {
  flowType: OryFlowType.Settings
  flow: SettingsFlow
}

export interface OAuth2ConsentFlowContainer {
  flowType: OryFlowType.OAuth2Consent
  flow: OAuth2ConsentFlow
}

export interface OAuth2LogoutFlowContainer {
  flowType: OryFlowType.OAuth2Logout
  flow: OAuth2LogoutFlow
}

export interface NavigationFlowContainer {
  flowType: OryFlowType.Navigation
  flow: NavigationFlow
}

export interface ErrorFlowContainer {
  flowType: OryFlowType.Error
  flow: ErrorFlow
}

export type OryFlowContainer =
  | LoginFlowContainer
  | RegistrationFlowContainer
  | RecoveryFlowContainer
  | VerificationFlowContainer
  | SettingsFlowContainer
  | NavigationFlowContainer
  | OAuth2ConsentFlowContainer
  | OAuth2LogoutFlowContainer
  | ErrorFlowContainer

export type OryFlowContainerWithState = OryFlowContainer & {
  formState: FormState
}

export interface OAuth2ConsentFlow {
  id: 'UNSET'
  active: 'oauth2_consent'
  state: 'show_form' | 'rejected' | 'accepted'
  created_at: Date
  issued_at: Date
  expires_at: Date
  ui: UiContainer
  consent_request: OAuth2ConsentRequest
  session: Session
  return_to?: string
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

export interface NavigationFlow {
  id: 'UNSET'
  active: 'navigation'
  ui: UiContainer
  session: Session | null
  return_to?: string
}

export interface ErrorFlow {
  id: string
  active: 'error'
  ui: UiContainer
  error: OryError
  session: Session | null
  return_to?: string
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
