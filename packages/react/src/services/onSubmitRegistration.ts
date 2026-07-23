import {
  handleContinueWith,
  RegistrationFlow,
  registrationUrl,
  UpdateRegistrationFlowBody,
} from "@ory/client-fetch"
import {
  OryFlowType,
  OryConfiguration,
  RegistrationFlowContainer,
  OnSubmitHandlerPropsWithFlow,
} from "../types"
import { handleFlowError, replaceWindowFlowId } from "../utils"
import { flowHasErrors } from "../lib"

export async function onSubmitRegistration(
  { flow }: RegistrationFlowContainer,
  config: OryConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerPropsWithFlow<UpdateRegistrationFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateRegistrationFlowRaw({
      flow: flow.id,
      updateRegistrationFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      await onSuccess?.({
        flowType: OryFlowType.Registration,
        method,
        identity: body.identity,
        session: body.session,
        flow,
      })

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      onRedirect(registrationUrl(config), true)
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(registrationUrl(config), true)
          }
        },
        onValidationError: async (body: RegistrationFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: OryFlowType.Registration,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: OryFlowType.Registration,
          })
        },
        onRedirect,
        config,
        flowType: OryFlowType.Registration,
        onError,
      }),
    )
}
