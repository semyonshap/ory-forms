import type {
  OAuth2LogoutFlowContainer,
  OnSubmitHandlerProps,
  OryConfiguration,
  UpdateOAuth2LogoutFlowBody,
} from '../types'

import { OryFlowType } from '../types'
import { handleOAuth2FlowError } from '../utils'

export async function onSubmitOAuth2Logout(
  { flow }: OAuth2LogoutFlowContainer,
  config: OryConfiguration,
  {
    body,
    onRedirect,
    onSuccess,
    onError,
  }: OnSubmitHandlerProps<UpdateOAuth2LogoutFlowBody>,
) {
  await config.sdk.frontend
    .updateOAuth2LogoutFlowRaw({
      updateOAuth2LogoutFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      if (typeof body.redirect_to === 'string') {
        await onSuccess?.({
          flowType: OryFlowType.OAuth2Logout,
        })
        onRedirect(body.redirect_to, true)
        return
      }

      await onError?.({
        type: 'logout_error',
        flowType: OryFlowType.OAuth2Logout,
      })
      throw new Error(
        `[Ory/Elements]: OAuth2 logout flow not completed. \nResponse from ${flow.ui.action}: ${JSON.stringify(body)}`,
      )
    })
    .catch(
      handleOAuth2FlowError({
        onRedirect,
        onError,
        flowType: OryFlowType.OAuth2Logout,
      }),
    )
}
