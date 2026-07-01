import { useEffect, useRef } from "react"
import { useFormContext } from "react-hook-form"

import { UiNodeInput } from "../../types"
import { isIgnoredInputNode, triggerToWindowCall } from "../../utils"

export function useNodeInputSetup({ node }: { node: UiNodeInput }) {
  const { setValue } = useFormContext()
  const hasRun = useRef(false)

  const {
    onloadTrigger,
    onclick: _ignoredOnclick,
    onload: _ignoredOnload,
    ...attrs
  } = node.attributes

  useEffect(() => {
    if (attrs.value && !isIgnoredInputNode(node)) {
      setValue(attrs.name, attrs.value)
    }

    if (!hasRun.current && onloadTrigger) {
      hasRun.current = true
      triggerToWindowCall(onloadTrigger)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
