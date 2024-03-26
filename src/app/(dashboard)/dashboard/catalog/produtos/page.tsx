import payload from 'payload'
import { Metadata } from 'next'

import { ProductsContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Produtos',
}

export default async function Products() {
  // const products = await getData()

  const { docs } = await payload.find({ collection: 'products' })

  return <ProductsContent products={docs} />
}
