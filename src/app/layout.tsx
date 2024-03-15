import './globals.css'

import { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: {
    template: '%s | Wotan Brindes',
    default: 'Wotan Brindes', // a default is required when creating a template
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'min-w-96 bg-background text-foreground antialiased',
        )}
      >
        {children}
      </body>
    </html>
  )
}
