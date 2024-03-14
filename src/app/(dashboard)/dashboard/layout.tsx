import '../../globals.css'
import { Metadata } from 'next'

import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'

import { Sidebar } from '@/components/sidebar'

export const metadata: Metadata = {
  title: {
    template: '%s | Wotan',
    default: 'Dashboard | Wotan', // a default is required when creating a template
  },
}

interface DashboardLayoutProps {
  children: React.ReactNode
}

const inter = Inter({ subsets: ['latin'] })

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <html lang='pt-BR'>
      <body
        className={cn(
          'bg-background text-foreground antialiased',
          inter.className,
        )}
      >
        <section className='min-h-screen w-full'>
          <div className='grid-cols-dashboard grid w-full gap-6 px-16 py-4'>
            <Sidebar />

            {/* Content */}
            {children}
          </div>
        </section>
      </body>
    </html>
  )
}
