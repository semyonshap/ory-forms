import { useTranslation } from "react-i18next"

import { renderNodes } from "../render"
import { Builder } from "../../lib/nodes/builder"
import { useFlowStoreShallow } from "../../context"

export function RenderWrapper() {
  const { config, flow, formState, dispatchFormState, nodeSorter } =
    useFlowStoreShallow((state) => ({
      config: state.config,
      flow: state.flowContainer,
      formState: state.formState,
      dispatchFormState: state.dispatchFormState,
      nodeSorter: state.components.nodeSorter,
    }))

  const { t } = useTranslation()

  const nodes = Builder({
    config,
    container: flow,
    formState,
    t,
    dispatchFormState,
    nodeSorter,
  })

  return renderNodes(nodes)
}
