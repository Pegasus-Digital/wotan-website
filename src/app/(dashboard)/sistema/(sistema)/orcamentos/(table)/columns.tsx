'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useTransition } from 'react'

import { Budget, Client, Salesperson } from '@/payload/payload-types'

import { toast } from 'sonner'
import { CheckCircle, Info } from 'lucide-react'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableFilterField } from '@/components/table/types/table-types'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { numericFilter } from '@/components/table/hooks/use-data-table'

import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button, buttonVariants } from '@/components/ui/button'
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

import {
  UpdateBudget,
  deleteBudget,
  emailBudgetToCustomer,
} from '../_logic/actions'

import { getClients } from '../_logic/get-clients'
import { updateBudgetStatus } from '../_logic/actions'
import { createOrder } from '../../pedidos/_logic/actions'
import { getRelativeDate } from '@/lib/date'

export const filterFields: DataTableFilterField<Budget>[] = [
  {
    label: 'Número',
    value: 'incrementalId',
    placeholder: 'Filtrar por número...',
  },
  {
    label: 'Cliente',
    value: 'contact',
    placeholder: 'Filtrar por cliente...',
  }
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
      accessorKey: 'contact',
      accessorFn: (row) => row.contact.companyName,
      header: 'Cliente',
      filterFn: () => { return true }
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
        const budget = row.original

        const [clients, setClients] = useState<Budget['client'][]>([])

        const [statusDialog, setStatusDialog] = useState(false)
        const [placeOrderDialog, setPlaceOrderDialog] = useState(false)
        const [downloaderDialog, setDownloaderDialog] = useState(false)
        const [deleteEstimateDialog, setDeleteEstimateDialog] = useState(false)
        const [sendEmailDialog, setSendEmailDialog] = useState(false)

        function SendEmailDialog() {
          const [isEmailPending, startEmailTransition] = useTransition()
          const [selectedEmail, setSelectedEmail] = useState<string>(
            budget.contact.email,
          )

          function handleSendEmail() {
            if (!selectedEmail) {
              return toast.error('Selecione um e-mail para enviar o orçamento.')
            }

            startEmailTransition(() => {
              toast.promise(
                emailBudgetToCustomer({ emailAddress: selectedEmail, budget }),
                {
                  loading: 'Enviando...',
                  success: 'Orçamento enviado com sucesso',
                  error: 'Erro ao enviar orçamento...',
                },
              )
            })

            setSendEmailDialog(false)
          }

          const client = budget?.client as Client

          return (
            <Dialog open={sendEmailDialog} onOpenChange={setSendEmailDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar orçamento por e-mail</DialogTitle>
                  <DialogDescription>
                    Nome do contato: {budget.contact.customerName}
                  </DialogDescription>
                </DialogHeader>

                <>
                  <Label>Selecione o email de destino</Label>
                  <Select
                    onValueChange={setSelectedEmail}
                    defaultValue={budget.contact.email}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o e-mail de envio do orçamento' />
                    </SelectTrigger>
                    <SelectContent>
                      {/* the budget has a default contact */}
                      <SelectItem value={budget.contact.email}>
                        {budget.contact.email}
                      </SelectItem>
                      {/* If it is a registered client, it may have more contacts, so make them available */}
                      {client &&
                        client.contacts.map((contact) => {
                          if (contact.email !== budget.contact.email) {
                            return (
                              <SelectItem
                                key={contact.email}
                                value={contact.email}
                              >
                                {contact.email}
                              </SelectItem>
                            )
                          }
                        })}
                    </SelectContent>
                  </Select>

                  <Link
                    href={`/cliente/orcamento/${budget.id}`}
                    target='_blank'
                    className={buttonVariants({
                      variant: 'outline',
                      className: 'items-start justify-start',
                    })}
                  >
                    Clique aqui para conferir o orçamento antes de enviá-lo.
                  </Link>

                  {client ? (
                    <div className='flex items-center gap-2 text-green-500'>
                      <CheckCircle size={24} />
                      <Small className='flex gap-2'>
                        Este cliente está registrado.
                      </Small>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2 text-muted-foreground'>
                      <Info size={24} />
                      <Small className='flex gap-2 text-sm'>
                        Este cliente não está registrado.
                      </Small>
                    </div>
                  )}
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant='outline'>Voltar</Button>
                    </DialogClose>
                    <Button
                      onClick={handleSendEmail}
                      variant='default'
                      disabled={isEmailPending}
                    >
                      Enviar
                    </Button>
                  </DialogFooter>
                </>

                {!budget.contact && (
                  <>
                    <Link
                      href={`/sistema/orcamentos/${budget.incrementalId}?edit=true`}
                      target='_blank'
                      className={buttonVariants({
                        variant: 'link',
                        className: 'items-start justify-start',
                      })}
                    >
                      Clique aqui para ir para a página de edição do orçamento.
                    </Link>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant='outline'>Voltar</Button>
                      </DialogClose>
                      <Button variant='default' disabled>
                        Enviar
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          )
        }

        function SendEmailAction() {
          return (
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => setSendEmailDialog(true)}
            >
              Enviar ao cliente
            </DropdownMenuItem>
          )
        }

        function DeleteEstimateDialog() {
          const [isDeletePending, startDeleteTransition] = useTransition()

          function handleDeleteEstimate() {
            startDeleteTransition(() => {
              toast.promise(deleteBudget({ budgetId: budget.id }), {
                loading: 'Deletando...',
                success: 'Orçamento deletado com sucesso',
                error: 'Erro ao deletar orçamento...',
              })
            })

            setDeleteEstimateDialog(false)
          }

          return (
            <Dialog
              open={deleteEstimateDialog}
              onOpenChange={setDeleteEstimateDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deletar orçamento</DialogTitle>
                  <DialogDescription>
                    Esta ação não é reversível.
                  </DialogDescription>
                </DialogHeader>
                Você tem certeza que quer deletar este orçamento?
                <DialogFooter>
                  <DialogClose asChild>
                    <Button disabled={isDeletePending} variant='default'>
                      Voltar
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDeleteEstimate}
                    disabled={isDeletePending}
                    variant='outline'
                  >
                    Deletar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

        function DeleteEstimateAction() {
          return (
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => setDeleteEstimateDialog(true)}
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
                <DialogDescription className='font-medium'>
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
                      href={`/sistema/orcamentos/${budget.incrementalId}/documento`}
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
              <Link href={`/sistema/orcamentos/${budget.incrementalId}`}>
                <Icons.Look className='h-5 w-5' />
              </Link>
            </Button>
            <Button size='icon' variant='ghost' asChild>
              <Link
                href={`/sistema/orcamentos/${budget.incrementalId}?edit=true`}
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
                <SendEmailAction />
              </DropdownMenuContent>
            </DropdownMenu>
            <BudgetDocumentDownloaderDialog />
            <ChangeBudgetStatusDialog />
            <PlaceOrderDialog />
            <DeleteEstimateDialog />
            <SendEmailDialog />
          </div>
        )
      },
    },
  ]
}
