'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'

import { toast } from 'sonner'

import { OldOrder, Salesperson } from '@/payload/payload-types'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { Small } from '@/components/typography/texts'

import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'



import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import { deleteOrder } from '../_logic/actions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Heading } from '@/pegasus/heading'
import { Label } from '@/components/ui/label'
import { numericFilter } from '@/components/table/hooks/use-data-table'

export const filterFields: DataTableFilterField<OldOrder>[] = [

  {
    label: 'Número',
    value: 'incrementalId',
    placeholder: 'Filtrar por id...',
  },
]

export function getColumns(): ColumnDef<OldOrder>[] {
  return [
    {
      id: 'incrementalId',
      accessorFn: (row) => row.incrementalId,
      filterFn: numericFilter,
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
      id: 'client',
      header: 'Cliente',
      cell: ({ row }) => {
        const { client } = row.original
        return (
          <p className='max-w-48 truncate font-bold'>
            {typeof client === 'object'
              ? client.razaosocial
                ? client.razaosocial
                : client.name
              : client}
          </p>
        )
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
                <Icons.User className='h-3 w-3 text-gray-600' />
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
                <Icons.User className='h-3 w-3 text-gray-600' />
              </div>
            )}

            <p className='font-bold'>{name}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'itens',
      header: 'Itens',
      cell: ({ row }) => {
        const { itens, incrementalId } = row.original

        function LayoutPopoverContent({
          layoutId,
          sku,
        }: {
          layoutId: string
          sku: string
        }) {
          return (
            <div className='flex flex-col justify-center space-y-2'>
              <div className='mb-2'>
                <Heading variant='h6' className='text-black '>
                  Planilha de produção
                </Heading>
                <Label className=' text-black'>Produto: {sku}</Label>
              </div>
              <Button variant='outline' asChild>
                <Link
                  href={`/painel/pedidos/${incrementalId}/planilhas/${layoutId}`}
                >
                  <Icons.Look className='mr-2 h-5 w-5' />
                  Ver planilha
                </Link>
              </Button>
              <Button variant='outline' asChild>
                <Link
                  href={`/painel/pedidos/${incrementalId}/planilhas/${layoutId}?edit=true`}
                >
                  <Icons.Edit className='mr-2 h-5 w-5' />
                  Editar planilha
                </Link>
              </Button>
              <Button variant='outline' asChild>
                <Link
                  href={`/painel/pedidos/${incrementalId}/planilhas/${layoutId}/documento`}
                >
                  <Icons.Look className='mr-2 h-5 w-5' />
                  Ver PDF de produção
                </Link>
              </Button>
            </div>
          )
        }

        return (
          <Card className='w-fit border-transparent p-2'>
            <CardContent className='m-0 flex flex-col space-y-2 p-0'>
              {itens.map((item, index) => {
                return (
                  <Popover key={item.id + '-' + index}>
                    <PopoverTrigger asChild>
                      <div className='flex items-center'>
                        <Small className='mr-2 font-semibold'>
                          {item.quantity}x
                        </Small>
                        <Badge className='w-fit  cursor-pointer select-none hover:border-wotanRed-500 hover:bg-wotanRed-50/50 hover:text-wotanRed-500'>
                          {typeof item.product === 'object' &&
                            item.product.title}
                        </Badge>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent>
                      {item.layout ? (
                        <LayoutPopoverContent
                          layoutId={
                            item.layout &&
                            (typeof item.layout === 'object'
                              ? item.layout.id
                              : item.layout)
                          }
                          sku={
                            typeof item.product === 'object' && item.product.sku
                          }
                        />
                      ) : (
                        <p>Nenhuma planilha encontrada</p>
                      )}
                    </PopoverContent>
                  </Popover>
                )
              })}
            </CardContent>
          </Card>
        )
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
                  toast.promise(deleteOrder({ orderId: order.id }), {
                    loading: 'Deletando...',
                    success: 'Pedido deletado com sucesso',
                    error: 'Erro ao deletar pedido...',
                  })
                })
              }}
              className='cursor-pointer'
              disabled={isDeletePending}
            >
              Deletar pedido
            </DropdownMenuItem>
          )
        }




        return (
          <div className='flex w-min gap-1'>
            <Button size='icon' variant='ghost' asChild>
              <Link href={`/painel/pedidos/${order.incrementalId}`}>
                <Icons.Look className='h-5 w-5' />
              </Link>
            </Button>
            <Button size='icon' variant='ghost' asChild>
              <Link href={`/painel/pedidos/${order.incrementalId}?edit=true`}>
                <Icons.Edit className='h-5 w-5' />
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' variant='ghost'>
                  <span className='sr-only'>Abrir menu</span>
                  <Icons.Dots className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Interações</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DeleteEstimateAction />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
