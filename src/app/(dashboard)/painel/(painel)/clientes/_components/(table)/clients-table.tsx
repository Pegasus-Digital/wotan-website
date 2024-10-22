'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Client, Salesperson } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'

import { getClients } from '../../_logic/queries'

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
