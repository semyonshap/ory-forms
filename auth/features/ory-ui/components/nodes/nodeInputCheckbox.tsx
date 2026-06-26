import { getNodeLabel } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { NodeInputProps, useNodeMessages } from "../helpers"

export function NodeInputCheckbox({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  const { setValue, watch } = useFormContext()
  const label = getNodeLabel(node)
  const { errors, infos, hasError } = useNodeMessages(node)

  return (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={attributes.name}
        checked={!!watch(attributes.name)}
        onCheckedChange={(checked) => setValue(attributes.name, checked)}
        disabled={attributes.disabled || disabled}
        className={hasError ? "border-destructive" : ""}
      />
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={attributes.name}
          className={hasError ? "text-destructive" : ""}
        >
          {label?.text}
        </Label>
        {infos.map((msg) => (
          <p key={msg.id} className="text-sm text-muted-foreground">
            {msg.text}
          </p>
        ))}
        {errors.map((msg) => (
          <p key={msg.id} className="text-sm text-destructive">
            {msg.text}
          </p>
        ))}
      </div>
    </div>
  )
}
