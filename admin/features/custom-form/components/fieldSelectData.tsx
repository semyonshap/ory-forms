import { Control, FieldValues } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { MultiCombobox } from "@/components/custom/multiCombobox";
import { SelectFieldConfig, FieldProps } from "../types";
import { useResolvedSelectConfig } from "../hooks/useResolvedConfig";
import { FormFieldWrapper } from "./formFieldWrapper";

interface FieldSelectDataProps<T extends FieldValues> {
  control: Control<T>;
  config: SelectFieldConfig<T>;
  onChange?: (value: string | string[]) => void;
  values?: T;
}

export function FieldSelectData<T extends FieldValues>({
  control,
  config,
  onChange,
  values,
}: FieldSelectDataProps<T>) {
  const {
    resolvedHide,
    resolvedPlaceholder,
    resolvedDisabled,
    resolvedOptions,
  } = useResolvedSelectConfig(config, values);

  if (resolvedHide) return null;

  const renderSelect = (field: FieldProps, invalid?: boolean) => {
    if (config.type === "select") {
      return (
        <Select
          onValueChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          value={field.value as string}
          disabled={resolvedDisabled}
        >
          <SelectTrigger className="w-full" aria-invalid={invalid}>
            <SelectValue placeholder={resolvedPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {resolvedOptions?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label || option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    } else if (config.type === "combobox") {
      return (
        <Combobox
          value={field.value as string}
          onValueChange={(val) => field.onChange(val ?? "")}
        >
          <ComboboxInput placeholder={resolvedPlaceholder} />
          <ComboboxContent>
            <ComboboxList>
              {resolvedOptions?.map((opt) => (
                <ComboboxItem key={opt.value} value={opt.value}>
                  {opt.label || opt.value}
                </ComboboxItem>
              ))}
            </ComboboxList>
            <ComboboxEmpty>Ничего не найдено</ComboboxEmpty>
          </ComboboxContent>
        </Combobox>
      );
    } else if (config.type === "radio") {
      return (
        <RadioGroup
          onValueChange={(value) => {
            field.onChange(value);
            onChange?.(value);
          }}
          value={field.value as string}
          className="flex flex-row space-x-4"
        >
          {resolvedOptions?.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <label htmlFor={option.value}>
                {option.label || option.value}
              </label>
            </div>
          ))}
        </RadioGroup>
      );
    } else if (config.type === "multi-select") {
      return (
        <MultiCombobox
          options={
            resolvedOptions?.map((opt) => ({
              value: opt.value,
              label: opt.label || opt.value,
            })) || []
          }
          value={field.value as string[]}
          onChange={(newValue) => {
            field.onChange(newValue);
            onChange?.(newValue);
          }}
          onInputChange={config.onInputChange}
          placeholder={resolvedPlaceholder}
          className="w-full"
        />
      );
    } else if (config.type === "creatable-multi-select") {
      return (
        <MultiCombobox
          options={
            resolvedOptions?.map((opt) => ({
              value: opt.value,
              label: opt.label || opt.value,
            })) || []
          }
          value={field.value as string[]}
          onChange={(newValue) => {
            field.onChange(newValue);
            onChange?.(newValue);
          }}
          onInputChange={config.onInputChange}
          onCreateOption={config.onCreateOption}
          placeholder={resolvedPlaceholder}
          className="w-full"
          creatable={true}
        />
      );
    }
    return null;
  };

  return (
    <FormFieldWrapper
      control={control}
      name={config.name}
      label={config.label}
      render={renderSelect}
    />
  );
}
