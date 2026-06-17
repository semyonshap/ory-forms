import { Login } from "@/features/ory-elements/features/flows"
import { oryConfig } from "@/ory.config"
import { logger } from "@/lib/logger"
import { getLoginFlow, OryPageParams, getServerSession } from "@ory/nextjs/app"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { OAuth2Client } from "@/lib/adminClients"


export default async function OAuth2LoginPage(props: OryPageParams) {
	const searchParams = await props.searchParams;
	const loginChallenge = searchParams.login_challenge as string
	
	const api = OAuth2Client;

	if (loginChallenge) {
		try {
			const loginRequest = await api.getOAuth2LoginRequest({ loginChallenge })
			if (loginRequest.skip) {
				const accept = await api.acceptOAuth2LoginRequest({
					loginChallenge,
					acceptOAuth2LoginRequest: {
						subject: loginRequest.subject,
						remember: true,
						remember_for: 3600,
					}
				})
				redirect(accept.redirect_to)
			} else {
				// Check if user is already logged in via Kratos session
				const session = await getServerSession()
				if (session && session.identity) {
					const accept = await api.acceptOAuth2LoginRequest({
						loginChallenge,
						acceptOAuth2LoginRequest: {
							subject: session.identity.id,
							remember: true,
							remember_for: 3600,
						}
					})
					logger.info('Redirecting to OAuth2 consent', { redirect_to: accept.redirect_to })
					redirect(accept.redirect_to)
				}
			}
		} catch (error) {
			if (isRedirectError(error)) {
				throw error
			} else {
				logger.error('Error in OAuth2 login request check', { error, loginChallenge })
			}
			// Fall through to show form
		}
	}
	
  const flow = await getLoginFlow(oryConfig, searchParams)
  if (!flow) {
    return null
  }

	logger.info('OAuth2 login flow retrieved', { flow_id: flow.id })

	return (
		<Login
			flow={flow}
			config={oryConfig}
		/>
	)
}
