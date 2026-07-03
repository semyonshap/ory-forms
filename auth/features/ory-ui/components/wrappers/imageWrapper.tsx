import { useFlowStore } from "../../context"
import { UiNodeImageContext } from "../../types"
import { UiNodeImageAttributes } from "@ory/client-fetch"
import { omitInputAttributes } from "../../utils/attributes"

export function ImageWrapper({ node, context }: UiNodeImageContext) {
  const Node = useFlowStore((state) => state.components.Node)

  const props = omitInputAttributes<UiNodeImageAttributes>(node.attributes)

  return <Node.Image node={node} props={props} context={context} />
}
