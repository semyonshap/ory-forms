import { FieldValues } from "react-hook-form"
import { BaseFieldConfig, SelectFieldConfig, Option } from "../types"

export interface ResolvedBaseConfig {
  resolvedHide: boolean | undefined
  resolvedPlaceholder: string | undefined
  resolvedDisabled: boolean | undefined
}

export interface ResolvedSelectConfig extends ResolvedBaseConfig {
  resolvedOptions: Option[] | undefined
}

export function useResolvedConfig<T extends FieldValues>(
  config: BaseFieldConfig<T>,
  values?: T
): ResolvedBaseConfig {
  const resolvedHide: boolean | undefined = (values && typeof config.hide === 'function') ? config.hide(values) : (config.hide as boolean | undefined)
  const resolvedPlaceholder: string | undefined = (values && typeof config.placeholder === 'function') ? config.placeholder(values) : (config.placeholder as string | undefined)
  const resolvedDisabled: boolean | undefined = (values && typeof config.disabled === 'function') ? config.disabled(values) : (config.disabled as boolean | undefined)

  return { resolvedHide, resolvedPlaceholder, resolvedDisabled }
}

export function useResolvedSelectConfig<T extends FieldValues>(
  config: SelectFieldConfig<T>,
  values?: T
): ResolvedSelectConfig {
  const base = useResolvedConfig(config, values)
  const resolvedOptions: Option[] | undefined = (values && typeof config.options === 'function') ? config.options(values) : (config.options as Option[] | undefined)

  return { ...base, resolvedOptions }
}