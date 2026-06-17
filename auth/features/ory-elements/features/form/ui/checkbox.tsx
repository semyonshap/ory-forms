// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { getNodeLabel } from "@ory/client-fetch"
import {
  messageTestId,
  OryNodeCheckboxProps,
  uiTextToFormattedMessage,
} from "@/features/ory-elements"
import { useIntl } from "react-intl"
import { cn } from "../../../shared/util/cn"
import { CheckboxLabel } from "../../../shared/ui/checkbox-label"
import { Checkbox } from "@/components/ui/checkbox"

export const DefaultCheckbox = ({ node, inputProps }: OryNodeCheckboxProps) => {
  const intl = useIntl()
  const label = getNodeLabel(node)
  const hasError = node.messages.some((m) => m.type === "error")

  return (
    <label className="flex cursor-pointer items-start gap-3 self-stretch antialiased">
      <span className="flex h-5 items-center">
        <Checkbox
          checked={!!(inputProps.checked ?? inputProps.value)}
          onCheckedChange={(checked: boolean | "indeterminate") => {
            const event = { target: { value: checked === true, name: inputProps.name } }
            inputProps.onChange(event)
          }}
          className={cn(
            hasError && "border-interface-border-validation-danger",
          )}
          data-testid={`ory/form/node/input/${node.attributes.name}`}
        />
      </span>
      <span className="flex flex-col">
        <span className="leading-tight font-normal text-interface-foreground-default-primary">
          <CheckboxLabel label={label} />
        </span>
        {node.messages.map((message) => (
          <span
            key={message.id}
            className={cn(
              "mt-1",
              message.type === "error"
                ? "text-interface-foreground-validation-danger"
                : "text-interface-foreground-default-secondary",
            )}
            {...messageTestId(message)}
          >
            {uiTextToFormattedMessage(message, intl)}
          </span>
        ))}
      </span>
    </label>
  )
}
