import { useAnchor } from '../../hooks'
import { WrapperAnchor } from '../../types'
import { useStoreClient, useFlowStore } from '../../context'

export function AnchorWrapper({
  node,
  children,
  attached,
}: WrapperAnchor) {
  const store = useStoreClient()

  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useAnchor(node)

  return (
    <Node.Anchor
      node={node}
      props={props}
      options={options}
      store={store}
      attached={attached}
    >
      {children}
    </Node.Anchor>
  )
}
