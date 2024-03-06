import { Metadata } from 'next'
import { EstimatesContent } from './content'
import { Product } from '@/payload/payload-types'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Orçamentos',
}

const products: Product[] = [
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

export default async function Estimates() {
  return (
    <EstimatesContent
      estimates={[
        {
          id: '1',
          clientName: 'Jonas',
          clientId: '55',
          representativeName: 'Cleber',
          representativeId: '2',

          items: [
            {
              amount: 20,
              product: products[0],
            },
            {
              amount: 25,
              product: products[1],
            },
          ],
        },
        {
          id: '2',
          clientName: 'John',
          clientId: '83',
          representativeId: 'Cleber',
          representativeName: '2',

          items: [
            {
              amount: 45,
              product: products[0],
            },
          ],
        },
      ]}
    />
  )
}
