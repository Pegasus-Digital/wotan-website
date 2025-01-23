import { Metadata } from 'next'
import { EstimatesContent } from './content'

import { ISearchParams, searchParamsSchema } from '@/lib/validations'

import { getOldBudgets } from './_logic/queries'


export const metadata: Metadata = {
  title: 'Orçamentos',
}

interface EstimatesPageProps {
  searchParams: ISearchParams
}

export default async function Estimates({ searchParams }: EstimatesPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const estimatesPromise = getOldBudgets(search)

  return <EstimatesContent estimates={estimatesPromise} />
}
