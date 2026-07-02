import { FormRenderImage } from "../../types/render"

export function NodeImage({ node, props }: FormRenderImage) {
  return (
    <figure>
      <img {...props} alt={node.meta.label?.text || ""} />
    </figure>
  )
}
