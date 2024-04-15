import './globals.css'

import { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: {
    template: '%s | Wotan Brindes',
    default: 'Wotan Brindes', // a default is required when creating a template
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Wotan Brindes',
    description:
      'Wotan Brindes. Brindes personalizados e presentes corporativos.',
    url: new URL(process.env.NEXT_PUBLIC_SERVER_URL),
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
