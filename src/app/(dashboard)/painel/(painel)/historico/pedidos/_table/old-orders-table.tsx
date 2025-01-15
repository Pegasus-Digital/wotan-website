'use client'

import * as React from 'react'

import { OldOrder, Order } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { DataTable } from '@/components/table/data-table'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'

import { getOldOrders } from '../_logic/queries'
import Link from 'next/link'
import { Button } from '@/pegasus/button'

interface OrdersTableProps {
  ordersPromise: ReturnType<typeof getOldOrders>
}

export function OldOrdersTable({ ordersPromise }: OrdersTableProps) {
  const { data, pageCount } = React.use(ordersPromise)

  const columns = React.useMemo<ColumnDef<OldOrder, unknown>[]>(
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
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        actions={[NewOrderButton]}
      />

      <DataTable table={table} columns={columns} />
    </div>
  )
}

export function NewOrderButton() {
  return (
    <Button variant='outline' size='sm' asChild>
      <Link href='/painel/pedidos/novo'>Novo pedido</Link>
    </Button>
  )
}
