import * as React from 'react'
import { Metadata } from 'next'

import { ISearchParams, searchParamsSchema } from '@/lib/validations'

import { DataTableSkeleton } from '@/components/table/data-table-skeleton'

import { ContactContent } from './content'
import { getContactMessages } from './_logic/queries'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Contatos',
}

interface ContactsPageProps {
  // Extending base search params, not recommended, but
  searchParams: ISearchParams & {
    name: string
    email: string
  }
}

export default function Contacts({ searchParams }: ContactsPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const messagesPromise = getContactMessages(
    search,
    searchParams.name,
    searchParams.email,
  )

  return (
    <React.Suspense fallback={<DataTableSkeleton columnCount={4} />}>
      <ContactContent messages={messagesPromise} />
    </React.Suspense>
  )
}
