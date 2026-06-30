import { useLoginMutation } from "../mutations/useLoginMutation"
import { FlowType, UpdateLoginFlowBody } from "@ory/client-fetch"
import { removeEmptyStrings } from "../../utils/removeFalsyValues"
import { useFlowStoreShallow } from "../../context"

export function useFormSubmit() {
  const { flow, dispatchFormState } = useFlowStoreShallow((state) => ({
    flow: state.flow,
    dispatchFormState: state.dispatchFormState,
  }))

  const loginMutation = useLoginMutation()

  const onSubmit = async (initialData: Record<string, unknown>) => {
    dispatchFormState({ type: "form_submit_start" })
    try {
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
    } finally {
      dispatchFormState({ type: "form_submit_end" })
    }
  }

  return { onSubmit }
}
