import { UiNodeGroupEnum } from '@ory/client-fetch'
import { Dispatch } from 'react'

import { BuildContext, FormStateAction } from '../../types'

import { createInputNode, createUiText } from './factory'

export function BuildAuthMethodList({
  groups,
  dispatchFormState,
  ctx: { t },
}: {
  groups: UiNodeGroupEnum[]
  dispatchFormState: Dispatch<FormStateAction>
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
        type: 'method',
        description: t(`two-step.${group}.description`),
        onClick: () =>
          dispatchFormState({
            type: 'action_select_method',
            method: group,
          }),
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
