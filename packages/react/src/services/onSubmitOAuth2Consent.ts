import type {
  OAuth2ConsentFlowContainer,
  OnSubmitHandlerProps,
  OryFlowContainer,
  UpdateOAuth2ConsentFlowBody,
} from '../types'

import { OryFlowType } from '../types'

export async function onSubmitOAuth2Consent(
  flowContainer: OAuth2ConsentFlowContainer,
  {
    body,
    onRedirect,
    setFlowContainer,
    onSuccess,
    onError,
  }: OnSubmitHandlerProps<UpdateOAuth2ConsentFlowBody> & {
    setFlowContainer: (flowContainer: OryFlowContainer) => void
  },
) {
  const response = await fetch(flowContainer.flow.ui.action, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const result = await response.json()

  if (typeof result.redirect_to === 'string') {
    await onSuccess?.({
      flowType: OryFlowType.OAuth2Consent,
      consentRequest: flowContainer.flow.consent_request,
    })
    onRedirect(result.redirect_to as string, true)
    return
  }

  if (result.ui) {
    setFlowContainer({
      flow: { ...flowContainer.flow, ui: result.ui },
      flowType: OryFlowType.OAuth2Consent,
    })
  }

  await onError?.({
    type: 'consent_error',
    flowType: OryFlowType.OAuth2Consent,
    consentRequest: flowContainer.flow.consent_request,
  })
  throw new Error(
    `[Ory/Elements]: OAuth2 consent flow not completed. This indicates a bug in Ory. Please report this issue to github.com/ory/elements. \nResponse from ${flowContainer.flow.ui.action}: ${JSON.stringify(result)}`,
  )
}
