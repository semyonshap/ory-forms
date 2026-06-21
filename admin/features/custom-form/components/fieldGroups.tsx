import { Control, FieldValues } from "react-hook-form"
import { FieldEditData } from "./fieldEditData"
import { FieldSelectData } from "./fieldSelectData"
import { FieldGroupConfig, isSelectConfig } from "../types"

interface FieldGroupsProps<T extends FieldValues> {
  control: Control<T>
  configs: FieldGroupConfig<T>[]
  onChange?: (name: string, value: string | string[]) => void
  values?: T
}

export function FieldGroups<T extends FieldValues>({ control, configs, onChange, values }: FieldGroupsProps<T>) {
  return (
    <>
      {configs.map((config) => {
        if (isSelectConfig(config)) {
          return (
            <FieldSelectData
              key={config.name}
              control={control}
              config={config}
              onChange={(value) => onChange?.(config.name, value)}
              values={values}
            />
          )
        } else {
          return (
            <FieldEditData
              key={config.name}
              control={control}
              config={config}
              values={values}
            />
          )
        }
      })}
    </>
  )
}