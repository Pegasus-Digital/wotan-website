import { Toaster } from 'sonner'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { CartStoreProvider } from '@/components/cart-store-provider'

import { Setting } from '@/payload/payload-types'
import { fetchSettings } from '../_api/fetchGlobals'

interface WebsiteLayoutProps {
  children: React.ReactNode
}

async function fetchConfigs() {
  try {
    const settings = await fetchSettings()
    return settings
  } catch (error) {
    console.error(error)
  }
}

export default async function WebsiteLayout({
  children,
}: Readonly<WebsiteLayoutProps>) {
  let settings: Setting | null = await fetchConfigs()

  const { header, footer, company } = settings
  const { adress, contact } = company

  // TODO: If data doesn't exist on Payload, it should not break the deployment.

  return (
    <>
      <CartStoreProvider>
        <Header
          logo={header?.logo}
          navigation={header?.navigation}
          phone={contact?.phone}
        />

        <SearchBar />

        <main className='flex min-h-screen flex-col items-center bg-pattern bg-right bg-repeat-y'>
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
    </>
  )
}
