'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { Budget, Salesperson } from '@/payload/payload-types'

import { toast } from 'sonner'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BudgetDocumentDownloader } from '../_components/pdf-downloader'

import { Small } from '@/components/typography/texts'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import { UpdateBudget, deleteBudget } from '../_logic/actions'
import { updateBudgetStatus } from '../_logic/actions'
import { createOrder } from '../../pedidos/_logic/actions'
import { getClients } from '../_logic/get-clients'
import { numericFilter } from '@/components/table/hooks/use-data-table'

export const filterFields: DataTableFilterField<Budget>[] = [
  {
    label: 'Número',
    value: 'incrementalId',
    placeholder: 'Filtrar por id...',
  },
]

export function getColumns(): ColumnDef<Budget>[] {
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
    {
      accessorKey: 'items',
      header: 'Produtos',
      cell: ({ row }) => {
        const items: any[] = row.getValue('items')

        // Get the first 2 items
        const displayedItems = items.slice(0, 2)
        // Calculate the remaining items (from the 3rd item onwards)
        const remainingItems = items.slice(2)

        return (
          <Card className='w-full border-transparent p-2 px-4'>
            <CardContent className='m-0 space-y-2 p-0'>
              {displayedItems.map((item, index) => (
                <div key={item.id + '-' + index} className='flex items-center'>
                  <Small className='mr-2 w-12 text-right font-semibold'>
                    {item.quantity}x
                  </Small>
                  <Badge className='w-fit'>
                    {item.product.title
                      ? item.product.title
                      : 'PRODUTO NÃO ENCONTRADO'}
                  </Badge>
                </div>
              ))}

              {remainingItems.length === 1 && (
                <div className='flex items-center'>
                  <Small className='mr-2 w-12 text-right font-semibold'>
                    {remainingItems[0].quantity}x
                  </Small>
                  <Badge className='w-fit'>
                    {remainingItems[0].product.title}
                  </Badge>
                </div>
              )}

              {remainingItems.length > 1 && (
                <div className='flex items-center'>
                  <Small className='mr-2 w-12  text-right font-semibold'>
                    {remainingItems.reduce(
                      (total, item) => total + item.quantity,
                      0,
                    )}
                    x
                  </Small>
                  <Badge className='w-fit'>
                    + {remainingItems.length} outros{' '}
                    {remainingItems.length === 1 ? 'item' : 'itens'}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        )
      },
    },
    {
      id: 'origin',
      header: 'Origem',
      cell: ({ row }) => {
        const { origin } = row.original
        return (
          <Label className='capitalize'>
            {origin === 'interno' ? 'Interno' : 'Website'}
          </Label>
        )
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { status } = row.original
        // console.log(status)

        if (!status)
          return (
            <Badge variant={'outline'} className='capitalize'>
              Nenhum
            </Badge>
          )

        return (
          <Badge
            variant={
              status === 'aprovado'
                ? 'affirmative'
                : status === 'cancelado'
                  ? 'destructive'
                  : 'outline'
            }
            className='capitalize'
          >
            {status}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: () => <span className='text-right'>Interações</span>,

      cell: ({ row }) => {
        const budget = row.original
        const [clients, setClients] = useState<Budget['client'][]>([])

        const [statusDialog, setStatusDialog] = useState(false)
        const [placeOrderDialog, setPlaceOrderDialog] = useState(false)
        const [downloaderDialog, setDownloaderDialog] = useState(false)

        function DeleteEstimateAction() {
          const [isDeletePending, startDeleteTransition] = useTransition()

          return (
            <DropdownMenuItem
              onClick={() => {
                startDeleteTransition(() => {
                  toast.promise(deleteBudget({ budgetId: budget.id }), {
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

        function PlaceOrderDialog() {
          const [selectedClient, setSelectedClient] = useState<
            Budget['client'] | null
          >(null)
          const [selectedContact, setSelectedContact] = useState<
            Budget['selectedContact'] | null
          >(null)

          return (
            <Dialog open={placeOrderDialog} onOpenChange={setPlaceOrderDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fazer pedido</DialogTitle>
                </DialogHeader>
                <DialogDescription className='font-bold'>
                  Antes, precisamos confirmar o Cliente e Contato.
                </DialogDescription>
                <div className='grid gap-1'>
                  <div className='space-y-1'>
                    <Label>Cliente</Label>

                    <Select
                      onValueChange={(value) => {
                        const client = clients.find(
                          (client) =>
                            (typeof client === 'object'
                              ? client.id
                              : client) === value,
                        )
                        setSelectedClient(client)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um Cliente' />
                      </SelectTrigger>

                      <SelectContent side='bottom'>
                        {clients.length === 0 && (
                          <SelectItem
                            value={null}
                            disabled
                            className='flex items-center justify-center'
                          >
                            Você ainda não possui nenhum cliente.
                          </SelectItem>
                        )}
                        {clients.map((client) => {
                          return (
                            typeof client === 'object' && (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            )
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-1'>
                    <Label>Contato</Label>

                    <Select
                      onValueChange={(value) => {
                        const selectedContact =
                          typeof selectedClient === 'object' &&
                          selectedClient?.contacts.find(
                            (contact) => contact.id === value,
                          )

                        setSelectedContact(selectedContact.id)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um Contato' />
                      </SelectTrigger>
                      <SelectContent side='bottom'>
                        {!selectedClient && (
                          <SelectItem
                            value={null}
                            disabled
                            className='flex items-center justify-center'
                          >
                            Selecione um cliente para ver seus contatos
                          </SelectItem>
                        )}
                        {typeof selectedClient === 'object' &&
                          selectedClient?.contacts?.length === 0 && (
                            <SelectItem value={null} disabled>
                              Não encontramos nenhum contato para este cliente.
                            </SelectItem>
                          )}
                        {typeof selectedClient === 'object' &&
                          selectedClient?.contacts.length > 0 &&
                          selectedClient.contacts.map((contact) => (
                            <SelectItem key={contact.id} value={contact.id}>
                              {contact.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='default'>Voltar</Button>
                  </DialogClose>
                  <Button
                    variant='outline'
                    disabled={
                      selectedClient === null || selectedContact === null
                    }
                    onClick={async () => {
                      if (selectedClient && selectedContact) {
                        const response = await UpdateBudget({
                          budget: {
                            ...budget,
                            items: budget.items.map((item) => ({
                              ...item,
                              product:
                                typeof item.product === 'object'
                                  ? item.product.id
                                  : item.product,
                              attributes: [],
                            })),
                            salesperson:
                              typeof budget.salesperson === 'object'
                                ? budget.salesperson.id
                                : budget.salesperson,
                            status: 'aprovado',
                            client:
                              typeof selectedClient === 'object'
                                ? selectedClient.id
                                : selectedClient,
                            selectedContact: selectedContact,
                          },
                          id: budget.id,
                        })
                        if (response.status === true && response.data.budget) {
                          toast.promise(
                            createOrder({
                              order: {
                                client: budget.client,
                                contact: budget.selectedContact,
                                itens: budget.items.map((item) => ({
                                  // ...item,
                                  product:
                                    typeof item.product === 'object'
                                      ? item.product.id
                                      : item.product,
                                  attributes: item.attributes,
                                  quantity: item.quantity,
                                  price: item.price,
                                  print: item.print,
                                })),
                                salesperson: budget.salesperson,
                                ogBudget: budget.id,
                              },
                            }),
                            {
                              loading: 'Criando pedido...',
                              success: 'Pedido criado com sucesso',
                              error: 'Erro ao criar o pedido...',
                            },
                          )
                        }
                      }
                      setStatusDialog(false)
                    }}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

        function PlaceOrderAction() {
          return (
            <DropdownMenuItem
              onClick={async () => {
                if (budget.client && budget.selectedContact) {
                  if (budget.status !== 'aprovado') {
                    toast.promise(
                      updateBudgetStatus({
                        id: budget.id,
                        status: 'aprovado',
                      }),
                      {
                        loading: 'Atualizando...',
                        success: 'Orçamento aprovado com sucesso',
                        error: 'Erro ao atualizar o status...',
                      },
                    )
                  }
                  toast.promise(
                    createOrder({
                      order: {
                        client:
                          typeof budget.client === 'object'
                            ? budget.client.id
                            : budget.client,
                        contact: budget.selectedContact,
                        itens: budget.items.map((item) => ({
                          // ...item,
                          product:
                            typeof item.product === 'object'
                              ? item.product.id
                              : item.product,
                          attributes: item.attributes,
                          quantity: item.quantity,
                          price: item.price,
                          print: item.print,
                        })),
                        salesperson:
                          typeof budget.salesperson === 'object'
                            ? budget.salesperson.id
                            : budget.salesperson,
                        ogBudget: budget.id,
                      },
                    }),
                    {
                      loading: 'Criando pedido...',
                      success: 'Pedido criado com sucesso',
                      error: 'Erro ao criar o pedido...',
                    },
                  )
                } else {
                  const { data } = await getClients()
                  setClients(data)
                  setPlaceOrderDialog(true)
                }
              }}
              className='cursor-pointer'
            >
              Fazer pedido
            </DropdownMenuItem>
          )
        }

        function ChangeBudgetStatusDialog() {
          const [selectedStatus, setSelectedStatus] = useState<
            Budget['status']
          >(budget.status)

          return (
            <Dialog open={statusDialog} onOpenChange={setStatusDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Status do Orçamento</DialogTitle>
                </DialogHeader>
                <DialogDescription className='font-bold'>
                  Atualize o status do orçamento.
                </DialogDescription>
                <Select
                  onValueChange={(value) =>
                    setSelectedStatus(value as Budget['status'])
                  }
                  value={selectedStatus}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione um Status' />
                  </SelectTrigger>

                  <SelectContent side='bottom'>
                    <SelectItem value='criado'>Criado</SelectItem>
                    <SelectItem value='contato'>Em contato</SelectItem>
                    <SelectItem value='enviado'>Enviado p/ Cliente</SelectItem>
                    <SelectItem value='pendente'>
                      Aguardando aprovação
                    </SelectItem>
                    <SelectItem value='aprovado'>Aprovado</SelectItem>
                    <SelectItem value='cancelado'>Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='outline'>Voltar</Button>
                  </DialogClose>
                  <Button
                    variant='default'
                    onClick={() => {
                      setStatusDialog(false)

                      toast.promise(
                        updateBudgetStatus({
                          id: budget.id,
                          status: selectedStatus,
                        }),
                        {
                          loading: 'Atualizando...',
                          success: 'Status atualizado com sucesso',
                          error: 'Erro ao atualizar o status...',
                        },
                      )
                    }}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

        function ChangeBudgetStatusAction() {
          return (
            <DropdownMenuItem
              className='cursor-pointer'
              // disabled={isChangeStatusPending}
              onClick={() => setStatusDialog(true)}
            >
              Alterar status
            </DropdownMenuItem>
          )
        }

        function BudgetDocumentDownloaderDialog() {
          return (
            <Dialog open={downloaderDialog} onOpenChange={setDownloaderDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Download do Documento</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Abra ou baixe o PDF do orçamento.
                </DialogDescription>
                <div className='mt-2 grid grid-cols-2 gap-2'>
                  <BudgetDocumentDownloader budget={budget} />

                  <Button variant='outline' asChild>
                    <Link
                      href={`/painel/orcamentos/${budget.incrementalId}/documento`}
                    >
                      <Icons.Anchor className='mr-2 h-5 w-5' />
                      Ver PDF do orçamento
                    </Link>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )
        }

        return (
          <div className='flex w-min gap-1'>
            <Button size='icon' variant='ghost' asChild>
              <Link href={`/painel/orcamentos/${budget.incrementalId}`}>
                <Icons.Look className='h-5 w-5' />
              </Link>
            </Button>
            <Button size='icon' variant='ghost' asChild>
              <Link
                href={`/painel/orcamentos/${budget.incrementalId}?edit=true`}
              >
                <Icons.Edit className='h-5 w-5' />
              </Link>
            </Button>
            {/* <BudgetDocumentDownloader budget={budget} /> */}

            <Button
              onClick={() => {
                setDownloaderDialog(true)
              }}
              size='icon'
              variant='ghost'
            >
              <Icons.Print className='h-5 w-5' />
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
                <ChangeBudgetStatusAction />
                <PlaceOrderAction />

                <DeleteEstimateAction />
              </DropdownMenuContent>
            </DropdownMenu>
            <BudgetDocumentDownloaderDialog />
            <ChangeBudgetStatusDialog />
            <PlaceOrderDialog />
          </div>
        )
      },
    },
  ]
}
