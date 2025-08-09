'use client'

import * as React from 'react'

import { Product } from '@/payload/payload-types'

import { filterFields, getColumns } from './columns'
import { type ColumnDef } from '@tanstack/react-table'

import { DataTable } from '@/components/table/data-table'
import { useDataTable } from '@/components/table/hooks/use-data-table'
import { BulkUpdateProductDialog } from '../_components/bulk-update-dialog-content'

import { getProducts } from '../_logic/queries'
import { DataTableToolbar } from '@/components/table/data-table-toolbar'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { usePathname } from 'next/navigation'

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

  let selectedProducts = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)

  return (
    <div>
      <DataTableToolbar
        table={table}
        filterFields={filterFields}
        actions={[
          () => <NewProductButton />,
          () => <ImportProductsButton />,
          () => <BulkUpdateProductDialog products={selectedProducts} />,
        ]}
      />

      <DataTable table={table} columns={columns} />
    </div>
  )
}

function NewProductButton() {
  const path = usePathname()

  return (
    <Button variant='outline' size='sm' asChild>
      <Link href={`${path}/novo`}>Novo produto</Link>
    </Button>
  )
}

function ImportProductsButton() {
  return (
    <Button variant='outline' size='sm' disabled>
      Importar produtos
    </Button>
  )
}
