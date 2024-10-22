import * as React from 'react'
import { Metadata } from 'next'

import { DataTableSkeleton } from '@/components/table/data-table-skeleton'

import { ClientsContent } from './content'

import { getClients } from './_logic/queries'
import { ISearchParams, searchParamsSchema } from '@/lib/validations'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Clientes',
}

interface ProductsPageProps {
  searchParams: ISearchParams
}

export default function Products({ searchParams }: ProductsPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const clientsPromise = getClients(search)

  return (
    <React.Suspense fallback={<DataTableSkeleton columnCount={4} />}>
      <ClientsContent clients={clientsPromise} />
    </React.Suspense>
  )
}
