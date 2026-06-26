import { getNodeLabel } from "@ory/client-fetch"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NodeInputProps, useNodeMessages } from "../helpers"
import { resolvePlaceholder } from "../../utils/text"

export function NodeInputDefault({
  node,
  attributes,
  disabled,
}: NodeInputProps) {
  const { register } = useFormContext()
  const label = getNodeLabel(node)
  const placeholder = resolvePlaceholder(label)
  const { errors, infos, hasError } = useNodeMessages(node)

  return (
    <div className="grid gap-1.5">
      {label && <Label htmlFor={attributes.name}>{label.text}</Label>}
      <Input
        id={attributes.name}
        type={attributes.type}
        placeholder={placeholder}
        disabled={attributes.disabled || disabled}
        className={hasError ? "border-destructive" : ""}
        onClick={() => attributes.onclick && new Function(attributes.onclick)()}
        {...register(attributes.name)}
      />
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
  )
}
