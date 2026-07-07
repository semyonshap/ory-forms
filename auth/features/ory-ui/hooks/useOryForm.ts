import { useForm } from "react-hook-form"
import { UiNode, UiNodeGroupEnum } from "@ory/client-fetch"
import { useFormAutofocus } from "./useFormAutofocus"
import { computeDefaultValues, resolveLoginHint } from "../lib/form/helpers"
import { OryFlowContainer } from "../types"

export function useOryForm(flowContainer: OryFlowContainer, nodes?: UiNode[]) {
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

  useFormAutofocus(defaultNodes, flowContainer.flowType, methods.setFocus)

  return {
    methods,
  }
}
