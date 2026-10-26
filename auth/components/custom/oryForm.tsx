'use client'

import { createInputNode, Flow, FlowInputProps } from '@ory-forms/react'

export function FormWithRouter(props: FlowInputProps) {
  return (
    <Flow
      {...props}
      setExtraNodes={(config, formState) => {
        if (!config.project.captcha_enabled) return []

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
