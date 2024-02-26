import '../globals.css'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { H1 } from '@/components/typography/headings'
import { P } from '@/components/typography/texts'
import { SearchBar } from '@/components/search-bar'
import { Footer } from '@/components/footer'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'

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
        <H1>Wotan Website</H1>
        <P className='text-xl'>Website institucional + eCommerce</P>

        <SearchBar />
        {children}
        <Footer />
        <PegasusStamp />
      </body>
    </html>
  )
}
