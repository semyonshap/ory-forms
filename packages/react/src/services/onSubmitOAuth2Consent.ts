import type {
  OAuth2ConsentFlowContainer,
  OnSubmitHandlerProps,
  OryConfiguration,
  OryFlowContainer,
  UpdateOAuth2ConsentFlowBody,
} from '../types'

import { OryFlowType } from '../types'
import { handleOAuth2FlowError } from '../utils'

export async function onSubmitOAuth2Consent(
  { flow }: OAuth2ConsentFlowContainer,
  config: OryConfiguration,
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
  await config.sdk.frontend
    .updateOAuth2ConsentFlowRaw({
      updateOAuth2ConsentFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      if (typeof body.redirect_to === 'string') {
        await onSuccess?.({
          flowType: OryFlowType.OAuth2Consent,
          consentRequest: flow.consent_request,
        })

        const isCustomScheme = isCustomRedirectScheme(
          flow.consent_request?.request_url,
        )

        if (isCustomScheme) {
          setFlowContainer({
            flow: body,
            flowType: OryFlowType.OAuth2Consent,
          })
        }

        onRedirect(body.redirect_to, true)
        return
      }

      setFlowContainer({
        flow: body,
        flowType: OryFlowType.OAuth2Consent,
      })
    })
    .catch(
      handleOAuth2FlowError({
        onRedirect,
        onError,
        flowType: OryFlowType.OAuth2Consent,
      }),
    )
}

function isCustomRedirectScheme(requestUrl?: string): boolean {
  if (!requestUrl || !URL.canParse(requestUrl)) {
    return false
  }

  const redirectUri = new URL(requestUrl).searchParams.get('redirect_uri')
  if (!redirectUri) {
    return false
  }

  return (
    !redirectUri.startsWith('http://') &&
    !redirectUri.startsWith('https://')
  )
}
