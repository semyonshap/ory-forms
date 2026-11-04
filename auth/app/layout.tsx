import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React, { ReactNode, Suspense } from 'react'

import { oryConfig } from '@/ory.config'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const brandPrimary = oryConfig.project.brand_primary

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: oryConfig.project.name,
  description: `Authentication for ${oryConfig.project.name}.`,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className} dark`}
      style={
        brandPrimary
          ? ({
              '--color-brand-primary': brandPrimary,
            } as React.CSSProperties)
          : undefined
      }
    >
      <body>
        <Suspense>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  )
}
