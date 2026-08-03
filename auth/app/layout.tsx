import './globals.css'
import React, { ReactNode, Suspense } from 'react'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME
const brandPrimary = process.env.NEXT_PUBLIC_BRAND_PRIMARY

export const metadata: Metadata = {
  title: projectName || 'Auth',
  description: `Authentication for ${projectName || 'Ory'}.`,
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
