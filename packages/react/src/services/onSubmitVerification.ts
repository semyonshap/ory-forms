import {
  UpdateVerificationFlowBody,
  VerificationFlow,
  verificationUrl,
} from "@ory/client-fetch"
import {
  OryFlowType,
  OryConfiguration,
  OryFlowContainer,
  OnSubmitHandlerPropsWithFlow,
} from "../types"
import { handleFlowError, replaceWindowFlowId } from "../utils"
import { flowHasErrors } from "../lib"

export async function onSubmitVerification(
  { flow }: OryFlowContainer,
  config: OryConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerPropsWithFlow<UpdateVerificationFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateVerificationFlowRaw({
      flow: flow.id,
      updateVerificationFlowBody: body,
    })
    .then(async (res) => {
      const flow = await res.value()

      await onSuccess?.({
        flowType: OryFlowType.Verification,
        method,
        flow,
      })

      return setFlowContainer({
        flow,
        flowType: OryFlowType.Verification,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(verificationUrl(config), true)
          }
        },
        onValidationError: async (body: VerificationFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: OryFlowType.Verification,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: OryFlowType.Verification,
          })
        },
        onRedirect,
        config,
        flowType: OryFlowType.Verification,
        onError,
      }),
    )
}
