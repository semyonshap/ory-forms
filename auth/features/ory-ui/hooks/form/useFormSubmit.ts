import { FlowType, UpdateLoginFlowBody } from "@ory/client-fetch"
import { removeEmptyStrings } from "../../utils/removeFalsyValues"
import { useFlowStoreShallow } from "../../context"
import { onSubmitLogin } from "../../services"

export function useFormSubmit() {
  const { flow, config, dispatchFormState, setFlowContainer } =
    useFlowStoreShallow((state) => ({
      flow: state.flowContainer,
      config: state.config,
      dispatchFormState: state.dispatchFormState,
      setFlowContainer: state.setFlowContainer,
    }))

  const onSubmit = async (initialData: Record<string, unknown>) => {
    dispatchFormState({ type: "form_submit_start" })
    try {
      const data = removeEmptyStrings(initialData)
      switch (flow.flowType) {
        case FlowType.Login: {
          const submitData: UpdateLoginFlowBody = {
            ...(data as unknown as UpdateLoginFlowBody),
          }
          await onSubmitLogin(flow, config, submitData, setFlowContainer)
          break
        }
      }
    } finally {
      dispatchFormState({ type: "form_submit_end" })
    }
  }

  return onSubmit
}
