import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Inline form',
  description: 'Inline form example',
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, 'antialiased')}>
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
