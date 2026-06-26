import { getNodeLabel } from "@ory/client-fetch"
import { Button } from "@/components/ui/button"
import { NodeInputProps } from "../helpers"

export function NodeInputSubmit({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  const label = getNodeLabel(node)
  const labelText = label?.text || ""

  return (
    <Button
      variant="outline"
      type="submit"
      name={attributes.name}
      value={attributes.value || ""}
      disabled={attributes.disabled || disabled}
      className="w-full"
    >
      {labelText}
    </Button>
  )
}
