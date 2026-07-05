import { useForm } from "react-hook-form"
import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { useFlowStoreShallow } from "../context"
import { useFormAutofocus } from "./form/useFormAutofocus"
import { computeDefaultValues, resolveLoginHint } from "../utils/form"

export function useOryForm(nodes?: UiNode[]) {
  const { formState, flowContainer } = useFlowStoreShallow((state) => ({
    flowContainer: state.flowContainer,
    formState: state.formState,
  }))

  const defaultNodes = nodes
    ? flowContainer.flow.ui.nodes
        .filter((node) => node.group === UiNodeGroupEnum.Default)
        .concat(nodes)
    : flowContainer.flow.ui.nodes

  const loginHint = resolveLoginHint(flowContainer)
  const methods = useForm({
    defaultValues: computeDefaultValues(
      {
        active: flowContainer.flow.active,
        ui: { nodes: defaultNodes },
      },
      loginHint,
    ),
  })

  useFormAutofocus(
    defaultNodes,
    formState.isReady,
    flowContainer.flowType,
    methods.setFocus,
  )

  return {
    methods,
  }
}
