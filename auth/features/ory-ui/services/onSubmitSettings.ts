import {
  handleContinueWith,
  isResponseError,
  loginUrl,
  SettingsFlow,
  settingsUrl,
  UpdateSettingsFlowBody,
} from "@ory/client-fetch"
import {
  OnSubmitHandlerProps,
  OryConfiguration,
  OryFlowContainer,
  OryFlowType,
} from "../types"
import { flowHasErrors, handleFlowError, replaceWindowFlowId } from "../utils"

export async function onSubmitSettings(
  { flow }: OryFlowContainer,
  config: OryConfiguration,
  {
    setFlowContainer,
    body,
    onRedirect,
    onSuccess,
    onValidationError,
    onError,
  }: OnSubmitHandlerProps<UpdateSettingsFlowBody>,
) {
  const method = String(body.method)

  await config.sdk.frontend
    .updateSettingsFlowRaw({
      flow: flow.id,
      updateSettingsFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      await onSuccess?.({
        flowType: OryFlowType.Settings,
        method,
        flow: body,
      })

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      // eslint-disable-next-line promise/always-return
      if (didContinueWith) {
        return
      }

      setFlowContainer({
        flow: body,
        flowType: OryFlowType.Settings,
      })
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(settingsUrl(config), true)
          }
        },
        onValidationError: async (body: SettingsFlow) => {
          if (flowHasErrors(body.ui)) {
            await onValidationError?.({
              flowType: OryFlowType.Settings,
              flow: body,
            })
          }
          setFlowContainer({
            flow: body,
            flowType: OryFlowType.Settings,
          })
        },
        onRedirect,
        config,
        flowType: OryFlowType.Settings,
        onError,
      }),
    )
    .catch((err) => {
      if (isResponseError(err)) {
        if (err.response.status === 401) {
          return onRedirect(
            loginUrl(config) + "?return_to=" + settingsUrl(config),
            true,
          )
        }
        throw err
      }
    })
}
