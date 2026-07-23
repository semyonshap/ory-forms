export interface UpdateOAuth2ConsentFlowBody {
  consent_challenge: string
  action: "accept" | "reject"
  grant_scope?: string[]
  remember?: boolean
}

export interface OAuth2ConsentFlowResponse {
  redirect_to: string
}
