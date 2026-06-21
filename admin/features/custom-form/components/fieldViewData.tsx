import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FormFieldValue, ViewFieldConfig } from "../types"
import { FieldValues } from "react-hook-form"
import { useResolvedConfig } from "../hooks/useResolvedConfig"

interface FieldViewDataProps<T extends FieldValues> {
  value: FormFieldValue
  config: ViewFieldConfig<T>
  values?: T
}

export function FieldViewData<T extends FieldValues>({ value, config, values }: FieldViewDataProps<T>) {
  const { resolvedHide } = useResolvedConfig(config, values)

  if (resolvedHide) return null

  const renderedValue = (() => {
    switch (true) {
      case value === undefined || value === null:
        return <span className="text-muted-foreground">N/A</span>
      case typeof value === 'boolean':
        return <span>{value ? 'Yes' : 'No'}</span>
      case typeof value === 'number':
        return <span>{value}</span>
      case Array.isArray(value):
        if (value.length === 0) {
          return <span className="text-muted-foreground">N/A</span>
        }
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((item, index) => (
              <Badge key={index} variant="outline">
                {item}
              </Badge>
            ))}
          </div>
        )
      case typeof value === 'object' && value !== null && !Array.isArray(value):
        return <span>{JSON.stringify(value, null, 2)}</span>
      case typeof value === 'string':
        if (value === '') {
          return <span className="text-muted-foreground">N/A</span>
        }
        return <span>{value}</span>
      default:
        return <span>{String(value)}</span>
    }
  })()

  return (
    <div className="flex items-center gap-2">
      <Label className="text-sm font-medium">{config.label}</Label>
      <div className="text-sm text-muted-foreground">
        {config.onClick ? (
          <Button variant="link" className="p-0 h-auto" onClick={() => config.onClick?.(value)}>
            {renderedValue}
          </Button>
        ) : (
          renderedValue
        )}
      </div>
    </div>
  )
}