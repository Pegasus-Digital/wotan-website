'use client'

import { useState, useTransition } from 'react'

import { Attribute, Order, Salesperson } from '@/payload/payload-types'

import { ColumnDef } from '@tanstack/react-table'

import { formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Heading } from '@/pegasus/heading'
import { Small } from '@/components/typography/texts'

import { Eye, MoreHorizontal, Pencil, Printer, UserRound } from 'lucide-react'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { toast } from 'sonner'
import { deleteEstimate } from '../_logic/actions'
import Link from 'next/link'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import Image from 'next/image'

export const filterFields: DataTableFilterField<Order>[] = [
  // {
  //   label: 'Company Name',
  //   value: '',
  //   placeholder: 'Filtrar nome da empresa...',
  // },
  // {
  //   label: 'Company',
  //   value: 'companyName',
  //   placeholder: 'Filtrar nome da empresa...',
  // },
]

export function getColumns(): ColumnDef<Order>[] {
  return [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       // @ts-ignore TODO: Solve this TypeScript error
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label='Select all'
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label='Select row'
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      id: 'incrementalId',
      accessorFn: (row) => row.incrementalId,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Número' />
      ),
      cell: ({ row }) => {
        const value: number = row.getValue('incrementalId')

        if (!value) return <p className='font-bold'>#000000</p>

        return <p className='font-bold'>#{value.toString().padStart(6, '0')}</p>
      },
    },
    {
      id: 'company',
      // accessorFn: (row) => row.contact.companyName,
      header: 'Cliente',
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
      accessorKey: 'items',
      header: 'Itens',
      cell: ({ row }) => {
        const items: any[] = row.getValue('items')

        return (
          <Card className='w-fit border-transparent p-2'>
            <CardContent className='m-0 space-y-2 p-0'>
              {/* {items.map((item, index) => {
                return (
                  <div
                    key={item.id + '-' + index}
                    className='flex items-center'
                  >
                    <Small className='mr-2 font-semibold'>
                      {item.quantity}x
                    </Small>
                    <Badge className='w-fit'>{item.product.title}</Badge>
                  </div>
                )
              })} */}
            </CardContent>
          </Card>
        )
      },
    },
    {
      id: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const value: string = row.getValue('status')

        if (!value) return <p className='font-bold'>Nenhum</p>

        return <p className='font-bold'>{value}</p>
      },
    },
    {
      id: 'actions',
      header: () => <span className='text-right'>Interações</span>,

      cell: ({ row }) => {
        const order = row.original

        function DeleteEstimateAction() {
          const [isDeletePending, startDeleteTransition] = useTransition()

          return (
            <DropdownMenuItem
              onClick={() => {
                startDeleteTransition(() => {
                  toast.promise(deleteEstimate({ estimateId: order.id }), {
                    loading: 'Deletando...',
                    success: 'Orçamento deletado com sucesso',
                    error: 'Erro ao deletar orçamento...',
                  })
                })
              }}
              className='cursor-pointer'
              disabled={isDeletePending}
            >
              Deletar orçamento
            </DropdownMenuItem>
          )
        }

        function PlaceOrderAction() {
          // const [isDeletePending, startDeleteTransition] = useTransition()

          return (
            <DropdownMenuItem
              // onClick={() => {
              //   startDeleteTransition(() => {
              //     toast.promise(deleteEstimate({ estimateId: budget.id }), {
              //       loading: 'Deletando...',
              //       success: 'Orçamento deletado com sucesso',
              //       error: 'Erro ao deletar orçamento...',
              //     })
              //   })
              // }}
              className='cursor-pointer'
              // disabled={isDeletePending}
            >
              Fazer pedido
            </DropdownMenuItem>
          )
        }

        function ChangeBudgetStatusAction() {
          return (
            <DropdownMenuItem
              className='cursor-pointer'
              // disabled={isChangeStatusPending}
              // onClick={() => setDialogStatusState(true)}
            >
              Alterar status
            </DropdownMenuItem>
          )
        }
        return (
          <div className='flex w-min gap-1'>
            <Button size='icon' variant='ghost' asChild>
              <Link href={`/painel/pedidos/${order.incrementalId}`}>
                <Eye className='h-5 w-5' />
              </Link>
            </Button>
            <Button size='icon' variant='ghost' asChild>
              <Link href={`/painel/pedidos/${order.incrementalId}?edit=true`}>
                <Pencil className='h-5 w-5' />
              </Link>
            </Button>
            <Button
              onClick={() => {
                window.print()
              }}
              size='icon'
              variant='ghost'
            >
              <Printer className='h-5 w-5' />
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
                <ChangeBudgetStatusAction />
                <PlaceOrderAction />

                <DeleteEstimateAction />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
