import { Control, FieldValues } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { EditFieldConfig, FieldProps } from "../types"
import { useResolvedConfig } from "../hooks/useResolvedConfig"
import { FormFieldWrapper } from "./formFieldWrapper"

interface FieldEditDataProps<T extends FieldValues> {
  control: Control<T>
  config: EditFieldConfig<T>
  values?: T
}

function StringInput({ field, placeholder, disabled }: { field: FieldProps, placeholder?: string, disabled?: boolean }) {
  return (
    <Input
      autoComplete="off"
      placeholder={placeholder}
      value={field.value as string}
      onChange={field.onChange}
      onBlur={field.onBlur}
      name={field.name}
      disabled={disabled}
    />
  )
}

function NumberInput({ field, placeholder, disabled }: { field: FieldProps, placeholder?: string, disabled?: boolean }) {
  return (
    <Input
      type="number"
      step="any"
      autoComplete="off"
      placeholder={placeholder}
      value={field.value as number}
      onChange={field.onChange}
      onBlur={field.onBlur}
      name={field.name}
      disabled={disabled}
    />
  )
}

function BooleanInput({ field, disabled }: { field: FieldProps, disabled?: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={field.value as boolean}
        onCheckedChange={field.onChange}
        disabled={disabled}
      />
    </div>
  )
}

function ArrayInput({ field, placeholder, disabled }: { field: FieldProps, placeholder?: string, disabled?: boolean }) {
  return (
    <Textarea
      autoComplete="off"
      placeholder={placeholder}
      value={(field.value as string[]).join(' ')}
      onChange={(e) => {
        const value = e.target.value.split(/\s+/).filter(Boolean);
        field.onChange(value);
      }}
      disabled={disabled}
    />
  )
}

function ObjectInput({ field, placeholder, disabled }: { field: FieldProps, placeholder?: string, disabled?: boolean }) {
  return (
    <Textarea
      autoComplete="off"
      placeholder={placeholder}
      value={JSON.stringify(field.value, null, 2)}
      onChange={(e) => {
        try {
          const parsed = JSON.parse(e.target.value)
          field.onChange(parsed)
        } catch {
          // Invalid JSON, keep as string or something
        }
      }}
      disabled={disabled}
    />
  )
}

function DefaultInput({ field, placeholder, disabled }: { field: FieldProps, placeholder?: string, disabled?: boolean }) {
  return (
    <Input
      autoComplete="off"
      placeholder={placeholder}
      value={field.value ? String(field.value) : ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      name={field.name}
      disabled={disabled}
    />
  )
}

export function FieldEditData<T extends FieldValues>({ control, config, values }: FieldEditDataProps<T>) {
  const { resolvedHide, resolvedPlaceholder, resolvedDisabled } = useResolvedConfig(config, values)

  if (resolvedHide) return null

  const renderInput = (field: FieldProps) => {
    switch (true) {
      case typeof field.value === 'string':
        return <StringInput field={field} placeholder={resolvedPlaceholder} disabled={resolvedDisabled} />
      case typeof field.value === 'number':
        return <NumberInput field={field} placeholder={resolvedPlaceholder} disabled={resolvedDisabled} />
      case typeof field.value === 'boolean':
        return <BooleanInput field={field} disabled={resolvedDisabled} />
      case Array.isArray(field.value):
        return <ArrayInput field={field} placeholder={resolvedPlaceholder} disabled={resolvedDisabled} />
      case typeof field.value === 'object' && field.value !== null && !Array.isArray(field.value):
        return <ObjectInput field={field} placeholder={resolvedPlaceholder} disabled={resolvedDisabled} />
      default:
        return <DefaultInput field={field} placeholder={resolvedPlaceholder} disabled={resolvedDisabled} />
    }
  }

  return (
    <FormFieldWrapper
      control={control}
      name={config.name}
      label={config.label}
      render={renderInput}
    />
  )
}