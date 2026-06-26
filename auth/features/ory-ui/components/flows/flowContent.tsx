import { getNodeId } from "@ory/client-fetch"

import { Node } from "../nodes/node"
import { Messages } from "../messages"
import { useFlowForm } from "../../context/form-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FlowCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">test</CardTitle>
      </CardHeader>
      <CardContent>
        <FlowContent />
      </CardContent>
    </Card>
  )
}

export function FlowContent() {
  const { flow, nodes, isLoading, dispatchSubmit, form, onFormSubmit } = useFlowForm()

  if (!flow) return null

  return (
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      onSubmit={form.handleSubmit(onFormSubmit)}
      className="space-y-4"
    >
      <Messages messages={flow.ui.messages} />
      {nodes.map((node, k) => (
        <Node
          key={`${getNodeId(node)}-${k}`}
          disabled={isLoading}
          node={node}
          dispatchSubmit={dispatchSubmit}
        />
      ))}
    </form>
  )
}
