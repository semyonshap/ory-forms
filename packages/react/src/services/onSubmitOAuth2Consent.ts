import type {
  OAuth2ConsentFlowContainer,
  OnSubmitHandlerProps,
  UpdateOAuth2ConsentFlowBody,
} from '../types'

import { OryFlowType } from '../types'

export async function onSubmitOAuth2Consent(
  flowContainer: OAuth2ConsentFlowContainer,
  { body, onRedirect, onSuccess, onError }: OnSubmitHandlerProps<UpdateOAuth2ConsentFlowBody>,
) {
  const response = await fetch(flowContainer.flow.ui.action, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const oauth2Success = await response.json()
  if (oauth2Success.redirect_to && typeof oauth2Success.redirect_to === 'string') {
    await onSuccess?.({
      flowType: OryFlowType.OAuth2Consent,
      consentRequest: flowContainer.flow.consent_request,
    })
    onRedirect(oauth2Success.redirect_to as string, true)
    return
  }
  await onError?.({
    type: 'consent_error',
    flowType: OryFlowType.OAuth2Consent,
    consentRequest: flowContainer.flow.consent_request,
  })
  throw new Error(
    `[Ory/Elements]: OAuth2 consent flow not completed. This indicates a bug in Ory. Please report this issue to github.com/ory/elements. \nResponse from ${flowContainer.flow.ui.action}: ${JSON.stringify(oauth2Success)}`,
  )
}
