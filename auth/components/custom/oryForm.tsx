'use client'

import { useRouter } from 'next/navigation'
import { createInputNode, Flow, FlowInputProps } from '@ory-forms/react'

export function FormWithRouter(props: FlowInputProps) {
  const router = useRouter()
  return (
    <Flow
      {...props}
      onRedirect={(url) => {
        router.push(url)
      }}
    />
  )
}

const captchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLED === 'true'

export function FormWithCaptcha(props: FlowInputProps) {
  const router = useRouter()

  return (
    <Flow
      {...props}
      onRedirect={(url) => {
        router.push(url)
      }}
      extraNodes={
        captchaEnabled
          ? [
              createInputNode({
                attributes: {
                  name: 'captcha_turnstile_response',
                  type: 'text',
                  value: '',
                  disabled: false,
                  required: true,
                },
                group: 'captcha',
                data: { transient: true },
              }),
            ]
          : undefined
      }
    />
  )
}
