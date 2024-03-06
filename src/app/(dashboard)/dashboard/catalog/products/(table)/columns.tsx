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

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    header: 'Nome',
  },
  {
    accessorKey: '_status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('_status')
      if (status === 'draft') return 'Não publicado'
      if (status === 'published') return 'Publicado'
    },
  },
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
      const date = new Date(row.getValue('createdAt'))
      const formattedDate = format(date, 'dd/MM/yy HH:mm', { locale: ptBR })
      return formattedDate
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Atualizado' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('updatedAt')
      if (value) {
        const date = new Date()
        const formattedDate = format(date, 'dd/MM/yy HH:mm', { locale: ptBR })
        return formattedDate
      }
      return 'Nunca foi atualizado'
    },
  },
  {
    id: 'actions',
    header: () => <span className='text-right'>Interações</span>,
    cell: () => {
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
            <DropdownMenuItem className='cursor-pointer'>
              Remover produto
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
