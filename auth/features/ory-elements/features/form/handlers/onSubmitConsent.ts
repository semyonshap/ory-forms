import { OnRedirectHandler } from "@ory/client-fetch";
import { OryFlowContainer } from "../../../shared/util";
import { OryElementsConfiguration } from "../../../context";
import { oauth2Client } from "../../../client/frontendClient";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export interface UpdateConsentBody {
  consent_challenge: string;
  action: string;
  grant_scope?: string | string[];
  remember?: boolean;
}

type OnSubmitConsentHandlerProps = {
  body: UpdateConsentBody;
  onRedirect: OnRedirectHandler;
};

export async function onSubmitConsent(
  flowContainer: OryFlowContainer,
  config: OryElementsConfiguration,
  { body, onRedirect }: OnSubmitConsentHandlerProps,
) {
  const client = oauth2Client();

  try {
    const consentChallenge = body.consent_challenge;
    const submit = body.action;

    if (!consentChallenge) {
      throw new Error("No consent challenge");
    }

    if (submit === "reject") {
      const reject = await client.rejectOAuth2ConsentRequest({
        consentChallenge,
        rejectOAuth2Request: {
          error: "access_denied",
          error_description: "The resource owner denied the request",
        },
      });
      onRedirect(reject.redirect_to, true);
    } else {
      // Accept
      const remember = Boolean(body.remember);

      // Fetch again to get audiences
      const consentRequest = await client.getOAuth2ConsentRequest({
        consentChallenge,
      });

      const grantScope = consentRequest.requested_scope || [];

      const accept = await client.acceptOAuth2ConsentRequest({
        consentChallenge,
        acceptOAuth2ConsentRequest: {
          grant_scope: grantScope,
          grant_access_token_audience:
            consentRequest.requested_access_token_audience || [],
          session: {},
          remember,
          remember_for: 3600,
        },
      });

      onRedirect(accept.redirect_to, true);
    }
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    console.error("Consent submission error:", err);

    if (config.project.default_redirect_url) {
      onRedirect(config.project.default_redirect_url, true);
    } else {
      throw err;
    }
  }
}
