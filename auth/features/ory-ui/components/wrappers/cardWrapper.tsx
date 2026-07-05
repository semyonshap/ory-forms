import { useMemo } from "react"

import { renderNodes } from "../render"
import { OryFlowContainerWithState } from "../../types"
import { useFlowStoreShallow } from "../../context"
import { useCardHeaderText, useFormMessages } from "../../hooks"
import { Builder } from "../../lib/nodes/builder"
import { useTranslation } from "react-i18next"

export function CardWrapper() {
  const { config, Card, flow, formState, dispatchFormState, nodeSorter } =
    useFlowStoreShallow((state) => ({
      config: state.config,
      Card: state.components.Card,
      flow: state.flowContainer,
      formState: state.formState,
      dispatchFormState: state.dispatchFormState,
      nodeSorter: state.components.nodeSorter,
    }))

  const contextContainer: OryFlowContainerWithState = {
    ...flow,
    formState,
  }

  const { t } = useTranslation()

  const { title, description } = useCardHeaderText(
    flow.flow.ui,
    contextContainer,
  )

  const nodes = Builder({
    config,
    container: flow,
    formState,
    t,
    dispatchFormState,
    nodeSorter,
  })

  const result = renderNodes(nodes)

  const messages = useFormMessages()

  return (
    <Card.Root
      header={{
        title,
        description,
      }}
      messages={messages}
      nodes={result}
    />
  )
}
