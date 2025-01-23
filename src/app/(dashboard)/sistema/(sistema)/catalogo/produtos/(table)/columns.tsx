'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getRelativeDate } from '@/lib/date'

import { Product } from '@/payload/payload-types'

import { Icons } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import { Button, buttonVariants } from '@/components/ui/button'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { deleteProduct } from '../_logic/actions'
import { numericFilter } from '@/components/table/hooks/use-data-table'

export const filterFields: DataTableFilterField<Product>[] = [
  {
    label: 'Title',
    value: 'title',
    placeholder: 'Filtrar por nome...',
  },
  {
    label: 'SKU',
    value: 'sku',
    placeholder: 'Filtrar por SKU...',
  },
]

export function getColumns(): ColumnDef<Product>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          // @ts-ignore TODO: Solve this TypeScript error
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: 'Nome',
    },
    {
      accessorKey: 'active',
      header: 'Ativo',
      cell: ({ row }) => {
        const isActive = row.getValue('active')
        if (isActive === true) return 'Ativo'
        else return 'Inativo'
      },
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      filterFn: numericFilter,
    },
    {
      accessorKey: 'minimumQuantity',
      header: 'Quant. mínima',
    },
    {
      accessorKey: 'updatedAt',
      enableHiding: true,

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Atualizado' />
      ),
      cell: ({ row }) => {
        const value: string = row.getValue('updatedAt')

        if (!value) return 'Nunca foi atualizado'

        const date = new Date(value)
        const formattedDate = getRelativeDate(date)

        return formattedDate
      },
    },
    {
      id: 'actions',
      header: () => <span className='text-right'>Interações</span>,
      cell: ({ row }) => {
        const product = row.original

        // Precisa ser assim porque não é possível usar hooks no contexto de cell
        function Actions() {
          const [isDeletePending, startDeleteTransition] = useTransition()
          const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)

          return (
            <div className='flex items-center gap-2.5'>
              <Link
                href={`/sistema/catalogo/produtos/${product.sku}`}
                className={cn(
                  buttonVariants({
                    size: 'icon',
                    variant: 'ghost',
                  }),
                )}
              >
                <Icons.Look className='h-5 w-5' />
              </Link>
              <Link
                href={`/sistema/catalogo/produtos/${product.sku}?edit=true`}
                className={cn(
                  buttonVariants({
                    size: 'icon',
                    variant: 'ghost',
                  }),
                )}
              >
                <Icons.Edit className='h-5 w-5' />
              </Link>

              <Button
                type='button'
                size='icon'
                variant='ghost'
                onClick={() => {
                  startDeleteTransition(() => {
                    toast.promise(deleteProduct(product.id), {
                      loading: 'Deletando...',
                      success: 'Produto deletado com sucesso',
                      error: 'Erro ao deletar produto...',
                    })
                  })
                }}
                disabled={isDeletePending}
              >
                <Icons.Trash className='h-5 w-5' />
              </Button>
            </div>
          )
        }

        return <Actions />
      },
    },
  ]
}
