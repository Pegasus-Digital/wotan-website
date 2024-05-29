'use client'

import React, { useState, useTransition } from 'react'

import { toast } from 'sonner'
import { ColumnDef } from '@tanstack/react-table'

import { getRelativeDate } from '@/lib/date'

import { Media } from '@/payload/payload-types'

import Image from 'next/image'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { MoreHorizontal } from 'lucide-react'

import { deleteUser } from '../../_logic/actions'
import { DataTableFilterField } from '@/components/table/types/table-types'

export const filterFields: DataTableFilterField<Media>[] = [
  {
    label: 'Nome do arquivo',
    value: 'filename',
    placeholder: 'Filtrar por nome...',
  },
]

export function getColumns(): ColumnDef<Media>[] {
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
      accessorKey: 'url',
      header: 'Miniatura',
      cell: ({ row }) => (
        <div className='flex h-20 w-20 items-center '>
          <Image
            src={row.getValue('url')}
            width={80}
            height={80}
            alt={row.getValue('url')}
          />
        </div>
      ),
    },
    {
      accessorKey: 'filename',
      header: 'Nome de arquivo',
    },
    {
      accessorKey: 'alt',
      header: 'Texto alt',
    },
    {
      accessorKey: 'mimeType',
      header: 'Tipo',
    },

    {
      accessorKey: 'updatedAt',
      enableHiding: true,

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Atualizado em' />
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
            <Dialog
              open={isUpdateOpen}
              onOpenChange={isUpdateOpen ? setIsUpdateOpen : () => {}}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Abrir menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => setIsUpdateOpen(true)}
                  >
                    Editar arquivo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => {
                      startDeleteTransition(() => {
                        toast.promise(deleteUser(product.id), {
                          loading: 'Removendo...',
                          success: 'Arquivo removido com sucesso',
                          error: 'Erro ao deletar arquivo...',
                        })
                      })
                    }}
                    disabled={isDeletePending}
                  >
                    Remover arquivo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Dialog>
          )
        }

        return <Actions />
      },
    },
  ]
}
