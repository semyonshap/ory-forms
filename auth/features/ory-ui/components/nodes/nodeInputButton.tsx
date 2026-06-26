import { getNodeLabel } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"

import { callWebauthnFunction, NodeInputProps } from "../helpers"

export function NodeInputButton({
  node,
  attributes,
  disabled,
  dispatchSubmit,
}: NodeInputProps) {
  const { setValue } = useFormContext()

  const label = getNodeLabel(node)
  const labelText = label?.text || ""

  const onClick = () => {
    if (attributes.onclick) {
      callWebauthnFunction(attributes.onclick)
      return
    }

    setValue(attributes.name, attributes.value)
    dispatchSubmit({ name: attributes.name, value: attributes.value ?? "" })
  }

  return (
    <Button
      type="button"
      name={attributes.name}
      onClick={onClick}
      value={attributes.value || ""}
      disabled={attributes.disabled || disabled}
      className="w-full"
    >
      {labelText}
    </Button>
  )
}
