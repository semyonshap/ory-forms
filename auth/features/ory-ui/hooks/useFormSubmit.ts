import { useOryStore } from "../store/oryStore"
import { useOryConfig } from "../context/ory-provider"
import { onSubmitLogin } from "./onSubmitLogin"
import { FlowType, UpdateLoginFlowBody } from "@ory/client-fetch"
import { removeEmptyStrings } from "../utils/removeFalsyValues"

export function useFormSubmit() {
  const store = useOryStore()
  const config = useOryConfig()

  const onSubmit = async (initialData: Record<string, unknown>) => {
    const flow = store.flow

    if (!flow) throw new Error("No active flow.")

    const data = removeEmptyStrings(initialData)
    switch (flow.flowType) {
      case FlowType.Login: {
        const submitData: UpdateLoginFlowBody = {
          ...(data as unknown as UpdateLoginFlowBody),
        }
        await onSubmitLogin(flow, config, store, submitData)
        break
      }
    }
  }

  return onSubmit
}
