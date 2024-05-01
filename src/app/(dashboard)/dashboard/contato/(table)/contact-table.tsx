'use client'

import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'

import { ContactMessage } from '@/payload/payload-types'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { filterFields, getColumns } from './columns'
import { getContactMessages } from '../_logic/queries'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'

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
    filterFields,
  })

  return (
    <div>
      <DataTableToolbar table={table} filterFields={filterFields} />
      <DataTable table={table} columns={columns} />
    </div>
  )
}
