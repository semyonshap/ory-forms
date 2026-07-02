import { Messages } from "./messages"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFlowStoreShallow } from "../context"
import { useCardHeaderText } from "../hooks"
import { OryFlowContainerWithState } from "../types"
import { getNodeId } from "../utils"
import { Node } from "./node"

export function FlowContent() {
  const { flow, nodes, formState } = useFlowStoreShallow((state) => ({
    flow: state.flow,
    nodes: state.nodes,
    formState: state.formState,
  }))

  const context: OryFlowContainerWithState = {
    ...flow,
    formState,
  }

  const { title, description } = useCardHeaderText(flow.flow.ui, context)

  return (
    <div className="flex w-full flex-1 items-start justify-center sm:items-center">
      <Card className="w-full sm:w-[350px] sm:max-w-[350px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Messages messages={flow.flow.ui.messages} />
          <div className="space-y-4">
            {nodes.map((node, i) => (
              <Node key={`${getNodeId(node)}-${i}`} node={node} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
