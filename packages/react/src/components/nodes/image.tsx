import { FormRenderImageProps } from "../../types/render"

export function NodeImage({ node, props }: FormRenderImageProps) {
  return (
    <figure>
      <img {...props} alt={node.meta.label?.text || ""} />
    </figure>
  )
}
