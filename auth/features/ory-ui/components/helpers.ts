import { UiNode, UiNodeInputAttributes } from "@ory/client-fetch"
import { useEffect, useMemo } from "react"

export interface NodeInputProps {
  node: UiNode
  attributes: UiNodeInputAttributes
  disabled: boolean
  dispatchSubmit: (submitter?: { name: string; value: string }) => void
}

export function useNodeMessages(node: UiNode) {
  return useMemo(() => {
    const errors = node.messages.filter((m) => m.type === "error")
    const infos = node.messages.filter((m) => m.type !== "error")
    return { errors, infos, hasError: errors.length > 0 }
  }, [node.messages])
}

export const useOnload = (attributes: { onload?: string }) => {
  useEffect(() => {
    if (attributes.onload) {
      const intervalHandle = callWebauthnFunction(attributes.onload)

      return () => {
        window.clearInterval(intervalHandle)
      }
    }
  }, [attributes])
}

export const callWebauthnFunction = (functionBody: string) => {
  const run = new Function(functionBody)

  const intervalHandle = window.setInterval(() => {
    if ((window as any).__oryWebAuthnInitialized) {
      run()
      window.clearInterval(intervalHandle)
    }
  }, 100)

  return intervalHandle
}
