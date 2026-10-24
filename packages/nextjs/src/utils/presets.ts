import { startCase } from 'lodash-es'

import { createAnchorNode, createUiText } from './factory'

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
