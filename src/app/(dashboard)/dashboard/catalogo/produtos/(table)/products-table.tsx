'use client'

import * as React from 'react'

import { Product } from '@/payload/payload-types'

import { getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'
import { NewProductDialog } from '../_components/new-product-dialog'

import { getProducts } from '../_logic/queries'

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
  })

  return (
    <DataTable table={table} columns={columns} actions={[NewProductDialog]} />
  )
}
