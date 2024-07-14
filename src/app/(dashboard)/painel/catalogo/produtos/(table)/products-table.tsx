'use client'

import * as React from 'react'

import { Product } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'
import { NewProductDialog } from '../_components/new-product-dialog'
import { BulkUpdateProductDialog } from '../_components/bulk-update-dialog-content'

import { getProducts } from '../_logic/queries'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'

interface ProductsTableProps {
  productsPromise: ReturnType<typeof getProducts>
}

export function ProductsTable({ productsPromise }: ProductsTableProps) {
  const { data, pageCount } = React.use(productsPromise)

  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
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
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        actions={[NewProductDialog, BulkUpdateProductDialog]}
      />

      <DataTable table={table} columns={columns} />
    </div>
  )
}
