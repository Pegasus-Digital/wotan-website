import { Metadata } from 'next'
import { ProductsContent } from './content'
import { Product } from '@/payload/payload-types'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Produtos',
}

// Mock data
async function getData(): Promise<Product[]> {
  return [
    {
      id: '728ed52f',
      title: 'Camisa X',
      createdAt: new Date().toString(),
      updatedAt: null,
      slug: 'camisa-x',
      sku: '22435',
      _status: 'draft',
    },
    {
      id: '331cz95a',
      title: 'Camisa Y',
      createdAt: new Date().toString(),
      updatedAt: null,
      slug: 'camisa-y',
      sku: '22436',
      _status: 'published',
    },
  ]
}

export default async function Products() {
  const products = await getData()

  return <ProductsContent products={products} />
}
