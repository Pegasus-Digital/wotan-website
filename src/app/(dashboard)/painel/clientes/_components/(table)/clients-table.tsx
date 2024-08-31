'use client'

import * as React from 'react'

import { Client, Salesperson } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { getClients } from '../../_logic/queries'

import { DataTableToolbar } from '@/components/table/data-table-toolbar'
import { useRouter } from 'next/navigation'
import { Button } from '@/pegasus/button'

interface ClientsTableProps {
  clientsPromise: ReturnType<typeof getClients>
  salespeople: Salesperson[]
}

export function ClientsTable({
  clientsPromise,
  salespeople,
}: ClientsTableProps) {
  const { data, pageCount } = React.use(clientsPromise)

  const columns = React.useMemo<ColumnDef<Client, unknown>[]>(
    () => getColumns({ salespeople }),
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
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        actions={[NewClientButton]}
      />

      <DataTable table={table} columns={columns} />
    </div>
  )
}

export function NewClientButton() {
  const router = useRouter()
  return (
    <Button
      variant='outline'
      size='sm'
      onClick={() => router.push('/painel/clientes/novo')}
    >
      Novo cliente
    </Button>
  )
}
