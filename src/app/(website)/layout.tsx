import { Toaster } from 'sonner'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { SearchBar } from '@/components/search-bar'
import { CartStoreProvider } from '@/components/cart-store-provider'

import { Setting } from '@/payload/payload-types'
import { fetchSettings } from '../_api/fetchGlobals'
import payload from 'payload'
import { NestedCategory, nestCategories } from '@/lib/category-hierarchy'
import Loading from '../loading'
import { Suspense } from 'react'

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

async function fetchCategories() {
  await payload.init({
    // Init Payload
    secret: process.env.PAYLOAD_SECRET,
    local: true, // Enables local mode, doesn't spin up a server or frontend
  })

  const categories = await payload.find({
    collection: 'categories',
    depth: 5,
    limit: 100,
    sort: 'title',
  })
  // @ts-ignore
  return nestCategories(categories.docs)
}

export default async function WebsiteLayout({
  children,
}: Readonly<WebsiteLayoutProps>) {
  // const start = performance.now()

  const settingsData = fetchConfigs()
  const categoriesData = fetchCategories()

  const [settings, categories] = await Promise.all([
    settingsData,
    categoriesData,
  ])

  // const end = performance.now()
  // console.log(`Execution time: ${end - start} ms`)

  const { header, footer, company } = settings
  const { adress, contact } = company

  // TODO: If data doesn't exist on Payload, it should not break the deployment.

  return (
    <>
      <CartStoreProvider>
        <Suspense fallback={<Loading />}>
          <Header
            logo={header?.logo}
            navigation={header?.navigation}
            phone={contact?.phone}
          />

          <SearchBar categories={categories} />

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
        </Suspense>
      </CartStoreProvider>
      <Toaster richColors closeButton theme='light' />
    </>
  )
}
