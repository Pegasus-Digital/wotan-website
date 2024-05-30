'use client'

import * as React from 'react'

import { Budget } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { DataTable } from '@/components/table/data-table'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'

import { NewEstimateDialog } from '../_components/new-estimate-dialog'

import { getEstimates } from '../_logic/queries'

interface OrdersTableProps {
  ordersPromise: ReturnType<typeof getEstimates>
}

export function OrdersTable({ ordersPromise }: OrdersTableProps) {
  const { data, pageCount } = React.use(ordersPromise)

  const columns = React.useMemo<ColumnDef<Budget, unknown>[]>(
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
    <div className='space-y-1.5'>
      <DataTableToolbar table={table} actions={[NewEstimateDialog]} />

      <DataTable table={table} columns={columns} />
    </div>
  )
}
