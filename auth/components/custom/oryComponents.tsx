"use client"

import Link from "next/link"
import Image from "next/image"

import { OryClientComponents } from "@/features/ory-ui/types"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Button, buttonVariants } from "../ui/button"
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
  Trash,
} from "lucide-react"
import { Separator } from "../ui/separator"
import { toast } from "sonner"
import { VariantProps } from "class-variance-authority"
import { useEffect } from "react"

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
  Card: {
    Form: ({ children }) => {
      return <div className="flex flex-col gap-4">{children}</div>
    },
    Divider: () => <Separator />,
    Settings: ({ options, attached }) => {
      const { title, description, messages } = options

      useEffect(() => {
        if (!messages) return
        messages.forEach((message) => {
          // console.log("msg", message)
          if (message.type === "error") toast.error(message.text)
          else toast(message.text)
        })
      }, [messages])

      return (
        <Card className="w-[600px] max-w-[600px]">
          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent className="flex flex-col gap-4">{attached}</CardContent>
        </Card>
      )
    },
    Default: ({ options, attached }) => {
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
    Oidc: ({ node, props, options }) => {
      const { icon: Icon, label } = options
      return (
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-row gap-8">
            {Icon && <Icon className={"size-6"} />}
            <span className="text-bold capitalize">
              {node.attributes.value || label}
            </span>
          </div>
          <Button {...props} variant="link">
            <Trash />
          </Button>
        </div>
      )
    },
    Button: ({ props, options }) => {
      const { type, label, icon: Icon, isSubmitting } = options

      type ButtonType = typeof type
      type ButtonVariant = VariantProps<typeof buttonVariants>["variant"]

      const variants: Partial<Record<ButtonType, ButtonVariant>> = {
        cancel: "destructive",
        link: "link",
      }

      const classNames: Partial<Record<ButtonType, string>> = {
        link: "w-fit",
        sso: "justify-start gap-16",
      }

      return (
        <Button
          {...props}
          className={cn("text-center", classNames[type])}
          variant={variants[type] || "outline"}
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
        <Image
          {...props}
          alt={node.meta.label?.text || ""}
          className="rounded-md"
        />
      )
    },
    Text: ({ options }) => {
      const { label, text } = options
      return (
        <Label className="text-muted-foreground">
          {label && label} {text && text}
        </Label>
      )
    },
  },
}
