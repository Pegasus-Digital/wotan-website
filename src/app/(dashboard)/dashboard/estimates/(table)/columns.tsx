'use client'

import { Budget } from '@/payload/payload-types'

import { ColumnDef } from '@tanstack/react-table'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'

import { Small } from '@/components/typography/texts'

import { MoreHorizontal } from 'lucide-react'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

export const columns: ColumnDef<Budget>[] = [
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
    accessorKey: 'total',
    header: 'Total R$',
    cell: ({ row }) => {
      const total: number = Number.parseInt(row.getValue('total'))

      const formattedTotal = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(total)

      return <span>{formattedTotal}</span>
    },
  },
  {
    accessorKey: 'items',
    header: 'Produtos',
    cell: ({ row }) => {
      const items: any[] = row.getValue('items')

      return (
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger>
              <Card className='w-fit cursor-pointer border-transparent p-2 hover:border-border'>
                <CardContent className='m-0 space-y-2 p-0'>
                  {items.map((item, index) => {
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
                  })}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side='bottom' className='flex font-medium'>
              <MagnifyingGlassIcon className='mr-2 h-4 w-4' />
              Ver detalhes
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
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
              Editar orçamento
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer'>
              Cancelar orçamento
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
