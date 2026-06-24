/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { FieldConfig, formRegistry } from "./types";

function unwrap(schema: any): any {
  let current = schema;
  while (true) {
    const def = current._def;
    if (def.type === "optional" || def.type === "nullable") {
      current = def.innerType;
    } else if (def.type === "default") {
      current = def.innerType;
    } else if (def.type === "registry") {
      current = def.innerType;
    } else {
      break;
    }
  }
  return current;
}

function getDefaultValue(schema: any): any {
  let current: any = schema;
  while (current) {
    const def = current._def;
    if (def.type === "default") {
      return def.defaultValue;
    }
    if (
      def.type === "optional" ||
      def.type === "nullable" ||
      def.type === "registry"
    ) {
      current = def.innerType;
    } else {
      break;
    }
  }
  return undefined;
}

function getOptionsFromEnum(
  schema: any,
): { value: string; label: string }[] | undefined {
  const def = schema._def;
  if (def.type === "enum") {
    return (Object.values(def.entries) as string[]).map((v) => ({
      value: v,
      label: v,
    }));
  }
  if (def.type === "array") {
    const inner = def.element;
    if (inner._def.type === "enum") {
      return (Object.values(inner._def.entries) as string[]).map((v) => ({
        value: v,
        label: v,
      }));
    }
  }
  return undefined;
}

export function parseZodSchema<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
): FieldConfig[] {
  const shape = schema.shape;
  const fields: FieldConfig[] = [];

  for (const [name, fieldSchema] of Object.entries(shape)) {
    const meta = formRegistry.get(fieldSchema) ?? {};
    const defaultValue = getDefaultValue(fieldSchema);
    const options = getOptionsFromEnum(unwrap(fieldSchema));

    fields.push({
      name,
      type: meta.interface ?? "string",
      label: meta.label ?? name,
      placeholder: meta.placeholder,
      options,
      defaultValue,
    });
  }

  return fields;
}
