import { useFormContext } from "react-hook-form"
import { NodeInputProps, useOnload } from "../helpers"

export function NodeInputHidden({ attributes }: NodeInputProps) {
  const { register } = useFormContext()
  useOnload(attributes as any)

  return <input type="hidden" {...register(attributes.name)} />
}
