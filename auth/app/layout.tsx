import './globals.css'
import React, { ReactNode, Suspense } from 'react'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jiko Auth',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.className} dark`}>
      <body>
        <Suspense>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  )
}
