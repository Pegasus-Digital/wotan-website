'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'

import { Media, Salesperson } from '@/payload/payload-types'

import { getRelativeDate } from '@/lib/date'

import { toast } from 'sonner'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { Icons } from '@/components/icons'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'

import { deleteUser } from '../../_logic/actions'

export const filterFields: DataTableFilterField<Salesperson>[] = [
  {
    label: 'E-mail',
    value: 'email',
    placeholder: 'Filtrar por e-mail...',
  },
]

export function getColumns(): ColumnDef<Salesperson>[] {
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
      accessorKey: 'avatar',
      header: 'Avatar',
      cell: ({ row }) => {
        const value: Media = row.getValue('avatar')
        // console.log(value)
        if (!value)
          return (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted p-1'>
              <Icons.User className='h-5 w-5 text-muted-foreground' />
            </div>
          )

        return (
          <Image
            src={value.url}
            width={32}
            height={32}
            alt={value.url}
            className='select-none rounded-full'
          />
        )
      },
    },
    {
      accessorKey: 'name',
      header: 'Nome de usuário',
    },
    {
      accessorKey: 'email',
      header: 'E-mail',
    },
    {
      accessorKey: 'roles',
      header: 'Tipo',
      cell: ({ row }) => {
        const roles = row.getValue('roles')

        if (typeof roles === 'string') {
          if (roles.includes('internal')) return 'Interno Wotan'
          if (roles.includes('representative')) return 'Representante Externo'
        }
        return 'Indeterminado'
      },
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
            <Dialog
              open={isUpdateOpen}
              onOpenChange={isUpdateOpen ? setIsUpdateOpen : () => {}}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Abrir menu</span>
                    <Icons.Dots className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => setIsUpdateOpen(true)}
                  >
                    Editar usuário
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='cursor-pointer'
                    onClick={() => {
                      startDeleteTransition(() => {
                        toast.promise(deleteUser(product.id), {
                          loading: 'Removendo...',
                          success: 'Usuário removido com sucesso',
                          error: 'Erro ao deletar usuário...',
                        })
                      })
                    }}
                    disabled={isDeletePending}
                  >
                    Remover usuário
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
