"use client"

import { OryClientComponents } from "@/features/ory-ui/types"
import Image from "next/image"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

export const OryComponents: OryClientComponents = {
  Card: {
    Root: ({ header, footer, nodes }) => {
      return (
        <div className="flex w-full flex-1 items-start justify-center sm:items-center">
          <Card className="w-full sm:w-[350px] sm:max-w-[350px]">
            {header.title && (
              <CardHeader>
                <CardTitle>{header.title}</CardTitle>
                {header.description && (
                  <CardDescription>{header.description}</CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent>{nodes}</CardContent>
            <CardFooter>{footer}</CardFooter>
          </Card>
        </div>
      )
    },
  },
  Node: {
    Anchor: ({ props, options }) => {
      const label = options.label
      return (
        <Button
          {...props}
          title={label}
          variant="link"
          className="cursor-pointer"
        >
          {label}
        </Button>
      )
    },
    MethodButton: ({ node }) => null,
    Button: ({ props, options }) => {
      const { isSubmitting, label, icon: Icon } = options
      return (
        <Button className="w-full" {...props} variant="outline">
          {isSubmitting ? <Spinner /> : Icon && <Icon />}
          {label}
        </Button>
      )
    },
    SsoButton: ({ node, props, options }) => {
      const { isSubmitting, label, icon: Icon } = options

      return (
        <Button {...props} variant="outline">
          {Icon && <Icon size={label ? 16 : 20} />}
          {isSubmitting && <Spinner />}
          {label && node.meta.label && <span>{label}</span>}
        </Button>
      )
    },
    Input: ({ props, options }) => {
      const { label } = options

      return (
        <div className="flex flex-col gap-2">
          {label && (
            <Label className="text-sm font-medium text-muted-foreground">
              {label}
            </Label>
          )}
          <Input {...props} />
        </div>
      )
    },
    Code: ({ props }) => {
      const { value, maxLength, ...restInputProps } = props
      const elements = maxLength ?? 6

      return (
        <InputOTP
          {...restInputProps}
          value={value as string}
          maxLength={elements}
        >
          <InputOTPGroup>
            {Array.from({ length: elements }, (_, index) => (
              <InputOTPSlot index={index} key={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )
    },
    Image: ({ node, props }) => {
      return (
        <figure>
          <Image {...props} alt={node.meta.label?.text || ""} />
        </figure>
      )
    },
    Select: ({ node }) => null,
    Text: ({ options }) => {
      return <Label>{options.label}</Label>
    },
  },
}
