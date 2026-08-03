import { UiNodeImageAttributes } from '@ory/client-fetch'

import { WrapperImage } from '../../types'
import { useFlowStore } from '../../context'
import { omitInputAttributes } from '../../utils/transform'

export function ImageWrapper({ node, attached }: WrapperImage) {
  const Node = useFlowStore((state) => state.components.Node)

  const props = omitInputAttributes<UiNodeImageAttributes>(node.attributes)

  return <Node.Image node={node} props={props} attached={attached} />
}
