'use client'

import { useState, useTransition } from 'react'

import { Attribute, Budget, Salesperson } from '@/payload/payload-types'

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
import { useRouter } from 'next/navigation'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import Image from 'next/image'

export const filterFields: DataTableFilterField<Budget>[] = [
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

export function getColumns(): ColumnDef<Budget>[] {
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
      accessorFn: (row) => row.contact.companyName,
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
    // {
    //   id: 'budget-details',
    //   cell: ({ row }) => {
    //     const budget = row.original

    //     function DetailsDialog() {
    //       const [isOpen, setOpen] = useState<boolean>(false)

    //       return (
    //         <Dialog open={isOpen} onOpenChange={isOpen ? setOpen : () => null}>
    //           <DialogTrigger asChild>
    //             <Button
    //               onClick={() => setOpen(true)}
    //               size='icon'
    //               variant='ghost'
    //               // className='rounded-full'
    //             >
    //               <Eye className='h-5 w-5' />
    //             </Button>
    //           </DialogTrigger>

    //           <DialogContent className='m-0 max-w-5xl p-0'>
    //             <ScrollArea className='max-h-[80vh] overflow-hidden rounded-md p-6'>
    //               <DialogHeader>
    //                 <Heading variant='h2'>Orçamento</Heading>
    //                 <DialogDescription>
    //                   Criado:{' '}
    //                   {formatRelative(budget.createdAt, new Date(), {
    //                     locale: ptBR,
    //                   })}
    //                 </DialogDescription>

    //                 <Card className='border-none shadow-sm'>
    //                   <CardContent className='p-2'>
    //                     <Heading variant='h4'>Contato</Heading>
    //                     <div className='grid grid-cols-2 gap-x-6 gap-y-2 px-3'>
    //                       <div className='space-y-1'>
    //                         <Label>Empresa</Label>
    //                         <Input
    //                           disabled
    //                           value={budget.contact.companyName}
    //                           className='disabled:cursor-text disabled:opacity-100'
    //                         />
    //                       </div>

    //                       <div className='space-y-1'>
    //                         <Label>Responsável</Label>
    //                         <Input
    //                           disabled
    //                           value={budget.contact.customerName}
    //                           className='disabled:cursor-text disabled:opacity-100'
    //                         />
    //                       </div>

    //                       <div className='space-y-1'>
    //                         <Label>Email</Label>
    //                         <Input
    //                           disabled
    //                           value={budget.contact.email}
    //                           className='disabled:cursor-text disabled:opacity-100'
    //                         />
    //                       </div>

    //                       <div className='space-y-1'>
    //                         <Label>Telefone</Label>
    //                         <Input
    //                           disabled
    //                           value={budget.contact.phone}
    //                           className='disabled:cursor-text disabled:opacity-100'
    //                         />
    //                       </div>

    //                       <div className='col-span-2'>
    //                         <Label>Detalhes</Label>
    //                         <Textarea
    //                           value={budget.contact.details}
    //                           className='min-h-24 disabled:cursor-text disabled:opacity-100'
    //                           disabled
    //                         />
    //                       </div>
    //                     </div>
    //                   </CardContent>
    //                 </Card>

    //                 <Separator className='my-1' />

    //                 {budget.items?.map((item) => (
    //                   <Card key={item.id}>
    //                     <CardContent className='items-start justify-between p-2 shadow-sm tablet:flex'>
    //                       {typeof item.product === 'object' && (
    //                         <div>
    //                           <Heading variant='h4'>
    //                             {item.product.title}
    //                           </Heading>
    //                           <Small>Quantidade: {item.quantity}</Small>
    //                           <div className='flex items-center space-x-2 space-y-1'>
    //                             {item.attributes?.map(
    //                               (attribute: Attribute) => (
    //                                 <div
    //                                   key={item.id + attribute.id}
    //                                   className='mx-auto'
    //                                 >
    //                                   <Small>
    //                                     {typeof attribute.type === 'object' &&
    //                                       attribute.type.name}
    //                                     {': '}
    //                                   </Small>
    //                                   <Badge className='w-fit border-2 border-accent bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground'>
    //                                     {typeof attribute === 'object' &&
    //                                       attribute.name}

    //                                     {typeof attribute.type === 'object' &&
    //                                       attribute.type.type === 'color' && (
    //                                         <div
    //                                           style={{
    //                                             backgroundColor:
    //                                               attribute.value,
    //                                           }}
    //                                           className='ml-2 h-5 w-5 rounded-full border-2'
    //                                         />
    //                                       )}
    //                                   </Badge>
    //                                 </div>
    //                               ),
    //                             )}
    //                           </div>
    //                         </div>
    //                       )}

    //                       <div>
    //                         <Image
    //                           resource={
    //                             typeof item.product === 'object' &&
    //                             item.product.featuredImage
    //                           }
    //                           imgClassName='w-24 h-24 aspect-square rounded-md shadow-wotan-light border hidden tablet:block'
    //                         />
    //                       </div>
    //                     </CardContent>
    //                   </Card>
    //                 ))}
    //               </DialogHeader>
    //             </ScrollArea>
    //           </DialogContent>
    //         </Dialog>
    //       )
    //     }

    //     return <DetailsDialog />
    //   },
    // },
    {
      id: 'actions',
      header: () => <span className='text-right'>Interações</span>,
      cell: ({ row }) => {
        const estimate = row.original

        function DeleteEstimateAction() {
          const [isDeletePending, startDeleteTransition] = useTransition()

          return (
            <DropdownMenuItem
              onClick={() => {
                startDeleteTransition(() => {
                  toast.promise(deleteEstimate({ estimateId: estimate.id }), {
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

        return (
          <div className='flex w-min gap-1'>
            <Button
              onClick={() => {
                router.push(`/painel/orcamentos/${estimate.id}`)
              }}
              size='icon'
              variant='ghost'
            >
              <Eye className='h-5 w-5' />
            </Button>{' '}
            <Button
              onClick={() => {
                router.push(`/painel/orcamentos/${estimate.id}?edit`)
              }}
              size='icon'
              variant='ghost'
            >
              <Pencil className='h-5 w-5' />
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

                <DeleteEstimateAction />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
