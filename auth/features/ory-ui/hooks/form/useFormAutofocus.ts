import { useEffect, useRef } from "react"
import { UiNode, FlowType } from "@ory/client-fetch"
import { UseFormSetFocus } from "react-hook-form"
import { isNodeVisible } from "../../utils"
import { FormValues, isUiNodeInput } from "../../types"

function pickAutofocusField(nodes: UiNode[]): string | undefined {
  const node = nodes.find((node) => {
    return (
      isNodeVisible(node) &&
      (node.attributes.type === "text" ||
        node.attributes.type === "email" ||
        node.attributes.type === "password")
    )
  })
  if (!node || !isUiNodeInput(node)) {
    return undefined
  }
  return node.attributes.name
}

export function useFormAutofocus(
  nodes: UiNode[],
  isReady: boolean,
  flowType: FlowType,
  setFocus: UseFormSetFocus<FormValues>,
): void {
  const lastAutofocusField = useRef<string | null>(null)

  useEffect(() => {
    if (!isReady || flowType === FlowType.Settings) {
      return
    }

    const field = pickAutofocusField(nodes)
    if (!field) {
      return
    }

    if (lastAutofocusField.current !== field) {
      lastAutofocusField.current = field
      queueMicrotask(() => {
        setFocus(field, { shouldSelect: true })
      })
    }
  }, [isReady, flowType, nodes, setFocus])
}
