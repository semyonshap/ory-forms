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
      setExtraNodes={(config, formState) => {
        if (!config.extra.captcha_enabled) return []

        if (
          formState.current === 'provide_identifier' ||
          (formState.current === 'method_active' &&
            formState.method === 'password')
        ) {
          return [
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
        }
        return []
      }}
    />
  )
}
