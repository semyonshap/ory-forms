import { Node } from "../node"
import { getNodeId } from "../../utils"
import { useCardHeaderText } from "../../hooks"
import { useFlowStoreShallow } from "../../context"
import { OryFlowContainerWithState } from "../../types"

export function CardWrapper() {
  const { Card, nodes, flow, formState } = useFlowStoreShallow((state) => ({
    Card: state.components.Card,
    flow: state.flow,
    nodes: state.nodes,
    formState: state.formState,
  }))

  const context: OryFlowContainerWithState = {
    ...flow,
    formState,
  }

  const { title, description } = useCardHeaderText(flow.flow.ui, context)

  const Nodes = nodes.map((node, i) => (
    <Node key={`${getNodeId(node)}-${i}`} node={node} />
  ))

  return (
    <Card.Root
      header={{
        title,
        description,
      }}
      nodes={Nodes}
      footer={[]}
    />
  )
}
