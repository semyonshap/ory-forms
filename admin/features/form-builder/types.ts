import z from "zod";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "radio"
  | "combobox"
  | "multiselect";

export interface FormFieldMeta {
  label?: string;
  placeholder?: string;
  interface?: FieldType;
}

export const formRegistry = z.registry<FormFieldMeta>();

export type FormValues<T extends z.ZodObject<z.ZodRawShape>> = z.infer<T>;

export type FieldHandlers<T extends z.ZodObject<z.ZodRawShape>> = {
  onInputChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  getOptions?: (
    formValues: FormValues<T>,
  ) => { value: string; label: string }[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFieldHandlers = FieldHandlers<any>;

export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: unknown;
}

export interface InputProps {
  field: ControllerRenderProps<FieldValues, string>;
  config: FieldConfig;
  handlers?: AnyFieldHandlers;
  invalid?: boolean;
}
