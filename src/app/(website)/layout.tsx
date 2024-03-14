import '../globals.css'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'

import { fetchSettings } from '../_api/fetchGlobals'
import { Company, Setting } from '@/payload/payload-types'

import { header } from '@/payload/fields/header'
import { Toaster } from 'sonner'
import { CartStoreProvider } from '@/components/cart-store-provider'

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

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  let settings: Setting | null = await fetchConfigs()

  // console.log({ settings })
  const { header, footer, company } = settings
  const { adress, contact } = company

  // TODO: If data doesn't exist on Payload, it should not break the deployment.

  return (
    <html lang='pt-BR' suppressHydrationWarning>
      <body
        className={cn(
          inter.className,
          'min-w-96 bg-pattern bg-right bg-repeat-y text-foreground antialiased',
        )}
      >
        <CartStoreProvider>
          <Header
            logo={header?.logo}
            navigation={header?.navigation}
            phone={contact?.phone}
          />
          <main className='flex min-h-screen flex-col items-center'>
            {/* Header */}
            <SearchBar />

            {children}
          </main>
          <Footer
            logo={footer?.logo}
            companyInfo={footer.companyInfo}
            columns={footer.columns}
            adress={adress}
            contact={contact}
          />
        </CartStoreProvider>
        <Toaster richColors closeButton theme='light' />
      </body>
    </html>
  )
}
