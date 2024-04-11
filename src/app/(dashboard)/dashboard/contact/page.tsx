import * as React from 'react'
import { Metadata } from 'next'

import { ContactContent } from './content'

import { getContactMessages } from './(table)/queries'
import { searchParamsSchema } from './(table)/validations'

import { DataTableSkeleton } from '@/components/table/data-table-skeleton'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Contatos',
}

export interface SearchParams {
  [key: string]: string | string[] | undefined
}

interface ContactsPageProps {
  searchParams: SearchParams
}

export default function Contacts({ searchParams }: ContactsPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const messagesPromise = getContactMessages(search)

  return (
    <section>
      <React.Suspense
        fallback={
          <DataTableSkeleton columnCount={4} filterableColumnCount={2} />
        }
      >
        <ContactContent messages={messagesPromise} />
      </React.Suspense>
    </section>
  )
}
