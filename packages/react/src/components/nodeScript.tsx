import { UiNodeScript } from '../types'

export const NodeScript = ({ node }: { node: UiNodeScript }) => {
  const {
    async,
    crossorigin,
    referrerpolicy,
    node_type: _,
    src,
    ...rest
  } = node.attributes

  return (
    <script
      async={async}
      crossOrigin={
        crossorigin as 'anonymous' | 'use-credentials' | undefined
      }
      referrerPolicy={
        referrerpolicy as React.HTMLAttributeReferrerPolicy | undefined
      }
      src={src || undefined}
      {...(rest as Record<string, string>)}
    />
  )
}
