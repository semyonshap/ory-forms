import { createInputNode } from '@ory-forms/react'

export function getExtraNodes(captcha: boolean = false) {
  const extraNodes = []
  if (captcha)
    extraNodes.push(
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
    )

  return extraNodes
}
