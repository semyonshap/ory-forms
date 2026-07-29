import { useFlowStore } from '../../context'
import { WrapperAnchor } from '../../types'
import { useAnchor } from '../../hooks'

export function AnchorWrapper({ node, attached }: WrapperAnchor) {
  const Node = useFlowStore((state) => state.components.Node)

  const { props, options } = useAnchor(node)

  return (
    <Node.Anchor
      node={node}
      props={props}
      options={options}
      attached={attached}
    />
  )
}
