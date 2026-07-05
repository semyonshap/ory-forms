import { useCallback } from "react"
import { UiNode } from "@ory/client-fetch"
import { FieldValues } from "react-hook-form"

import { computeDefaultValues } from "../../utils"
import { useFlowStoreShallow } from "../../context"
import { useFormSubmit } from "../form/useFormSubmit"
import { useTransientPayload } from "../form/useTransientPayload"

export function useResendCode(node: UiNode) {
  const {
    flow: { flow },
  } = useFlowStoreShallow((state) => ({ flow: state.flowContainer }))

  const onSubmit = useFormSubmit()

  const { getTransientPayload } = useTransientPayload()

  const handleResend = useCallback(() => {
    const hiddenFields = flow.ui.nodes
      .filter(
        (n) =>
          n.attributes.node_type === "input" &&
          (n.attributes.type === "hidden" || n.group === "default"),
      )
      .map((n) => {
        const cloned = { ...n, attributes: { ...n.attributes } }
        return cloned
      })

    const transientPayload = getTransientPayload()

    const hiddenData = computeDefaultValues({
      active: flow.active,
      ui: { nodes: hiddenFields },
    })

    const dataWithTransient = {
      ...hiddenData,
      transient_payload: transientPayload,
    }

    if (node?.attributes && "name" in node.attributes) {
      const data: FieldValues = {
        code: undefined,
        [node.attributes.name]: node.attributes.value,
        method: "code",
        ...dataWithTransient,
      }
      onSubmit(data)
    }
  }, [flow, node, getTransientPayload, onSubmit])

  return handleResend
}
