'use client'

import Image from 'next/image'

import { OryClientComponents, OryFlowType } from '@ory-forms/react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { Button, buttonVariants } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
import JikoIcon from '../icons/jiko-icon'
import { useCooldown } from '@/hooks/useCooldown'

import { cn } from '@/lib/utils'
import {
  KeyRound,
  Mail,
  Fingerprint,
  ShieldCheck,
  Timer,
  FileKey,
  Shield,
  Asterisk,
  Link,
  Unlink,
  IdCard,
  WifiOff,
  User,
  MapPin,
  Phone,
  AtSign,
} from 'lucide-react'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'
import { Children, useEffect } from 'react'
import { Checkbox } from '../ui/checkbox'

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

      Openid: IdCard,
      OfflineAccess: WifiOff,
      Profile: User,
      Email: AtSign,
      Address: MapPin,
      Phone: Phone,
    },
  },
  Card: {
    Form: ({ children, options }) => {
      const { flowType, messages } = options

      useEffect(() => {
        if (flowType !== OryFlowType.Settings) return
        if (!messages) return

        messages.forEach((message) => {
          if (message.type === 'error') toast.error(message.text)
          else toast(message.text)
        })
      }, [flowType, messages])

      const isSettings = flowType === OryFlowType.Settings

      return (
        <div
          className={cn(
            'flex flex-col gap-4 w-full',
            isSettings ? 'md:w-150 md:max-w-150' : 'md:w-90 md:max-w-90',
          )}
        >
          {isSettings
            ? Children.toArray(children).flatMap((child, i) => [
                child,
                i < Children.count(children) - 1 && (
                  <div key={`sep-${i}`} className="px-4 md:hidden">
                    <Separator />
                  </div>
                ),
              ])
            : children}
        </div>
      )
    },
    Divider: () => <Separator />,
    Card: ({ props, options, attached }) => {
      const { title, description, messages, flowType } = options
      const { key, ...formProps } = props

      const isSettings = flowType === OryFlowType.Settings

      return (
        <form key={key} {...formProps} className="w-full">
          <Card className="w-full bg-transparent border-none md:bg-card md:border">
            {title && (
              <CardHeader className="flex flex-col w-full">
                {!isSettings && <JikoIcon className="pb-6 pt-2" />}
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
              </CardHeader>
            )}
            <CardContent className="flex flex-col gap-4">
              {!isSettings &&
                messages &&
                messages.map((msg, index) => (
                  <Alert
                    key={`${msg.id}-${index}`}
                    variant={msg.type === 'error' ? 'destructive' : 'default'}
                  >
                    <AlertDescription className="whitespace-pre-wrap">{msg.text}</AlertDescription>
                  </Alert>
                ))}
              {attached}
            </CardContent>
          </Card>
        </form>
      )
    },
    Div: ({ options, attached }) => {
      const { variant } = options

      return (
        <div
          className={cn(
            variant === 'footer' && 'inline-flex gap-2',
            variant === 'footer-settings' && 'flex  gap-2 justify-end',
            variant === 'footer-settings-submits' && 'flex flex-col sm:flex-row gap-2',
            variant === 'totp-qr' && 'w-full flex flex-col sm:flex-row gap-4 ',
            variant === 'totp-secret' && 'w-full flex flex-col gap-2',
            variant === 'lookup-secrets-codes' && 'grid grid-cols-2 md:grid-cols-3 gap-2',
          )}
        >
          {attached}
        </div>
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
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            {attached}
          </Label>
          {children}
          {messages?.map((msg) => (
            <span
              key={msg.id}
              className={cn(
                'text-sm',
                msg.type === 'error' && 'text-destructive',
                msg.type === 'info' && 'text-muted-foreground',
              )}
            >
              {msg.text}
            </span>
          ))}
        </div>
      )
    },
    Anchor: ({ props, options }) => {
      const { label, variant } = options
      return (
        <a
          className={cn(
            variant === 'link' &&
              'text-sm text-brand-primary underline-offset-2 hover:underline cursor-pointer',
            variant === 'button' && buttonVariants({ variant: 'outline' }),
            variant === 'cancel' && buttonVariants({ variant: 'destructive' }),
          )}
          {...props}
          title={label}
        >
          {label}
        </a>
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
            'p-0 text-brand-primary',
            cooldown.isActive && 'hover:no-underline text-muted-foreground',
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
          {cooldown.isActive && <span className="tabular-nums">{cooldown.remaining}s</span>}
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
            <span className="text-left">{label}</span>
            {description && (
              <span className="text-muted-foreground text-left text-sm">{description}</span>
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
            {Icon && <Icon className={'size-6'} />}
            <span className="text-bold capitalize">{node.attributes.value || label}</span>
          </div>
          <Button {...props} variant="link">
            {node.attributes.name === 'link' ? <Link /> : <Unlink />}
          </Button>
        </div>
      )
    },
    Button: ({ props, options }) => {
      const { variant, label, icon: Icon, isSubmitting } = options

      return (
        <Button
          {...props}
          className={cn(
            variant === 'link' && 'w-fit px-0',
            variant === 'sso' && 'justify-start gap-16',
            variant === 'code' && 'whitespace-normal text-start h-auto',
          )}
          variant={((v) => {
            if (v === 'cancel') return 'destructive'
            if (v === 'link') return 'link'
            return 'outline'
          })(variant)}
        >
          {isSubmitting && <Spinner />}
          {Icon && <Icon className={cn(label ? 'size-4' : 'size-6')} />}
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
        <div className="flex w-full px-8 py-4 sm:p-0">
          <Image {...props} alt={node.meta.label?.text || ''} className="w-full rounded-md" />
        </div>
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
    Checkbox: ({ options, props }) => {
      const { label, description, icon: Icon } = options
      const { onChange, ...rest } = props

      return (
        <div className="flex flex-row gap-4">
          <div>
            <Checkbox onCheckedChange={onChange} {...rest} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-3">
              {Icon && (
                <div>
                  <Icon className="size-6 text-brand-primary" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <span>{label}</span>
              </div>
            </div>
            <span className="text-sm text-muted-foreground">{description}</span>
          </div>
        </div>
      )
    },
  },
}
