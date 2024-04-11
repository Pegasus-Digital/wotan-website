'use client'

import { useTransition } from 'react'

import { ColumnDef } from '@tanstack/react-table'
import { ContactMessage } from '@/payload/payload-types'

import { getRelativeDate } from '@/lib/date'

import { toast } from 'sonner'

import { Mail, MailOpen, MoreHorizontal } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Small } from '@/components/typography/texts'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { readTask } from './actions'

export function getColumns(): ColumnDef<ContactMessage>[] {
  return [
    {
      id: 'read',
      header: 'Lido',
      cell: ({ row }) => {
        const [isReadPending, startReadTransition] = useTransition()
        const message = row.original

        function MessageAlreadyRead() {
          return (
            <div
              className={buttonVariants({
                size: 'icon',
                variant: 'ghost',
                className: 'hover:text-green-70 hover:bg-transparent',
              })}
            >
              <MailOpen className='text-green-500' />
            </div>
          )
        }

        function UnreadMessage() {
          return (
            <Button
              size='icon'
              variant='ghost'
              disabled={isReadPending}
              onClick={() => {
                startReadTransition(() => {
                  toast.promise(readTask({ message }), {
                    loading: 'Lendo...',
                    success: 'Mensagem marcada como lida',
                    error: 'Erro lendo a mensagem...',
                  })
                })
              }}
            >
              <Mail />
            </Button>
          )
        }

        return message.read ? <MessageAlreadyRead /> : <UnreadMessage />
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
                <Card className='p-2'>
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
}
