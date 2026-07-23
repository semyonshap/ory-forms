import { createAnchorNode, createUiText } from "./factory"
import { startCase } from "lodash-es"

export function createNavigationNode(id: string, href: string) {
  return createAnchorNode({
    attributes: {
      id,
      href,
      title: createUiText({
        id: 9999111,
        text: startCase(id),
      }),
    },
  })
}
