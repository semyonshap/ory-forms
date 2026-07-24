import { handleContinueWith, LoginFlow, loginUrl, UpdateLoginFlowBody } from '@ory/client-fetch'
import {
  OryFlowType,
  OryConfiguration,
  LoginFlowContainer,
  OnSubmitHandlerPropsWithFlow,
} from '../types'
import { replaceWindowFlowId, handleFlowError } from '../utils'
import { flowHasErrors } from '../lib'

export async function onSubmitLogin(
  { flow }: LoginFlowContainer,
  config: OryConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerPropsWithFlow<UpdateLoginFlowBody>,
) {
  if (!config.sdk.url) {
    throw new Error(`Please supply your Ory Network SDK url to the Ory Elements configuration.`)
  }

  const method = String(body.method)

  await config.sdk.frontend
    .updateLoginFlowRaw({
      flow: flow.id,
      updateLoginFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      await onSuccess?.({
        flowType: OryFlowType.Login,
        method,
        session: body.session,
        flow,
      })

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      if (!didContinueWith) {
        onRedirect(loginUrl(config), true)
      }

      return
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(loginUrl(config), true)
          }
        },
        onValidationError: async (body: LoginFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: OryFlowType.Login,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: OryFlowType.Login,
          })
        },
        onRedirect,
        config,
        flowType: OryFlowType.Login,
        onError,
      }),
    )
}
