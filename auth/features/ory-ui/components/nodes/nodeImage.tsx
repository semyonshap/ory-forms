import { UiNodeImage } from "../../types"

export function NodeImage({ node }: { node: UiNodeImage }) {
  return (
    <figure>
      <img {...node.props.renderAttributes} alt={node.meta.label?.text || ""} />
    </figure>
  )
}
