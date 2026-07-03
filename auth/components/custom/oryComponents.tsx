"use client"

import Link from "next/link"
import Image from "next/image"

import { OryClientComponents } from "@/features/ory-ui/types"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import JikoIcon from "../icons/jiko-icon"
import { cn } from "@/lib/utils"

export const OryComponents: OryClientComponents = {
  Card: {
    Root: ({ header, nodes, messages }) => {
      return (
        <div className="flex w-full flex-1 items-start justify-center sm:items-center">
          <Card className="w-full sm:w-[350px] sm:max-w-[350px]">
            {header.title && (
              <CardHeader>
                <JikoIcon className="pb-6 pt-2" />
                <CardTitle>{header.title}</CardTitle>
                {header.description && (
                  <CardDescription>{header.description}</CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent className="flex flex-col gap-4">
              {messages &&
                messages.map((msg, index) => (
                  <Alert
                    key={`${msg.id}-${index}`}
                    variant={msg.type === "error" ? "destructive" : "default"}
                  >
                    <AlertDescription>{msg.text}</AlertDescription>
                  </Alert>
                ))}
              {nodes}
            </CardContent>
          </Card>
        </div>
      )
    },
  },
  Node: {
    Label: ({ node, options, children, context }) => {
      const { label } = options
      const { messages } = node

      return (
        <div className="flex flex-col gap-1">
          <Label className="inline-flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
            {context?.[node.attributes.name]}
          </Label>
          {children}
          {messages?.map((msg) => (
            <span
              key={msg.id}
              className={cn(
                "text-sm",
                msg.type === "error" && "text-destructive",
                msg.type === "info" && "text-muted-foreground",
              )}
            >
              {msg.text}
            </span>
          ))}
        </div>
      )
    },
    Anchor: ({ props, options }) => {
      const { label } = options
      return (
        <Button
          variant="link"
          asChild
          className="cursor-pointer px-2 text-brand-primary"
        >
          <Link {...props} title={label}>
            {label}
          </Link>
        </Button>
      )
    },
    MethodButton: ({ node }) => null,
    Button: ({ props, options }) => {
      const { type, label, icon: Icon, isSubmitting } = options

      const buttonConfig = {
        link: { variant: "link", className: "justify-start" },
        cancel: { variant: "destructive", className: "justify-center" },
        submit: { variant: "outline", className: "justify-center" },
        sso: { variant: "outline", className: "justify-start gap-16" },
      } as const

      const config = buttonConfig[type as keyof typeof buttonConfig] ?? {
        variant: "outline",
        className: "",
      }

      return (
        <Button
          {...props}
          className={cn("w-full text-center", config.className)}
          variant={config.variant}
        >
          {type == "submit" && isSubmitting && <Spinner />}
          {Icon && <Icon className={cn(label ? "size-4" : "size-6")} />}
          {label}
        </Button>
      )
    },
    Input: ({ props }) => {
      return <Input {...props} />
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
      const { label, text } = options
      return (
        <Label>
          {label && label} {text && text}
        </Label>
      )
    },
  },
}
