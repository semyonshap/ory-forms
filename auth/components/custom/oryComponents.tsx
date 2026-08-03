'use client'

import Image from 'next/image'

import { OryClientComponents, OryFlowType } from '@ory-forms/react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { Button, buttonVariants } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Alert, AlertDescription } from '../ui/alert'
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
  Eye,
  EyeOff,
} from 'lucide-react'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Checkbox } from '../ui/checkbox'
import { Turnstile } from '@marsidev/react-turnstile'
import { useIsMobile } from '@/hooks/use-mobile'
import { oryConfig } from '@/ory.config'

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
  Layout: {
    Form: ({ children, options }) => {
      const { flowType, messages } = options

      const isSettings = flowType === OryFlowType.Settings

      useEffect(() => {
        if (!isSettings || !messages) return

        messages.forEach((message) => {
          if (message.type === 'error') toast.error(message.text)
          else toast(message.text)
        })
      }, [flowType, messages])

      return (
        <div
          className={cn(
            'flex flex-col gap-4 w-full',
            isSettings ? 'md:w-150 md:max-w-150' : 'md:w-90 md:max-w-90',
          )}
        >
          {children}
        </div>
      )
    },
    Divider: () => <Separator />,
    Card: ({ props, options, attached }) => {
      const { title, description, messages, flowType } = options

      const isSettings = flowType === OryFlowType.Settings

      const { id, key, ...formProps } = props

      return (
        <form key={key} id={id} {...formProps} className="w-full">
          <Card className="w-full bg-transparent border-none md:bg-card md:border">
            {title && (
              <CardHeader className="flex flex-col w-full">
                {!isSettings && oryConfig.project.logo_light_url && (
                  <Image
                    src={oryConfig.project.logo_light_url}
                    alt={oryConfig.project.name}
                    width={72}
                    height={72}
                    className="pb-4 pt-2 w-auto h-14"
                  />
                )}
                <CardTitle>{title}</CardTitle>
                {description && (
                  <CardDescription>{description}</CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent className="flex flex-col gap-4">
              {!isSettings &&
                messages &&
                messages.map((msg, index) => (
                  <Alert
                    key={`${msg.id}-${index}`}
                    variant={
                      msg.type === 'error' ? 'destructive' : 'default'
                    }
                  >
                    <AlertDescription className="whitespace-pre-wrap break-all">
                      {msg.text}
                    </AlertDescription>
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
            variant === 'footer-settings' &&
              'flex flex-col justify-between gap-4 sm:flex-row ',
            variant === 'footer-settings-submits' &&
              'flex flex-col gap-2 sm:flex-row sm:ml-auto',
            variant === 'totp-qr' &&
              'w-full flex flex-col sm:flex-row gap-4 ',
            variant === 'totp-secret' && 'w-full flex flex-col gap-2',
            variant === 'lookup-secrets-codes' &&
              'grid grid-cols-2 md:grid-cols-3 gap-2',
            variant === 'settings-divider' && 'flex px-4 md:hidden',
          )}
        >
          {attached}
        </div>
      )
    },
  },
  Node: {
    Label: ({ options, children, attached }) => {
      const { label, messages } = options

      return (
        <div className="flex flex-col gap-1">
          {label && (
            <Label className="inline-flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              {attached}
            </Label>
          )}
          {children}
          {messages?.map((msg, i) => (
            <span
              key={i}
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
            variant === 'cancel' &&
              buttonVariants({ variant: 'destructive' }),
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
            cooldown.isActive &&
              'hover:no-underline text-muted-foreground',
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
          className="inline-flex gap-4 h-auto w-full whitespace-normal items-start justify-start overflow-hidden"
        >
          {Icon && <Icon className="size-5 shrink-0 mt-3" />}
          <div className="flex flex-col gap-1 justify-start items-start">
            <span className="text-left">{label}</span>
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
            {Icon && <Icon className={'size-6'} />}
            <span className="text-bold capitalize">
              {node.attributes.value || label}
            </span>
          </div>
          <Button {...props} variant="outline" className="cursor-pointer">
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
            'overflow-hidden',
            variant === 'link' && 'w-fit px-0',
            variant === 'sso' && 'justify-start gap-4 md:gap-16',
            variant === 'expand' && 'whitespace-normal text-start h-auto',
          )}
          variant={((v) => {
            if (v === 'cancel') return 'destructive'
            if (v === 'link') return 'link'
            return 'outline'
          })(variant)}
        >
          {isSubmitting ? (
            <Spinner />
          ) : (
            Icon && <Icon className={cn(label ? 'size-4' : 'size-6')} />
          )}
          <span className="truncate">{label}</span>
        </Button>
      )
    },
    Input: ({ props }) => {
      return <Input {...props} />
    },
    Password: ({ props }) => {
      const [show, setShow] = useState(false)
      return (
        <div className="relative">
          <Input
            {...props}
            type={show ? 'text' : 'password'}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground size-7',
            )}
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      )
    },
    Captcha: ({ options }) => {
      const {
        token,
        messages,
        onBeforeInteractive,
        onSuccess,
        onExpire,
        onError,
      } = options
      const isMobile = useIsMobile(384)

      return (
        <div className={cn(token ? 'hidden' : 'flex flex-col gap-1')}>
          <Turnstile
            siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
            options={{
              size: isMobile ? 'compact' : 'flexible',
              theme: 'dark',
              appearance: 'always',
              language: oryConfig.project.default_locale,
            }}
            className={cn(
              '[clip-path:inset(1.5px_round_var(--radius))]',
              !isMobile && 'w-full! block! overflow-clip! h-15!',
            )}
            onSuccess={onSuccess}
            onError={onError}
            onExpire={onExpire}
            onBeforeInteractive={onBeforeInteractive}
          />
          {messages?.map((msg, i) => (
            <span key={i} className="text-sm text-destructive">
              {msg.text}
            </span>
          ))}
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
          onKeyDown={(e) => {
            if (
              (value as string)?.length >= elements &&
              e.key.length === 1
            ) {
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
          <Image
            {...props}
            alt={node.meta.label?.text || ''}
            className="w-full rounded-md"
          />
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
            <span className="text-sm text-muted-foreground">
              {description}
            </span>
          </div>
        </div>
      )
    },
  },
}
