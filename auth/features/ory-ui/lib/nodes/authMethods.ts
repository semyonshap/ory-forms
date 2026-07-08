import { UiNodeGroupEnum } from "@ory/client-fetch"
import { Dispatch } from "react"

import { resolveMethod } from "../../i18n"
import { createInputNode, createUiText } from "./factory"
import { BuildContext, FormStateAction } from "../../types"

export function BuildAuthMethodList({
  groups,
  dispatchFormState,
  ctx: { t, flowContainer: container },
}: {
  groups: UiNodeGroupEnum[]
  dispatchFormState: Dispatch<FormStateAction>
  ctx: BuildContext
}) {
  const { flow } = container
  return groups.map((group) => {
    const { title, description } = resolveMethod(group, flow.ui.nodes, t)
    const isImmediateSubmit = group === UiNodeGroupEnum.Code
    return createInputNode({
      group,
      attributes: {
        name: "method",
        type: isImmediateSubmit ? "submit" : "button",
        value: group,
        disabled: false,
      },
      data: {
        type: "method",
        description,
        onClick: isImmediateSubmit
          ? undefined
          : () =>
              dispatchFormState({
                type: "action_select_method",
                method: group,
              }),
      },
      meta: {
        label: createUiText({
          keyOrId: `two-step.${group}.title`,
          text: title,
          t,
        }),
      }
    })
  })
}
