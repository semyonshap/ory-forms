import { useFlowStore } from "../../context"
import { NodeRenderImage } from "../../types"
import { UiNodeImageAttributes } from "@ory/client-fetch"
import { omitInputAttributes } from "../../utils/transform"

export function ImageWrapper({ node, attached }: NodeRenderImage) {
  const Node = useFlowStore((state) => state.components.Node)

  const props = omitInputAttributes<UiNodeImageAttributes>(node.attributes)

  return <Node.Image node={node} props={props} attached={attached} />
}
