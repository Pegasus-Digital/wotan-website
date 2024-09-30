'use client'

// External libraries
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

import { toast } from 'sonner'
import { getRelativeDate } from '@/lib/date'

import { ColumnDef } from '@tanstack/react-table'

// Types
import { Client, Salesperson } from '@/payload/payload-types'
import { DataTableFilterField } from '@/components/table/types/table-types'

// UI components
import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  Select,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectSeparator,
} from '@/components/ui/select'

// Actions
import {
  deleteClient,
  updateClientStatus,
  updateClientSalesperson,
} from '../../_logic/actions'

// Table components
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'

export const filterFields: DataTableFilterField<Client>[] = [
  {
    label: 'Documento',
    value: 'document',
    placeholder: 'Filtrar por documento...',
  },
]

export function getColumns({
  salespeople,
}: {
  salespeople: Salesperson[]
}): ColumnDef<Client>[] {
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
      accessorKey: 'razaosocial',
      header: 'Nome/Razão social',
      cell: ({ row }) => {
        const value = row.original
        const { razaosocial, name } = value

        return razaosocial ? razaosocial : name
      },
    },
    {
      accessorKey: 'document',
      header: 'Documento',
      cell: ({ row }) => {
        const value: string = row.getValue('document')

        if (!value) return null

        // Check if it's a CPF (11 digits) or CNPJ (14 digits)
        if (value.length === 11) {
          // Format CPF
          return value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        } else if (value.length === 14) {
          // Format CNPJ
          return value.replace(
            /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
            '$1.$2.$3/$4-$5',
          )
        } else {
          // Invalid document
          return 'Documento inválido'
        }
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
              <div className='flex h-5 w-5 items-center justify-center rounded-full bg-muted p-1'>
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const value: string = row.getValue('status')
        return (
          <Badge
            variant={
              value === 'active'
                ? 'affirmative'
                : value === 'inactive'
                  ? 'destructive'
                  : 'outline'
            }
            className='capitalize'
          >
            {value === 'active'
              ? 'Ativo'
              : value === 'inactive'
                ? 'Inativo'
                : 'Prospect'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'updatedAt',
      enableHiding: true,

      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Atualizado em' />
      ),
      cell: ({ row }) => {
        const value: string = row.getValue('updatedAt')

        if (!value) {
          return 'Nunca foi atualizado'
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
        const client = row.original
        const [dialogTransferState, setDialogTransferState] = useState(false)
        const [dialogDeleteState, setDialogDeleteState] = useState(false)
        const [dialogStatusState, setDialogStatusState] = useState(false)
        // const [isTransferPending, startTransferTransition] = useTransition()
        // const [isDeletePending, startDeleteTransition] = useTransition()

        function DeleteClientDialog() {
          return (
            <Dialog
              open={dialogDeleteState}
              onOpenChange={setDialogDeleteState}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar deleção</DialogTitle>
                </DialogHeader>
                <DialogDescription className='font-bold'>
                  Atenção, você está prestes a deletar o cliente do sistema.
                  Esta operação não pode ser revertida.
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='default'>Voltar</Button>
                  </DialogClose>
                  <Button
                    variant='outline'
                    onClick={() => {
                      // startDeleteTransition(() => {
                      setDialogDeleteState(false)
                      toast.promise(deleteClient({ clientId: client.id }), {
                        loading: 'Deletando...',
                        success: 'Cliente deletado com sucesso',
                        error: 'Erro ao deletar cliente...',
                      })
                      // })
                    }}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

        function DeleteClientAction() {
          return (
            <DropdownMenuItem
              className='cursor-pointer'
              // disabled={isDeletePending}
              onClick={() => setDialogDeleteState(true)}
            >
              Deletar cliente
            </DropdownMenuItem>
          )
        }

        function TransferClientDialog() {
          // console.log('rendering transfer client dialog')
          const [selectedSalesperson, setSelectedSalesperson] =
            useState<string>(undefined)

          return (
            <Dialog
              open={dialogTransferState}
              onOpenChange={setDialogTransferState}
            >
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle>Transferir cliente</DialogTitle>
                  <DialogDescription>
                    Atenção, você irá transferir o cliente para outro vendedor.
                    Apenas o administrador do sistema poderá reverter esta
                    operação.
                  </DialogDescription>
                </DialogHeader>
                <div className=' grid grid-cols-1 items-center  justify-center gap-8 tablet:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]'>
                  {typeof client.salesperson === 'object' && (
                    <div className='flex items-center space-x-2 justify-self-center'>
                      {client.salesperson.avatar &&
                      typeof client.salesperson.avatar === 'object' &&
                      client.salesperson.avatar.url ? (
                        <Image
                          width={20}
                          height={20}
                          src={client.salesperson.avatar.url}
                          alt={client.salesperson.name} // Use name for the alt attribute for better accessibility
                          className='select-none rounded-full'
                        />
                      ) : (
                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-muted p-1'>
                          <Icons.User className='h-3 w-3 text-muted-foreground' />
                        </div>
                      )}

                      <p className='text-nowrap font-semibold'>
                        {client.salesperson.name}
                      </p>
                    </div>
                  )}
                  <Icons.LongArrowRight className='h-6 w-6 text-primary' />
                  <Select
                    onValueChange={setSelectedSalesperson}
                    value={selectedSalesperson}
                  >
                    <SelectTrigger className='w-64 disabled:opacity-100'>
                      <SelectValue placeholder='Selecione um Vendedor' />
                    </SelectTrigger>

                    <SelectContent side='bottom'>
                      <SelectGroup>
                        <SelectLabel>Vendedor Interno</SelectLabel>
                        {typeof salespeople === 'object' &&
                          salespeople
                            .filter((person) => person.roles === 'internal')
                            .map((person) => (
                              <SelectItem key={person.id} value={person.id}>
                                {person.name}
                              </SelectItem>
                            ))}
                      </SelectGroup>
                      <SelectSeparator />
                      <SelectGroup>
                        <SelectLabel>Representante Externo</SelectLabel>
                        {salespeople &&
                          salespeople
                            .filter(
                              (person) => person.roles === 'representative',
                            )
                            .map((person) => (
                              <SelectItem key={person.id} value={person.id}>
                                {person.name}
                              </SelectItem>
                            ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='default'>Voltar</Button>
                  </DialogClose>
                  <Button
                    variant='outline'
                    // disabled
                    onClick={() => {
                      // startTransferTransition(() => {
                      if (
                        selectedSalesperson ===
                        (typeof client.salesperson === 'object'
                          ? client.salesperson.id
                          : client.salesperson)
                      ) {
                        toast.error('Escolha outro vendedor')
                        return
                      }
                      setDialogTransferState(false)

                      toast.promise(
                        updateClientSalesperson({
                          id: client.id,
                          salespersonId: selectedSalesperson,
                        }),
                        {
                          loading: 'Transferindo...',
                          success: 'Cliente transferido com sucesso',
                          error: 'Erro ao transferir cliente...',
                        },
                      )
                      // })
                    }}
                  >
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }

        function TransferClientAction() {
          return (
            <DropdownMenuItem
              onClick={() => setDialogTransferState(true)}
              className='cursor-pointer'
              // disabled={isTransferPending}
            >
              Transferir cliente
            </DropdownMenuItem>
          )
        }

        function ChangeClientStatusDialog() {
          const [selectedStatus, setSelectedStatus] = useState<
            Client['status']
          >(client.status)

          return (
            <Dialog
              open={dialogStatusState}
              onOpenChange={setDialogStatusState}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Alterar Status do Cliente</DialogTitle>
                </DialogHeader>
                <DialogDescription className='font-bold'>
                  Selecione um novo status para o cliente.
                </DialogDescription>
                <Select
                  onValueChange={(value) =>
                    setSelectedStatus(value as Client['status'])
                  }
                  value={selectedStatus}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Selecione um Status' />
                  </SelectTrigger>

                  <SelectContent side='bottom'>
                    <SelectItem value='active'>Ativo</SelectItem>
                    <SelectItem value='inactive'>Inativo</SelectItem>
                    <SelectItem value='prospect'>Prospect</SelectItem>
                  </SelectContent>
                </Select>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant='default'>Voltar</Button>
                  </DialogClose>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setDialogStatusState(false)

                      toast.promise(
                        updateClientStatus({
                          id: client.id,
                          status: selectedStatus,
                        }),
                        {
                          loading: 'Atualizando...',
                          success: 'Status atualizado com sucesso',
                          error: 'Erro ao atualizado status...',
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

        function ChangeClientStatusAction() {
          return (
            <DropdownMenuItem
              className='cursor-pointer'
              // disabled={isChangeStatusPending}
              onClick={() => setDialogStatusState(true)}
            >
              Alterar status do cliente
            </DropdownMenuItem>
          )
        }

        return (
          <div className='flex w-min gap-1'>
            <Button asChild size='icon' variant='ghost'>
              <Link href={`/painel/clientes/${client.id}`}>
                <Icons.Look className='h-5 w-5' />
              </Link>
            </Button>
            <Button asChild size='icon' variant='ghost'>
              <Link href={`/painel/clientes/${client.id}?edit=true`}>
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

                <ChangeClientStatusAction />
                <TransferClientAction />
                <DeleteClientAction />
              </DropdownMenuContent>
            </DropdownMenu>

            <ChangeClientStatusDialog />
            <TransferClientDialog />
            <DeleteClientDialog />
          </div>
        )
      },
    },
  ]
}
