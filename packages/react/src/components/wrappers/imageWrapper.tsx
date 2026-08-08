import { UiNodeImageAttributes } from '@ory/client-fetch'

import { WrapperImage } from '../../types'
import { omitInputAttributes } from '../../utils/transform'
import { useStoreClient, useFlowStore } from '../../context'

export function ImageWrapper({ node, children, attached }: WrapperImage) {
  const store = useStoreClient()

  const Node = useFlowStore((state) => state.components.Node)

  const props = omitInputAttributes<UiNodeImageAttributes>(node.attributes)

  return (
    <Node.Image
      node={node}
      props={props}
      store={store}
      attached={attached}
    >
      {children}
    </Node.Image>
  )
}
