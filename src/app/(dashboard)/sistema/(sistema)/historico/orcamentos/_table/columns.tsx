'use client'

import Link from 'next/link'
import Image from 'next/image'

import { OldBudget, Salesperson } from '@/payload/payload-types'


import { ColumnDef } from '@tanstack/react-table'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { numericFilter } from '@/components/table/hooks/use-data-table'

import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'

import { Small } from '@/components/typography/texts'
import { getRelativeDate } from '@/lib/date'




export const filterFields: DataTableFilterField<OldBudget>[] = [
  {
    label: 'Número',
    value: 'incrementalId',
    placeholder: 'Filtrar por id...',
  },
]

export function getColumns(): ColumnDef<OldBudget>[] {
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
      id: 'company',
      accessorFn: (row) => row.empresa,
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
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-muted  p-1'>
                <Icons.User className='h-3 w-3 text-muted-foreground' />
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
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-muted p-1'>
                <Icons.User className='h-3 w-3 text-muted-foreground' />
              </div>
            )}

            <p className='font-bold'>{name}</p>
          </div>
        )
      },
    },
    // {
    //   accessorKey: 'items',
    //   header: 'Produtos',
    //   cell: ({ row }) => {
    //     const items: any[] = row.getValue('items')

    //     // Get the first 2 items
    //     const displayedItems = items.slice(0, 2)
    //     // Calculate the remaining items (from the 3rd item onwards)
    //     const remainingItems = items.slice(2)

    //     return (
    //       <Card className='w-full border-transparent p-2 px-4'>
    //         <CardContent className='m-0 space-y-2 p-0'>
    //           {displayedItems.map((item, index) => (
    //             <div key={item.id + '-' + index} className='flex items-center'>
    //               <Small className='mr-2 w-12 text-right font-semibold'>
    //                 {item.quantity}x
    //               </Small>
    //               <Badge className='w-fit'>
    //                 {item.product.title
    //                   ? item.product.title
    //                   : 'PRODUTO NÃO ENCONTRADO'}
    //               </Badge>
    //             </div>
    //           ))}

    //           {remainingItems.length === 1 && (
    //             <div className='flex items-center'>
    //               <Small className='mr-2 w-12 text-right font-semibold'>
    //                 {remainingItems[0].quantity}x
    //               </Small>
    //               <Badge className='w-fit'>
    //                 {remainingItems[0].product.title}
    //               </Badge>
    //             </div>
    //           )}

    //           {remainingItems.length > 1 && (
    //             <div className='flex items-center'>
    //               <Small className='mr-2 w-12  text-right font-semibold'>
    //                 {remainingItems.reduce(
    //                   (total, item) => total + item.quantity,
    //                   0,
    //                 )}
    //                 x
    //               </Small>
    //               <Badge className='w-fit'>
    //                 + {remainingItems.length} outros{' '}
    //                 {remainingItems.length === 1 ? 'item' : 'itens'}
    //               </Badge>
    //             </div>
    //           )}
    //         </CardContent>
    //       </Card>
    //     )
    //   },
    // },
    {
      id: 'createdAt',

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Data' />
      ),
      cell: ({ row }) => {
        const value: string = row.original.createdAt

        if (!value) {
          return 'Data não encontrada'
        }

        const date = new Date(value)
        const formattedDate = getRelativeDate(date)

        return formattedDate
      },
    },
    {
      id: 'actions',
      header: () => <span className='text-right'>Interações</span>,

      cell: ({ row }) => {
        const budget = row.original

        return (
          <div className='flex w-min gap-1'>
            {/* <Button size='icon' variant='ghost' asChild>
              <Link href={`/sistema/historico/orcamentos/${budget.incrementalId}`}>
                <Icons.Look className='h-5 w-5' />
              </Link>
            </Button> */}
            <Button size='icon' variant='ghost' asChild>
              <Link
                href={`/sistema/pdfs/${budget.incrementalId}.pdf`}
                locale={false}
                target="_blank" rel="noopener noreferrer"
                prefetch={false}
              >
                <Icons.File className='h-5 w-5' />
              </Link>
            </Button>
          </div>
        )
      },
    },
  ]
}
