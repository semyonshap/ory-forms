import { useLayoutEffect, useMemo } from "react"

import { renderNodes } from "../render"
import { OryFlowContainerWithState } from "../../types"
import { useFlowStoreShallow, useOryFormContext } from "../../context"
import { useCardHeaderText, useFormMessages, useNodes } from "../../hooks"

export function CardWrapper() {
  const { Card, flow, formState } = useFlowStoreShallow((state) => ({
    Card: state.components.Card,
    flow: state.flowContainer,
    formState: state.formState,
  }))

  const contextContainer: OryFlowContainerWithState = {
    ...flow,
    formState,
  }

  const { title, description } = useCardHeaderText(
    flow.flow.ui,
    contextContainer,
  )

  const nodes = useNodes()

  const { result, contextMap } = useMemo(() => renderNodes(nodes), [nodes])

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
