import { NextRequest, NextResponse } from "next/server"
import { serverSideOAuth2Client } from "../app/client"

export async function handleConsentSubmit(request: NextRequest) {
  const formData = await request.formData()
  const consentChallenge = formData.get("consent_challenge")?.toString()
  const action = formData.get("action")?.toString()
  const remember = formData.get("remember") === "true"

  if (!consentChallenge || !action) {
    return NextResponse.json(
      { error: "Missing consent_challenge or action" },
      { status: 400 },
    )
  }

  const api = serverSideOAuth2Client()

  try {
    if (action === "reject") {
      const reject = await api.rejectOAuth2ConsentRequest({
        consentChallenge,
        rejectOAuth2Request: {
          error: "access_denied",
          error_description: "The resource owner denied the request",
        },
      })
      return NextResponse.redirect(reject.redirect_to)
    }

    const consentRequest = await api.getOAuth2ConsentRequest({
      consentChallenge,
    })
    const accept = await api.acceptOAuth2ConsentRequest({
      consentChallenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: consentRequest.requested_scope ?? [],
        grant_access_token_audience:
          consentRequest.requested_access_token_audience ?? [],
        session: {},
        remember,
        remember_for: 3600,
      },
    })
    return NextResponse.redirect(accept.redirect_to)
  } catch {
    return NextResponse.json(
      { error: "Consent processing failed" },
      { status: 500 },
    )
  }
}
