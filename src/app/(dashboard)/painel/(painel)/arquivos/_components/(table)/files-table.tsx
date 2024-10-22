'use client'

import * as React from 'react'

import { Media } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'

import { getFiles } from '../../_logic/queries'

interface FilesTableProps {
  filesPromise: ReturnType<typeof getFiles>
}

export function FilesTable({ filesPromise }: FilesTableProps) {
  const { data, pageCount } = React.use(filesPromise)

  const columns = React.useMemo<ColumnDef<Media, unknown>[]>(
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
