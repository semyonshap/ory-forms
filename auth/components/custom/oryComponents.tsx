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
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import JikoIcon from "../icons/jiko-icon"
import { useCooldown } from "@/hooks/useCooldown"
import { cn } from "@/lib/utils"
import {
  KeyRound,
  Mail,
  Fingerprint,
  ShieldCheck,
  Timer,
  FileKey,
  Shield,
  Asterisk,
} from "lucide-react"

export const OryComponents: OryClientComponents = {
  Icons: {
    System: {
      Password: KeyRound,
      Code: Mail,
      CodeAsterix: Asterisk,
      Passkey: Fingerprint,
      Webauthn: Shield,
      Totp: Timer,
      LookupSecret: FileKey,
      HardwareToken: ShieldCheck,
    },
  },
  Main: {
    SettingsCard: ({ options, attached }) => {
      const { title, description } = options
      return (
        <Card className="w-[600px] max-w-[600px]">
          {title && (
            <CardHeader>
              <JikoIcon className="pb-6 pt-2" />
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent className="flex flex-col gap-4">{attached}</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      )
    },
    FormCard: ({ options, attached }) => {
      const { title, description, messages } = options
      return (
        <Card className="w-[350px] max-w-[350px]">
          {title && (
            <CardHeader>
              <JikoIcon className="pb-6 pt-2" />
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
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
            {attached}
          </CardContent>
        </Card>
      )
    },
  },
  Node: {
    Label: ({ node, options, children, attached }) => {
      const { label } = options
      const { messages } = node

      return (
        <div className="flex flex-col gap-1">
          <Label className="inline-flex justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {label}
            </span>
            {attached}
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
        <Link
          className="text-sm text-brand-primary underline-offset-2 hover:underline cursor-pointer"
          {...props}
          title={label}
        >
          {label}
        </Link>
      )
    },
    Resend: ({ props, options }) => {
      const { label } = options
      const cooldown = useCooldown(60)

      return (
        <Button
          {...props}
          variant="link"
          className={cn(
            "p-0 text-brand-primary",
            cooldown.isActive && "hover:no-underline text-muted-foreground",
          )}
          onClick={(e) => {
            if (cooldown.isActive) {
              e.preventDefault()
              return
            }
            cooldown.start()
            props.onClick?.(e)
          }}
        >
          {cooldown.isActive && (
            <span className="tabular-nums">{cooldown.remaining}s</span>
          )}
          <span>{label}</span>
        </Button>
      )
    },
    AuthMethod: ({ props, options }) => {
      const { label, description, icon: Icon } = options

      return (
        <Button
          {...props}
          variant="outline"
          className="inline-flex gap-4 h-auto w-full whitespace-normal items-start"
        >
          {Icon && <Icon className="size-5 shrink-0 mt-3" />}
          <div className="flex flex-col gap-1 justify-start items-start min-w-0">
            {label}
            {description && (
              <span className="text-muted-foreground text-left text-sm">
                {description}
              </span>
            )}
          </div>
        </Button>
      )
    },
    Button: ({ props, options }) => {
      const { type, label, icon: Icon, isSubmitting } = options

      const buttonConfig = {
        link: { variant: "link", className: "justify-start p-0" },
        cancel: { variant: "destructive", className: "w-full justify-center" },
        submit: { variant: "outline", className: "w-full justify-center" },
        sso: { variant: "outline", className: "w-full justify-start gap-16" },
      } as const

      const config = buttonConfig[type as keyof typeof buttonConfig] ?? {
        variant: "outline",
        className: "",
      }

      return (
        <Button
          {...props}
          className={cn("text-center", config.className)}
          variant={config.variant}
        >
          {type == "submit" && isSubmitting && <Spinner />}
          {Icon && <Icon className={cn(label ? "size-4" : "size-6")} />}
          <span>{label}</span>
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
          className="w-full"
          onKeyDown={(e) => {
            if ((value as string)?.length >= elements && e.key.length === 1) {
              e.preventDefault()
            }
          }}
        >
          <InputOTPGroup className="w-full">
            {Array.from({ length: elements }, (_, index) => (
              <InputOTPSlot
                index={index}
                key={index}
                className="text-2xl w-full aspect-square h-auto"
              />
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
