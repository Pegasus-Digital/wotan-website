import { cn } from '@/lib/utils'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wotan',
  description: 'Wotan Website',
}

interface RooyLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RooyLayoutProps>) {
  return (
    <html lang='pt-BR'>
      <body
        className={cn(
          inter.className,
          'bg-background text-foreground antialiased',
        )}
      >
        {children}
      </body>
    </html>
  )
}
