import '../globals.css'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'

import { fetchCompany, fetchSettings } from '../_api/fetchGlobals'
import { Company, Setting } from '@/payload/payload-types'
import { header } from '@/payload/settings/header'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Wotan',
  description: 'Wotan Website',
}

interface RootLayoutProps {
  children: React.ReactNode
}

async function fetchConfigs() {
  try {
    const settings = await fetchSettings()
    // console.log(settings)
    return settings
  } catch (error) {
    console.error(error)
  }
}

async function fetchCompanyInfo() {
  try {
    const settings = await fetchCompany()
    // console.log(settings)
    return settings
  } catch (error) {
    console.error(error)
  }
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  let settings: Setting | null = await fetchConfigs()
  let companyInfo: Company | null = await fetchCompanyInfo()

  const { header, footer } = settings
  const { adress, contact } = companyInfo

  // console.log({ header })

  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'bg-pattern bg-right bg-repeat-y text-foreground antialiased',
        )}
      >
        <Header
          logo={header?.navigation?.logo}
          links={header?.navigation?.links}
          style={header?.navigation?.style}
          phone={contact?.phone}
        />
        <main className='flex min-h-screen flex-col items-center'>
          {/* Header */}
          <SearchBar />

          {children}

          <Footer
            logo={footer?.logo}
            companyInfo={footer.companyInfo}
            columns={footer.columns}
            adress={adress}
            contact={contact}
          />
          {/* Developed by Pegasus */}
          <PegasusStamp />
        </main>
        <Toaster richColors closeButton theme='light' />
      </body>
    </html>
  )
}
