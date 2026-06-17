"use client"

import { useComponents } from "../../../context"
import { UiNodeInput } from "../../../shared/util/utilFixSDKTypesHelper"
import { useInputProps } from "../hooks/useInputProps"

type HiddenInputRendererProps = {
  node: UiNodeInput
}

export function HiddenInputRenderer({ node }: HiddenInputRendererProps) {
  const { Node } = useComponents()
  const attributes = node.attributes
  const inputProps = useInputProps(attributes)

  return (
    <Node.Input
      inputProps={inputProps}
      attributes={attributes}
      node={node}
      onClick={() => {}}
    />
  )
}
