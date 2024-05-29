'use client'

import * as React from 'react'

import { User } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'

import { getUsers } from '../../_logic/queries'

import { DataTableToolbar } from '@/components/table/data-table-toolbar'

interface UsersTableProps {
  usersPromise: ReturnType<typeof getUsers>
}

export function UsersTable({ usersPromise }: UsersTableProps) {
  const { data, pageCount } = React.use(usersPromise)

  const columns = React.useMemo<ColumnDef<User, unknown>[]>(
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
