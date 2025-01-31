import { Metadata } from 'next'
import { EstimatesContent } from './content'

import { ISearchParams, budgetsParamsSchema } from '@/lib/validations'

import { getEstimates } from './_logic/queries'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Orçamentos',
}

interface EstimatesPageProps {
  searchParams: ISearchParams
}

export default async function Estimates({ searchParams }: EstimatesPageProps) {
  const search = budgetsParamsSchema.parse(searchParams)

  const estimatesPromise = getEstimates(search)

  return <EstimatesContent estimates={estimatesPromise} />
}
