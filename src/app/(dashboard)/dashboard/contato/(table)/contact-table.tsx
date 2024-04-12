'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'

import { ContactMessage } from '@/payload/payload-types'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { getColumns } from './columns'
import { getContactMessages } from './queries'

interface ContactTableProps {
  messagesPromise: ReturnType<typeof getContactMessages>
}

export function ContactTable({ messagesPromise }: ContactTableProps) {
  const { data, pageCount } = React.use(messagesPromise)

  const columns = React.useMemo<ColumnDef<ContactMessage, unknown>[]>(
    () => getColumns(),
    [],
  )

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  })

  return <DataTable table={table} columns={columns} />
}
