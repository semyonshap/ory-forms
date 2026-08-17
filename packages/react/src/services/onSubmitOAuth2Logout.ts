import type {
  OAuth2LogoutFlowContainer,
  OnSubmitHandlerProps,
  UpdateOAuth2LogoutFlowBody,
} from '../types'

import { OryFlowType } from '../types'

export async function onSubmitOAuth2Logout(
  flowContainer: OAuth2LogoutFlowContainer,
  {
    body,
    onRedirect,
    onSuccess,
    onError,
  }: OnSubmitHandlerProps<UpdateOAuth2LogoutFlowBody>,
) {
  const response = await fetch(flowContainer.flow.ui.action, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const oauth2Logout = await response.json()
  if (
    oauth2Logout.redirect_to &&
    typeof oauth2Logout.redirect_to === 'string'
  ) {
    await onSuccess?.({
      flowType: OryFlowType.OAuth2Logout,
    })
    onRedirect(oauth2Logout.redirect_to as string, true)
    return
  }
  await onError?.({
    type: 'logout_error',
    flowType: OryFlowType.OAuth2Logout,
  })
  throw new Error(
    `[Ory/Elements]: OAuth2 logout flow not completed. \nResponse from ${flowContainer.flow.ui.action}: ${JSON.stringify(oauth2Logout)}`,
  )
}
