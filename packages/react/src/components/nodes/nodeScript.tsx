import { UiNodeScript } from '../../types'

export const NodeScript = ({ node }: { node: UiNodeScript }) => {
  const { crossorigin, referrerpolicy, node_type: _nodeType, ...attributes } = node.attributes

  return (
    <script
      crossOrigin={crossorigin as 'anonymous' | 'use-credentials' | '' | undefined}
      referrerPolicy={referrerpolicy as React.HTMLAttributeReferrerPolicy}
      {...attributes}
    />
  )
}
