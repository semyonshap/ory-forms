import { UiNode } from "@ory/client-fetch"

import { FormNode, InputNodeData } from "../../types"
import { isResendNode, isSsoNode } from "./filters"

export function computeDataBuilder(nodes: UiNode[]): FormNode[] {
  return nodes.map((node) => {
    if (isResendNode(node)) {
      const data: InputNodeData = {
        target: "code",
        type: "resend",
        inputType: "link",
      }

      return {
        ...node,
        data,
      }
    } else if (isSsoNode(node)) {
      const data: InputNodeData = {
        inputType: "sso",
      }

      return {
        ...node,
        data,
      }
    }

    return node
  })
}
