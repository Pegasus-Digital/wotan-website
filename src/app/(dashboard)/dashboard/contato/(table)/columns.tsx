'use client'

import { useTransition } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { ContactMessage } from '@/payload/payload-types'
import { DataTableFilterField } from '@/components/table/types/table-types'

import { getRelativeDate } from '@/lib/date'

import { toast } from 'sonner'

import { MoreHorizontal } from 'lucide-react'
import { EnvelopeClosedIcon, EnvelopeOpenIcon } from '@radix-ui/react-icons'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { Small } from '@/components/typography/texts'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { readMessage } from '../_logic/actions'

export const filterFields: DataTableFilterField<ContactMessage>[] = [
  {
    label: 'Name',
    value: 'name',
    placeholder: 'Filtrar por nome...',
  },
  {
    label: 'Email',
    value: 'email',
    placeholder: 'Filtrar por email...',
  },
]

export function getColumns(): ColumnDef<ContactMessage>[] {
  return [
    {
      id: 'read',
      header: 'Lido',
      cell: ({ row }) => {
        const [isReadPending, startReadTransition] = useTransition()
        const message = row.original

        function AlreadyReadMessage() {
          return (
            <div
              className={buttonVariants({
                size: 'icon',
                variant: 'ghost',
                className: 'hover:text-green-70 hover:bg-transparent',
              })}
            >
              <EnvelopeOpenIcon className='h-5 w-5 text-green-500' />
            </div>
          )
        }

        function UnreadMessage() {
          return (
            <Button
              size='icon'
              variant='ghost'
              className='rounded-full'
              disabled={isReadPending}
              onClick={() => {
                startReadTransition(() => {
                  toast.promise(readMessage({ message }), {
                    loading: 'Lendo...',
                    success: 'Mensagem marcada como lida',
                    error: 'Erro lendo a mensagem...',
                  })
                })
              }}
            >
              <EnvelopeClosedIcon className='h-5 w-5' />
            </Button>
          )
        }

        return message.read ? <AlreadyReadMessage /> : <UnreadMessage />
      },
    },
    {
      accessorKey: 'name',
      header: 'Nome',
    },
    {
      accessorKey: 'message',
      header: 'Mensagem',
      cell: ({ row }) => {
        const { message } = row.original

        const excerpt =
          message.length > 50 ? message.substring(0, 50) + '...' : message

        return (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger>
                <Card className='min-w-48 max-w-48 truncate p-2'>
                  <Small className='whitespace-break-spaces font-medium'>
                    {excerpt}
                  </Small>
                </Card>
              </TooltipTrigger>
              <TooltipContent className='min-w-48 max-w-96 break-all'>
                <CardContent className='p-2 text-justify'>
                  <Small className='font-medium'>{message}</Small>
                </CardContent>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      id: 'email',
      header: 'Email',
      cell: ({ row }) => {
        const { email } = row.original

        return (
          <div className='flex flex-col space-y-1'>
            <Small>{email}</Small>
          </div>
        )
      },
    },
    {
      header: 'Telefone',
      cell: ({ row }) => {
        const { fone } = row.original

        return (
          <div className='flex flex-col space-y-1'>
            <Small>{fone}</Small>
          </div>
        )
      },
    },

    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Criado' />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'))
        const formattedDate = getRelativeDate(date)
        return formattedDate
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
                Arquivar mensagem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
