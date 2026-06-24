/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { FieldConfig, formRegistry } from "./types";

function unwrapSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema;
  while (true) {
    const def = (current.def as any);
    if (
      def.type === "optional" ||
      def.type === "nullable" ||
      def.type === "registry" ||
      def.type === "default"
    ) {
      current = def.innerType;
    } else {
      break;
    }
  }
  return current;
}

function extractDefault(schema: z.ZodTypeAny): any {
  let current = schema;
  while (current) {
    const def = (current.def as any);
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

function extractOptions(schema: z.ZodTypeAny):
  | { value: string; label: string }[]
  | undefined {
  const unwrapped = unwrapSchema(schema);
  const def = (unwrapped.def as any);
  if (def.type === "enum") {
    return (Object.values(def.entries) as string[]).map((v) => ({
      value: v,
      label: v,
    }));
  }
  if (def.type === "array") {
    const inner = def.element;
    if (inner && inner._def && (inner.def as any).type === "enum") {
      return (Object.values((inner.def as any).entries) as string[]).map((v) => ({
        value: v,
        label: v,
      }));
    }
  }
  return undefined;
}

function mergeMeta(
  parentMeta: Record<string, any>,
  childMeta: Record<string, any>
): Record<string, any> {
  const merged = { ...parentMeta };

  for (const [key, value] of Object.entries(childMeta)) {
    if (key === "hidden") {
      const parentHidden = parentMeta.hidden;
      const childHidden = value;
      if (parentHidden && childHidden) {
        merged.hidden = (values: any) => parentHidden(values) || childHidden(values);
      } else if (childHidden) {
        merged.hidden = childHidden;
      }
    } else {
      if (value !== undefined) {
        merged[key] = value;
      }
    }
  }

  return merged;
}

function getMeta(schema: z.ZodTypeAny): Record<string, any> {
  let current = schema;
  while (true) {
    const meta = formRegistry.get(current);
    if (meta) return meta;
    const def = (current.def as any);
    if (def.type === "optional" || def.type === "nullable" || def.type === "default") {
      current = def.innerType;
    } else {
      break;
    }
  }
  return {};
}

export function parseZodSchema<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T
): FieldConfig[] {
  const fields: FieldConfig[] = [];

  const stack: {
    shape: Record<string, any>;
    prefix: string;
    inheritedMeta: Record<string, any>;
  }[] = [
    {
      shape: schema.shape,
      prefix: "",
      inheritedMeta: {},
    },
  ];

  while (stack.length > 0) {
    const { shape, prefix, inheritedMeta } = stack.pop()!;

    for (const [key, fieldSchema] of Object.entries(shape)) {
      const fullName = prefix ? `${prefix}.${key}` : key;

      const ownMeta = getMeta(fieldSchema);
      const fieldMeta = mergeMeta(inheritedMeta, ownMeta);

      const unwrapped = unwrapSchema(fieldSchema);

      if ((unwrapped.def as any).type === "object") {
        stack.push({
          shape: (unwrapped as any).shape,
          prefix: fullName,
          inheritedMeta: fieldMeta,
        });
        continue;
      }

      const defaultValue = extractDefault(fieldSchema);
      const options = extractOptions(fieldSchema);

      const config: FieldConfig = {
        name: fullName,
        ...fieldMeta,
        options,
        defaultValue,
        label: fieldMeta.label ?? key,
      };

      fields.push(config);
    }
  }

  return fields;
}