'use client'

import React, { useState, useTransition } from 'react'

import { toast } from 'sonner'
import { ColumnDef } from '@tanstack/react-table'

import { getRelativeDate } from '@/lib/date'

import { Client, Salesperson } from '@/payload/payload-types'

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

import { Eye, MoreHorizontal, Pencil, UserRound } from 'lucide-react'

// import { deleteUser } from '../../_logic/actions'
import Image from 'next/image'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const filterFields: DataTableFilterField<Client>[] = [
  {
    label: 'Documento',
    value: 'document',
    placeholder: 'Filtrar por documento...',
  },
]

export function getColumns(): ColumnDef<Client>[] {
  const router = useRouter()

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
      header: 'Nome/Razão social',
      cell: ({ row }) => {
        const value = row.original
        const { razaosocial, name } = value

        return razaosocial ? razaosocial : name
      },
    },
    {
      accessorKey: 'document',
      header: 'Documento',
      cell: ({ row }) => {
        const value: string = row.getValue('document')
        // Check if it's a CPF (11 digits) or CNPJ (14 digits)
        if (value.length === 11) {
          // Format CPF
          return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        } else if (value.length === 14) {
          // Format CNPJ
          return value.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5',
          )
        } else {
          // Invalid document
          return 'Documento inválido'
        }
      },
    },
    {
      id: 'salesperson',
      accessorFn: (row) => row.salesperson,
      header: 'Vendedor/Representante',
      cell: ({ row }) => {
        const value: Salesperson = row.getValue('salesperson')

        if (!value)
          return (
            <div className='flex items-center space-x-2'>
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-300  p-1'>
                <UserRound className='h-3 w-3 text-gray-600' />
              </div>

              <p className='font-bold'>Nenhum</p>
            </div>
          )
        const { name, avatar } = value

        return (
          <div className='flex items-center space-x-2'>
            {avatar && typeof avatar === 'object' && avatar.url ? (
              <Image
                width={20}
                height={20}
                src={avatar.url}
                alt={name} // Use name for the alt attribute for better accessibility
                className='select-none rounded-full'
              />
            ) : (
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 p-1'>
                <UserRound className='h-3 w-3 text-gray-600' />
              </div>
            )}

            <p className='font-bold'>{name}</p>
          </div>
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
        const client = row.original

        function DeleteClientAction() {
          const [isDeletePending, startDeleteTransition] = useTransition()

          return (
            <DropdownMenuItem
              // onClick={() => {
              //   startDeleteTransition(() => {
              //     toast.promise(deleteEstimate({ clientId: client.id }), {
              //       loading: 'Deletando...',
              //       success: 'Orçamento deletado com sucesso',
              //       error: 'Erro ao deletar orçamento...',
              //     })
              //   })
              // }}
              className='cursor-pointer'
              disabled={isDeletePending}
            >
              Deletar cliente
            </DropdownMenuItem>
          )
        }

        function TransferClientAction() {
          const [isTransferPending, startTransferTransition] = useTransition()

          return (
            <DropdownMenuItem
              // onClick={() => {
              //   startDeleteTransition(() => {
              //     toast.promise(deleteEstimate({ clientId: client.id }), {
              //       loading: 'Deletando...',
              //       success: 'Orçamento deletado com sucesso',
              //       error: 'Erro ao deletar orçamento...',
              //     })
              //   })
              // }}
              className='cursor-pointer'
              disabled={isTransferPending}
            >
              Transferir cliente
            </DropdownMenuItem>
          )
        }

        return (
          <div className='flex w-min gap-1'>
            <Button
              onClick={() => {
                router.push(`/painel/clientes/${client.document}`)
              }}
              size='icon'
              variant='ghost'
            >
              <Eye className='h-5 w-5' />
            </Button>
            <Button
              onClick={() => {
                router.push(`/painel/clientes/${client.document}?edit=true`)
              }}
              size='icon'
              variant='ghost'
            >
              <Pencil className='h-5 w-5' />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' variant='ghost'>
                  <span className='sr-only'>Abrir menu</span>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Interações</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <TransferClientAction />
                <DeleteClientAction />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
