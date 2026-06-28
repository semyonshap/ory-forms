import { useMutation } from "@tanstack/react-query"
import {
  FlowType,
  LoginFlow,
  loginUrl,
  UpdateLoginFlowBody,
  handleContinueWith,
  handleFlowError,
} from "@ory/client-fetch"
import { createOryClient } from "../../client/sdk"
import { onRedirect, replaceWindowFlowId } from "../../utils/windowUtils"
import { useFlowFormContext } from "../../context/flow-provider"
import { OryClientConfiguration } from "../../types"

export function useLoginMutation(config: OryClientConfiguration) {
  const { flow, setFlowContainer } = useFlowFormContext()

  return useMutation({
    mutationFn: async (body: UpdateLoginFlowBody) => {
      if (!flow || flow.flowType !== FlowType.Login) {
        throw new Error("No active login flow")
      }
      const client = createOryClient(config)
      const res = await client.updateLoginFlowRaw({
        flow: flow.flow.id,
        updateLoginFlowBody: body,
      })
      return res.value()
    },

    onSuccess: (data) => {
      const didContinueWith = handleContinueWith(data.continue_with, {
        onRedirect,
      })
      if (!didContinueWith) {
        onRedirect(loginUrl(config), true)
      }
    },

    onError: (error) => {
      handleFlowError({
        onValidationError: (body: LoginFlow) => {
          setFlowContainer({ flowType: FlowType.Login, flow: body })
        },
        onRestartFlow: (useFlowId?: string) => {
          if (useFlowId) {
            replaceWindowFlowId(useFlowId)
          } else {
            onRedirect(loginUrl(config), true)
          }
        },
        onRedirect,
      })(error)
    },
  })
}
