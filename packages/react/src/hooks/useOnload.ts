import { useEffect, useRef } from "react"

import { UiNodeInput } from "../types"
import { triggerToWindowCall } from "../lib"

export function useOnload(node: UiNodeInput) {
  const hasRun = useRef(false)

  const {
    onloadTrigger,
    onclick: _ignoredOnclick,
    onload: _ignoredOnload,
  } = node.attributes

  useEffect(() => {
    if (!hasRun.current && onloadTrigger) {
      hasRun.current = true
      triggerToWindowCall(onloadTrigger)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
