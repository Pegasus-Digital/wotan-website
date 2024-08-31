'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'

import { getRelativeDate } from '@/lib/date'

import { Product } from '@/payload/payload-types'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Dialog } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button, buttonVariants } from '@/components/ui/button'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { UpdateProductDialog } from '../_components/update-product-dialog-content'

import { Eye, MoreHorizontal, Pencil, Printer, Trash2 } from 'lucide-react'

import { deleteProduct } from '../_logic/actions'

export const filterFields: DataTableFilterField<Product>[] = [
  {
    label: 'Title',
    value: 'title',
    placeholder: 'Filtrar por nome...',
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
                href={`/painel/catalogo/produtos/${product.sku}`}
                className={cn(
                  buttonVariants({
                    size: 'icon',
                    variant: 'ghost',
                    className: 'rounded-full',
                  }),
                )}
              >
                <Eye className='h-5 w-5' />
              </Link>
              <Link
                href={`/painel/catalogo/produtos/${product.sku}?edit=true`}
                className={cn(
                  buttonVariants({
                    size: 'icon',
                    variant: 'ghost',
                    className: 'rounded-full',
                  }),
                )}
              >
                <Pencil className='h-5 w-5' />
              </Link>

              <Button
                onClick={(e) => {
                  e.preventDefault()
                  window.print()
                }}
                size='icon'
                variant='ghost'
                type='button'
                className='rounded-full'
              >
                <Printer className='h-5 w-5' />
              </Button>
              <Button
                className='rounded-full'
                size='icon'
                variant='ghost'
                type='button'
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
                <Trash2 className='h-5 w-5' />
              </Button>
            </div>
          )
        }

        return <Actions />
      },
    },
  ]
}
