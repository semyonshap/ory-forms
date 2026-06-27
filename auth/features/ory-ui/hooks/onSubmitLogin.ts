import {
  FlowType,
  LoginFlow,
  loginUrl,
  UpdateLoginFlowBody,
} from "@ory/client-fetch"
import { createOryClient } from "../client/sdk"
import { handleContinueWith } from "@ory/client-fetch"
import { handleFlowError } from "@ory/client-fetch"
import { onRedirect, replaceWindowFlowId } from "../utils/windowUtils"
import { OryClientConfiguration } from "../utils/oryConfiguration"
import { LoginFlowContainer, OryStore } from "../store/oryStore"

export async function onSubmitLogin(
  { flow }: LoginFlowContainer,
  config: OryClientConfiguration,
  { setFlow }: OryStore,
  body: UpdateLoginFlowBody,
) {
  const client = createOryClient(config)

  client
    .updateLoginFlowRaw({
      flow: flow.id,
      updateLoginFlowBody: body,
    })
    .then(async (res) => {
      const body = await res.value()

      const didContinueWith = handleContinueWith(body.continue_with, {
        onRedirect,
      })

      if (!didContinueWith) {
        onRedirect(loginUrl(config), true)
      }
    })
    .catch((err) =>
      handleFlowError({
        onValidationError: (body: LoginFlow) => {
          setFlow({ flow: body, flowType: FlowType.Login })
        },
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(loginUrl(config), true)
          }
        },
        onRedirect,
      })(err),
    )
}
