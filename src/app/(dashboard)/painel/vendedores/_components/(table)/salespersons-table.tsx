'use client'

import * as React from 'react'

import { Salesperson } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { getSalespersons } from '../../_logic/queries'

import { DataTableToolbar } from '@/components/table/data-table-toolbar'

interface SalespersonsTableProps {
  salespersonsPromise: ReturnType<typeof getSalespersons>
}

export function SalespersonsTable({
  salespersonsPromise,
}: SalespersonsTableProps) {
  const { data, pageCount } = React.use(salespersonsPromise)

  const columns = React.useMemo<ColumnDef<Salesperson, unknown>[]>(
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
