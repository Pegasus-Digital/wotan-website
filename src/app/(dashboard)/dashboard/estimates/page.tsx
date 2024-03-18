import { Metadata } from 'next'
import { EstimatesContent } from './content'

import payload from 'payload'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Orçamentos',
}

export default async function Estimates() {
  const data = await payload.find({ collection: 'budget' })

  return <EstimatesContent estimates={data.docs} />
}
