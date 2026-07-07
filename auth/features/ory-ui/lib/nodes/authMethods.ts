import { UiNodeGroupEnum } from "@ory/client-fetch"
import { Dispatch } from "react"

import { resolveMethod } from "../../i18n"
import { createButtonNode, createUiText } from "./factory"
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
    return createButtonNode({
      name: "method",
      value: group,
      group,
      buttonType: isImmediateSubmit ? "submit" : "button",
      onClick: isImmediateSubmit
        ? undefined
        : () =>
            dispatchFormState({ type: "action_select_method", method: group }),
      label: createUiText({
        keyOrId: `two-step.${group}.title`,
        text: title,
        t,
      }),
      data: { description, type: "method" },
    })
  })
}
