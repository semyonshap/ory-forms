import React from "react"
import { Control, FieldPath, FieldValues, Controller } from "react-hook-form"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { FieldProps } from "../types"

interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  render: (field: FieldProps, invalid?: boolean) => React.ReactElement | null
}

export function FormFieldWrapper<T extends FieldValues>({ control, name, label, render }: FormFieldWrapperProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel>{label}</FieldLabel>
          {render(field, fieldState.invalid)}
          {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
        </Field>
      )}
    />
  )
}