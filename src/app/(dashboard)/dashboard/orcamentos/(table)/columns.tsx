'use client'

import { useState } from 'react'

import { Attribute, Budget } from '@/payload/payload-types'

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
import { Image } from '@/components/media/image'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

import { Heading } from '@/pegasus/heading'
import { Small } from '@/components/typography/texts'

import { Eye, MoreHorizontal } from 'lucide-react'
import { DataTableFilterField } from '@/components/table/types/table-types'

export const filterFields: DataTableFilterField<Budget>[] = [
  {
    label: 'Company Name',
    value: 'companyName',
    placeholder: 'Filtrar nome da empresa...',
  },
  {
    label: 'Company',
    value: 'companyName',
    placeholder: 'Filtrar nome da empresa...',
  },
]

export function getColumns(): ColumnDef<Budget>[] {
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
      id: 'company',
      accessorKey: 'companyName',
      header: 'Cliente',
    },
    {
      id: 'customer',
      accessorFn: (row) => row.customerName,
      header: 'Responsável',
      cell: ({ row }) => {
        const customer: string = row.getValue('customer')

        return <p className='min-w-32 max-w-32'>{customer}</p>
      },
    },
    {
      accessorKey: 'items',
      header: 'Produtos',
      cell: ({ row }) => {
        const items: any[] = row.getValue('items')

        return (
          <Card className='w-fit border-transparent p-2'>
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
        )
      },
    },
    {
      id: 'budget-details',
      cell: ({ row }) => {
        const budget = row.original

        function DetailsDialog() {
          const [isOpen, setOpen] = useState<boolean>(false)

          return (
            <Dialog open={isOpen} onOpenChange={isOpen ? setOpen : () => null}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setOpen(true)}
                  size='icon'
                  variant='ghost'
                >
                  <Eye className='h-5 w-5' />
                </Button>
              </DialogTrigger>

              <DialogContent className='m-0 max-w-5xl p-0'>
                <ScrollArea className='max-h-[80vh] overflow-hidden rounded-md p-6'>
                  <DialogHeader>
                    <Heading variant='h2'>Orçamento</Heading>
                    <DialogDescription>
                      Criado:{' '}
                      {formatRelative(budget.createdAt, new Date(), {
                        locale: ptBR,
                      })}
                    </DialogDescription>

                    <Card className='border-none shadow-sm'>
                      <CardContent className='p-2'>
                        <Heading variant='h4'>Contato</Heading>
                        <div className='grid grid-cols-2 gap-x-6 gap-y-2 px-3'>
                          <div className='space-y-1'>
                            <Label>Empresa</Label>
                            <Input
                              disabled
                              value={budget.companyName}
                              className='disabled:cursor-text disabled:opacity-100'
                            />
                          </div>

                          <div className='space-y-1'>
                            <Label>Responsável</Label>
                            <Input
                              disabled
                              value={budget.customerName}
                              className='disabled:cursor-text disabled:opacity-100'
                            />
                          </div>

                          <div className='space-y-1'>
                            <Label>Email</Label>
                            <Input
                              disabled
                              value={budget.email}
                              className='disabled:cursor-text disabled:opacity-100'
                            />
                          </div>

                          <div className='space-y-1'>
                            <Label>Telefone</Label>
                            <Input
                              disabled
                              value={budget.phone}
                              className='disabled:cursor-text disabled:opacity-100'
                            />
                          </div>

                          <div className='col-span-2'>
                            <Label>Detalhes</Label>
                            <Textarea
                              value={budget.details}
                              className='min-h-24 disabled:cursor-text disabled:opacity-100'
                              disabled
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Separator className='my-1' />

                    {budget.items?.map((item) => (
                      <Card key={item.id}>
                        <CardContent className='items-start justify-between p-2 shadow-sm tablet:flex'>
                          {typeof item.product === 'object' && (
                            <div>
                              <Heading variant='h4'>
                                {item.product.title}
                              </Heading>
                              <Small>Quantidade: {item.quantity}</Small>
                              <div className='flex items-center space-x-2 space-y-1'>
                                {item.attributes?.map(
                                  (attribute: Attribute) => (
                                    <div
                                      key={item.id + attribute.id}
                                      className='mx-auto'
                                    >
                                      <Small>
                                        {typeof attribute.type === 'object' &&
                                          attribute.type.name}
                                        {': '}
                                      </Small>
                                      <Badge className='w-fit border-2 border-accent bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground'>
                                        {typeof attribute === 'object' &&
                                          attribute.name}

                                        {typeof attribute.type === 'object' &&
                                          attribute.type.type === 'color' && (
                                            <div
                                              style={{
                                                backgroundColor:
                                                  attribute.value,
                                              }}
                                              className='ml-2 h-5 w-5 rounded-full border-2'
                                            />
                                          )}
                                      </Badge>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          <div>
                            <Image
                              resource={
                                typeof item.product === 'object' &&
                                item.product.featuredImage
                              }
                              imgClassName='w-24 h-24 aspect-square rounded-md shadow-wotan-light border hidden tablet:block'
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </DialogHeader>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          )
        }

        return <DetailsDialog />
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
}
