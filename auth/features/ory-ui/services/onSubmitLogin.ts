import {
  FlowType,
  handleContinueWith,
  handleFlowError,
  LoginFlow,
  loginUrl,
  UpdateLoginFlowBody,
} from "@ory/client-fetch"
import { createOryClient } from "../client/sdk"
import { OryConfiguration, OryFlowContainer } from "../types"
import { onRedirect, replaceWindowFlowId } from "../utils/windowUtils"

export async function onSubmitLogin(
  flowContainer: OryFlowContainer,
  config: OryConfiguration,
  body: UpdateLoginFlowBody,
  setFlowContainer: (flowContainer: OryFlowContainer) => void,
) {
  const client = createOryClient(config)

  await client
    .updateLoginFlowRaw({
      flow: flowContainer.flow.id,
      updateLoginFlowBody: body,
    })
    .then(async (res) => {
      const data = await res.value()

      const didContinueWith = handleContinueWith(data.continue_with, {
        onRedirect,
      })
      if (!didContinueWith) {
        onRedirect(loginUrl({ sdk: config.sdk }), true)
      }
    })
    .catch(
      handleFlowError({
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(loginUrl({ sdk: config.sdk }), true)
          }
        },
        onValidationError: (body: LoginFlow) => {
          setFlowContainer({ flowType: FlowType.Login, flow: body })
        },
        onRedirect,
      }),
    )
}
