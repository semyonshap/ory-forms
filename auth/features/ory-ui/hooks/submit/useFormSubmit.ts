import { useLoginMutation } from "./useLoginMutation"
import { FlowType, UpdateLoginFlowBody } from "@ory/client-fetch"
import { removeEmptyStrings } from "../../utils/removeFalsyValues"
import { OryClientConfiguration, OryFlowContainer } from "../../types"

export function useFormSubmit(
  config: OryClientConfiguration,
  flow: OryFlowContainer,
) {
  const loginMutation = useLoginMutation(config)

  const onSubmit = async (initialData: Record<string, unknown>) => {
    const data = removeEmptyStrings(initialData)
    switch (flow.flowType) {
      case FlowType.Login: {
        const submitData: UpdateLoginFlowBody = {
          ...(data as unknown as UpdateLoginFlowBody),
        }
        await loginMutation.mutateAsync(submitData)
        break
      }
    }
  }

  const isPending = loginMutation.isPending

  return { onSubmit, isPending }
}
