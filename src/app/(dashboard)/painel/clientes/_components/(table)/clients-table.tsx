'use client'

import * as React from 'react'

import { Client } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { getClients } from '../../_logic/queries'

import { DataTableToolbar } from '@/components/table/data-table-toolbar'

interface ClientsTableProps {
  clientsPromise: ReturnType<typeof getClients>
}

export function ClientsTable({ clientsPromise }: ClientsTableProps) {
  const { data, pageCount } = React.use(clientsPromise)

  const columns = React.useMemo<ColumnDef<Client, unknown>[]>(
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
