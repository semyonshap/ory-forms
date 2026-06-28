import { getNodeId } from "@ory/client-fetch"
import { Node } from "./nodes/node"
import { Messages } from "./messages"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useFlowFormContext } from "../context/flow-provider"
import { useCardHeaderText } from "../hooks/useCardHeaderText"

export function FlowContent() {
  const { flow, nodes, isSubmitting, dispatchSubmit, formState } =
    useFlowFormContext()

  const { title, description } = useCardHeaderText(flow.flow.ui, {
    flowType: flow.flowType,
    flow: flow.flow,
    formState: formState,
  })

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
            {nodes.map((node, k) => (
              <Node
                key={`${getNodeId(node)}-${k}`}
                disabled={isSubmitting}
                node={node}
                dispatchSubmit={dispatchSubmit}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
