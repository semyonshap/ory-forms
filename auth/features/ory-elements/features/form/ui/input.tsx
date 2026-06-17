// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { FlowType } from "@ory/client-fetch"
import { OryNodeInputProps, useOryFlow } from "@/features/ory-elements"
import { ComponentPropsWithRef, forwardRef } from "react"
import { cn } from "../../../shared/util/cn"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "./password-input"

type InputProps = ComponentPropsWithRef<"input">

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { flowType } = useOryFlow()
    return (
      <Input
        {...props}
        className={cn(
          flowType === FlowType.Settings && "max-w-[488px]",
          className,
        )}
        ref={ref}
      />
    )
  },
)

TextInput.displayName = "TextInput"

const DefaultInputRoot = ({ inputProps }: OryNodeInputProps) => {
  if (inputProps.type === "password") {
    return (
      <PasswordInput
        data-testid={`ory/form/node/input/${inputProps.name}`}
        {...inputProps}
      />
    )
  }

  if (inputProps.type === "hidden") {
    return (
      <input
        data-testid={`ory/form/node/input/${inputProps.name}`}
        {...inputProps}
      />
    )
  }

  return (
    <TextInput
      data-testid={`ory/form/node/input/${inputProps.name}`}
      {...inputProps}
    />
  )
}

export const DefaultInput = Object.assign(DefaultInputRoot, {
  TextInput,
  PasswordInput,
})
