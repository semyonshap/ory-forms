import { UiNodeGroupEnum } from '@ory/client-fetch'

import { BuildContext } from '../../types'
import { createInputNode, createUiText } from '../nodes/factory'

export function BuildAuthMethodList({
  groups,
  ctx: { t },
}: {
  groups: UiNodeGroupEnum[]
  ctx: BuildContext
}) {
  return groups.map((group) => {
    return createInputNode({
      group,
      attributes: {
        name: `method-${group}`,
        type: 'button',
        value: group,
        disabled: false,
      },
      data: {
        variant: 'method',
        description: t(`two-step.${group}.description`),
      },
      meta: {
        label: createUiText({
          keyOrId: `two-step.${group}.title`,
          text: `two-step.${group}.title`,
          t,
        }),
      },
    })
  })
}
