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

export type FieldHandlers = {
  onInputChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  getOptions?: (formValues: any) => { value: string; label: string }[];
};

export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  hidden?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: any;
}

export interface InputProps {
  field: ControllerRenderProps<FieldValues, string>;
  config: FieldConfig;
  handlers?: FieldHandlers;
  invalid?: boolean;
}
