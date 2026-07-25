import { UiNodeGroupEnum } from '@ory/client-fetch'

import { BuildContext } from '../../types'
import { createInputNode, createUiText } from '../nodes/factory'

export function BuildAuthMethodList({
  groups,
  selectMethod,
  ctx: { t },
}: {
  groups: UiNodeGroupEnum[]
  selectMethod: (method: UiNodeGroupEnum) => void
  ctx: BuildContext
}) {
  return groups.map((group) => {
    return createInputNode({
      group,
      attributes: {
        name: `method`,
        type: 'submit',
        value: group,
        disabled: false,
      },
      data: {
        variant: 'method',
        description: t(`two-step.${group}.description`),
        onClick: () => selectMethod(group),
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
