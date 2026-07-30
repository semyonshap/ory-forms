'use client'

import { useRouter } from 'next/navigation'
import { Flow, FlowInputProps } from '@ory-forms/react'

export function OryForm(props: FlowInputProps) {
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
