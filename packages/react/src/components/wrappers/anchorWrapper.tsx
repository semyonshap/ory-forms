import { useAnchor } from '../../hooks'
import { WrapperAnchor } from '../../types'
import { useFlowStore } from '../../context'

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
