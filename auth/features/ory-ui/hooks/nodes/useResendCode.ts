import { useCallback } from "react"
import { useFlowStoreShallow } from "../../context"
import { useFormSubmit } from "../form/useFormSubmit"
import { computeDefaultValues } from "../../utils/form"
import { findResendNode } from "../../utils"
import { useTransientPayload } from "../form/useTransientPayload"
import { FieldValues } from "react-hook-form"

export function useResendCode() {
  const {
    flow: { flow },
  } = useFlowStoreShallow((state) => ({ flow: state.flowContainer }))
  const onSubmit = useFormSubmit()

  const { getTransientPayload } = useTransientPayload()

  const resendCodeNode = findResendNode(flow.ui.nodes)

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

    if (resendCodeNode?.attributes && "name" in resendCodeNode.attributes) {
      const data: FieldValues = {
        code: undefined,
        [resendCodeNode.attributes.name]: resendCodeNode.attributes.value,
        method: "code",
        ...dataWithTransient,
      }
      onSubmit(data)
    }
  }, [flow, resendCodeNode, getTransientPayload, onSubmit])

  return {
    resendCode: handleResend,
    resendCodeNode,
  }
}
