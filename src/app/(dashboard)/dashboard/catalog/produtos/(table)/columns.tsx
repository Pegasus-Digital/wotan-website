'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { ColumnDef } from '@tanstack/react-table'
import { Product } from '@/payload/payload-types'

import { MoreHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { getDDMMYYDate, getRelativeDate } from '@/lib/date'
import { useTransition } from 'react'
import { deleteProduct } from '../_logic/actions'
import { toast } from 'sonner'

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
    // {
    //   accessorKey: '_status',
    //   header: 'Status',
    //   cell: ({ row }) => {
    //     const status = row.getValue('_status')
    //     if (status === 'draft') return 'Não publicado'
    //     if (status === 'published') return 'Publicado'
    //   },
    // },
    {
      accessorKey: 'sku',
      header: 'SKU',
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Criado' />
      ),
      cell: ({ row }) => {
        const value: string = row.getValue('createdAt')

        if (value) {
          const date = new Date(value)
          const formattedDate = getRelativeDate(date)
          return formattedDate
        }
        return 'Data inválida'
      },
    },
    // {
    //   accessorKey: 'updatedAt',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Atualizado' />
    //   ),
    //   cell: ({ row }) => {
    //     const value: string = row.getValue('updatedAt')

    //     if (value) {
    //       const date = new Date(value)
    //       const formattedDate = getRelativeDate(date)
    //       return formattedDate
    //     }
    //     return 'Nunca foi atualizado'
    //   },
    // },
    {
      id: 'actions',
      header: () => <span className='text-right'>Interações</span>,
      cell: ({ row }) => {
        const product = row.original

        const [isDeletePending, startDeleteTransition] = useTransition()

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Abrir menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Interações</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem className='cursor-pointer'>
                Editar produto
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => {
                  startDeleteTransition(() => {
                    // Investigar: Toast não dispara
                    toast.promise(deleteProduct(product.id), {
                      loading: 'Deletando...',
                      success: 'Produto deletado com sucesso',
                      error: 'Erro ao deletar produto...',
                    })
                  })
                }}
                disabled={isDeletePending}
              >
                Remover produto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
