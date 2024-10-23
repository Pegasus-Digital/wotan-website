'use client'

import * as React from 'react'

import { Order } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { DataTable } from '@/components/table/data-table'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'

import { getOrders } from '../_logic/queries'
import Link from 'next/link'
import { Button } from '@/pegasus/button'

interface OrdersTableProps {
  ordersPromise: ReturnType<typeof getOrders>
}

export function OrdersTable({ ordersPromise }: OrdersTableProps) {
  const { data, pageCount } = React.use(ordersPromise)

  const columns = React.useMemo<ColumnDef<Order, unknown>[]>(
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
