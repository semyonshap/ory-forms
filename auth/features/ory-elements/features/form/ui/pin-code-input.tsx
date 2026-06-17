// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

"use client"
import { FlowType } from "@ory/client-fetch"
import { OryNodeInputProps, useOryFlow } from "@/features/ory-elements"
import { cn } from "../../../shared/util/cn"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export const DefaultPinCodeInput = ({
  node,
  inputProps,
}: OryNodeInputProps) => {
  const { flowType } = useOryFlow()

  const { value, maxLength, ...restInputProps } = inputProps
  const elements = maxLength ?? 6

  const valueCasted = value as string

  return (
    <InputOTP
      data-testid={`ory/form/node/input/${node.attributes.name}`}
      {...restInputProps}
      value={valueCasted}
      maxLength={elements}
      className="w-full"
    >
      <InputOTPGroup
        className={cn(
          "flex w-full",
          flowType === FlowType.Settings && "max-w-[488px]",
        )}
      >
        {[...Array(elements)].map((_, index) => (
          <InputOTPSlot index={index} key={index} className="flex-1 aspect-square h-auto text-lg" />
        ))}
      </InputOTPGroup>
    </InputOTP>
  )
}
