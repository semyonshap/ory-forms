// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { PropsWithChildren } from 'react'

export default function DefaultCardLayout({
  children,
}: PropsWithChildren) {
  return (
    <main className="p-4 pb-8 flex flex-col items-center justify-center gap-8 min-h-screen">
      {children}
    </main>
  )
}
