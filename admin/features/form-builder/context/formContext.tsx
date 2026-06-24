import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { createContext, useContext, useMemo } from "react";

import { FieldConfig } from "../types";
import { parseZodSchema } from "../parser";

interface FormContextValue<T extends z.ZodObject<z.ZodRawShape>> {
  methods: UseFormReturn<z.infer<T>>;
  fieldConfigs: FieldConfig[];
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  schema: T;
}

const FormContext = createContext<FormContextValue<any> | undefined>(undefined);

interface FormProviderProps<T extends z.ZodObject<z.ZodRawShape>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  children: React.ReactNode;
}

export function FormProvider<T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  onSubmit,
  children,
}: FormProviderProps<T>) {
  type FormValues = z.infer<T>;

  const fieldConfigs = useMemo(() => parseZodSchema(schema), [schema]);
  const defaultValues = useMemo(() => {
    return fieldConfigs.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.name as keyof FormValues] = field.defaultValue;
      }
      return acc;
    }, {} as Partial<FormValues>);
  }, [fieldConfigs]);

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  } as any) as UseFormReturn<FormValues>;

  const handleSubmit = methods.handleSubmit(onSubmit);
  const isSubmitting = methods.formState.isSubmitting;

  const value: FormContextValue<T> = {
    methods,
    fieldConfigs,
    handleSubmit,
    isSubmitting,
    schema,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext<T extends z.ZodObject<z.ZodRawShape>>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as FormContextValue<T>;
}

export function useFormMethods<T extends z.ZodObject<z.ZodRawShape>>() {
  const { methods } = useFormContext<T>();
  return methods;
}