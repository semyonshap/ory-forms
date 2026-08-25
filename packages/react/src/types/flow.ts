import type { OAuth2ConsentFlow, OAuth2LogoutFlow } from './container'

export interface UpdateOAuth2ConsentFlowBody {
  consent_challenge: string
  action: 'accept' | 'reject'
  grant_scope?: string[]
  remember?: boolean
}

export interface UpdateOAuth2LogoutFlowBody {
  logout_challenge: string
  action: 'accept' | 'reject'
}

export interface OAuth2ConsentFlowResponse extends OAuth2ConsentFlow {
  redirect_to?: string
}

export interface OAuth2LogoutFlowResponse extends OAuth2LogoutFlow {
  redirect_to?: string
}
