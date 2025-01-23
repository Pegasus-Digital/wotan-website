'use client'

import * as React from 'react'

import { OldBudget } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'


import { getOldBudgets } from '../_logic/queries'

interface EstimatesTableProps {
  estimatesPromise: ReturnType<typeof getOldBudgets>
}

export function OldBudgetsTable({ estimatesPromise }: EstimatesTableProps) {
  const { data, pageCount } = React.use(estimatesPromise)

  const columns = React.useMemo<ColumnDef<OldBudget, unknown>[]>(
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
      />
      <DataTable table={table} columns={columns} />
    </div>
  )
}
