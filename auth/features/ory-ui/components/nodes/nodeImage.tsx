import { UiNode, UiNodeImageAttributes } from "@ory/client-fetch"
import Image from "next/image"

interface Props {
  node: UiNode
  attributes: UiNodeImageAttributes
}

export const NodeImage = ({ node, attributes }: Props) => {
  return (
    <div className="relative w-48 h-48">
      <Image
        data-testid={`node/image/${attributes.id}`}
        src={attributes.src}
        alt={node.meta.label?.text || ""}
        fill
        className="object-contain"
      />
    </div>
  )
}