import { Metadata } from 'next'
import { OrdersContent } from './content'

import { ISearchParams, searchParamsSchema } from '@/lib/validations'

import { getEstimates } from './_logic/queries'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Pedidos',
}

interface EstimatesPageProps {
  searchParams: ISearchParams
}

export default async function Estimates({ searchParams }: EstimatesPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const estimatesPromise = getEstimates(search)

  return <OrdersContent estimates={estimatesPromise} />
}
