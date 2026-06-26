import { UiNode, UiNodeAnchorAttributes } from "@ory/client-fetch"
import { Button } from "@/components/ui/button"

interface Props {
  node: UiNode
  attributes: UiNodeAnchorAttributes
}

export const NodeAnchor = ({ node, attributes }: Props) => (
  <Button
    data-testid={`node/anchor/${attributes.id}`}
    onClick={(e) => {
      e.preventDefault()
      window.location.href = attributes.href
    }}
  >
    {attributes.title?.text}
  </Button>
)
