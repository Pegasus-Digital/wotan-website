'use client'

import React, { useState, useTransition } from 'react'

import { toast } from 'sonner'
import { ColumnDef } from '@tanstack/react-table'

import { getRelativeDate } from '@/lib/date'

import { Client } from '@/payload/payload-types'

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
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const filterFields: DataTableFilterField<Client>[] = [
  {
    label: 'Documento',
    value: 'document',
    placeholder: 'Filtrar por documento...',
  },
]

export function getColumns(): ColumnDef<Client>[] {
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
      accessorKey: 'razaosocial',
      header: 'Razão social',
    },
    {
      accessorKey: 'document',
      header: 'Documento',
      cell: ({ row }) => {
        const value: string = row.getValue('document')
        // Check if it's a CPF (11 digits) or CNPJ (14 digits)
        if (value.length === 11) {
          // Format CPF (Brazilian Individual Taxpayer Registry)
          return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        } else if (value.length === 14) {
          // Format CNPJ (Brazilian National Registry of Legal Entities)
          return value.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5',
          )
        } else {
          // Invalid document length
          return 'Documento inválido'
        }
      },
    },
    {
      accessorKey: 'salesperson',
      header: 'Vendedor',
      cell: ({ row }) => {
        const value: string = row.getValue('salesperson')
        return (
          <Link href={`/painel/vendedores/${value['id']}`}>
            <Badge className='w-fit'>{value['name']}</Badge>
          </Link>
        )
      },
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
