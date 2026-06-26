import { NodeInputButton } from "./nodeInputButton"
import { NodeInputCheckbox } from "./nodeInputCheckbox"
import { NodeInputDefault } from "./nodeInputDefault"
import { NodeInputHidden } from "./nodeInputHidden"
import { NodeInputSubmit } from "./nodeInputSubmit"
import { NodeInputProps } from "../helpers"

export function NodeInput<T>(props: NodeInputProps) {
  const { attributes } = props

  switch (attributes.type) {
    case "hidden":
      return <NodeInputHidden {...props} />
    case "checkbox":
      return <NodeInputCheckbox {...props} />
    case "button":
      return <NodeInputButton {...props} />
    case "submit":
      return <NodeInputSubmit {...props} />
  }

  return <NodeInputDefault {...props} />
}
