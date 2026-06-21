import { FieldPath, FieldValues } from "react-hook-form"

export type FormFieldValue = string | number | boolean | string[] | object | undefined

export type SelectFieldValue = string | undefined

export type FieldType = "select" | "radio" | "combobox" | "multi-select" | "creatable-multi-select"

export interface Option {
  value: string
  label?: string
}

export interface BaseFieldConfig<T extends FieldValues> {
  label: string
  placeholder?: string | ((values: T) => string)
  disabled?: boolean | ((values: T) => boolean)
  hide?: boolean | ((values: T) => boolean)
}

export interface EditFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  name: FieldPath<T>
}

export interface SelectFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  name: FieldPath<T>
  type: FieldType
  options?: Option[] | ((values: T) => Option[])
  onInputChange?: (value: string) => void // Для combobox
  onCreateOption?: (inputValue: string) => void // Для creatable-multi-select
}

export interface ViewFieldConfig<T extends FieldValues> extends BaseFieldConfig<T> {
  onClick?: (value: FormFieldValue) => void
}

export type FieldGroupConfig<T extends FieldValues> =
  | EditFieldConfig<T>
  | SelectFieldConfig<T>

export function isSelectConfig<T extends FieldValues>(config: FieldGroupConfig<T>): config is SelectFieldConfig<T> {
  return 'type' in config
}

export interface FieldProps {
  value: FormFieldValue
  onChange: (value: FormFieldValue) => void
  onBlur: () => void
  name: string
}