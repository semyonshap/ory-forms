'use client'

import { useRouter } from 'next/navigation'
import { createInputNode, Flow, FlowInputProps } from '@ory-forms/react'
import { oryConfig } from '@/ory.config'

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

export function FormWithCaptcha(props: FlowInputProps) {
  const router = useRouter()

  return (
    <Flow
      {...props}
      onRedirect={(url) => {
        router.push(url)
      }}
      extraNodes={
        oryConfig.project.captcha_enabled
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
