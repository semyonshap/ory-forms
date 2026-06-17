"use client"

import { useComponents } from "../../../context"
import { UiNodeImage } from "../../../shared/util/utilFixSDKTypesHelper"

type ImageRendererProps = {
  node: UiNodeImage
}

export function ImageRenderer({ node }: ImageRendererProps) {
  const { Node } = useComponents()
  return <Node.Image node={node} attributes={node.attributes} />
}
