import { Checkbox } from "@/components/ui/checkbox";
import { InputProps } from "../types";

export function BooleanInput({ field, config, handlers, invalid }: InputProps) {
  return (
    <Checkbox
      checked={field.value ?? false}
      onCheckedChange={(checked) => {
        field.onChange(checked);
        handlers?.onInputChange?.(String(checked ?? false));
      }}
      disabled={config.disabled}
      aria-invalid={invalid}
      onBlur={() => {
        field.onBlur();
        handlers?.onBlur?.(String(field.value ?? false));
      }}
      onFocus={() => handlers?.onFocus?.(String(field.value ?? false))}
    />
  );
}
