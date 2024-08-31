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
import { ProductInfo } from '../_logic/actions'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

interface ProductsTableProps {
  productsPromise: ReturnType<typeof getProducts>
}

export function ProductsTable({ productsPromise }: ProductsTableProps) {
  const { data, pageCount } = React.use(productsPromise)
  const path = usePathname()
  // const [selectedProducts, setSelectedProducts] = React.useState<ProductInfo[]>(
  //   [],
  // )

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

  let selectedProducts = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  return (
    <div>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        actions={[
          () => {<Link
          href={`${path}/novo`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
        >
          Novo produto
        </Link>},
          () => <BulkUpdateProductDialog products={selectedProducts} />,
        ]}
      />

      <DataTable table={table} columns={columns} />
    </div>
  )
}
