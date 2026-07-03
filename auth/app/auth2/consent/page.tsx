import { Consent } from "@/features/ory-elements/features/flows"
import { getServerSession } from "@ory/nextjs/app"
import { oryConfig } from "@/ory.config"
import { redirect } from "next/navigation"
import { logger } from "@/lib/logger"
import { randomUUID } from "crypto"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { oauth2Client } from "@/features/ory-elements/client/frontendClient"

export default async function ConsentPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const consentChallenge = searchParams.consent_challenge as string

  if (!consentChallenge) {
    logger.error("No consent challenge provided")
    return <div>Invalid consent challenge</div>
  }

  const api = oauth2Client()

  try {
    const consentRequest = await api.getOAuth2ConsentRequest({
      consentChallenge,
    })

    if (consentRequest.skip) {
      logger.info("Consent skipped, accepting automatically", {
        consentChallenge,
      })
      const accept = await api.acceptOAuth2ConsentRequest({
        consentChallenge,
        acceptOAuth2ConsentRequest: {
          grant_scope: consentRequest.requested_scope || [],
          grant_access_token_audience:
            consentRequest.requested_access_token_audience || [],
          session: {},
        },
      })
      redirect(accept.redirect_to)
    }

    const session = await getServerSession()

    if (!session) {
      redirect("/auth2/login")
    }

    const csrfToken = randomUUID()

    return (
      <Consent
        consentChallenge={consentRequest}
        config={oryConfig}
        session={session}
        formActionUrl="/"
        csrfToken={csrfToken}
      />
    )
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    logger.error("Error in consent page", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return <div>Error loading consent</div>
  }
}
