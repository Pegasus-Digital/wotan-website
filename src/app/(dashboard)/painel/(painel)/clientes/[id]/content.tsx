'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatCNPJ, formatCPF } from '@/lib/format'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  Controller,
  useFormState,
  useFieldArray,
} from 'react-hook-form'

import { Client, Salesperson } from '@/payload/payload-types'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Icons } from '@/components/icons'
import { Heading } from '@/pegasus/heading'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectContent,
  SelectTrigger,
  SelectSeparator,
} from '@/components/ui/select'

import { updateClient } from '../_logic/actions'
import { clientSchema } from '../_logic/validations'
import { cities, states } from 'estados-cidades'

interface SeeClientContentProps {
  edit: boolean
  client: Client
  salespeople: Salesperson[]
}

type ClientProps = z.infer<typeof clientSchema>

export function SeeClientContent({
  salespeople,
  client,
  edit,
}: SeeClientContentProps) {
  const [editMode, toggleEditMode] = useState<boolean>(!edit)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [selectedState, setSelectedState] = useState<string | null>(
    client.adress?.state,
  )

  const router = useRouter()

  const form = useForm<ClientProps>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      contacts: client.contacts,
      adress: client.adress,
      type: client.type,
      document: client.document,
      name: client.name,
      razaosocial: client.razaosocial,
      // clientSince: client.clientSince,
      observations: client.observations,
      ramo: client.ramo,
      salesperson:
        typeof client.salesperson === 'string'
          ? client.salesperson
          : client.salesperson.id,
      origin: client.origin,
      status: client.status,
    },
  })

  const { control, handleSubmit, watch } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: ClientProps) {
    if (
      form.getValues('salesperson') !==
      (typeof client.salesperson === 'string'
        ? client.salesperson
        : client.salesperson.id)
    ) {
      setDialogOpen(true)

      return
    }

    const {
      name,
      razaosocial,
      type,
      document,
      contacts,
      adress,
      clientSince,
      observations,
      ramo,
      salesperson,
      origin,
      status,
    } = values

    // Document without special characters
    const numericDocument = document.replace(/\D/g, '')

    if (
      (type === 'company' && numericDocument.length !== 14) ||
      (type === 'individual' && numericDocument.length !== 11)
    ) {
      toast.error(
        type === 'company'
          ? 'CNPJ não está formatado corretamente'
          : 'CPF não está formatado corretamente',
      )
      return
    }
    const safeDoc = document.replace(/\D/g, '')

    const response = await updateClient(
      {
        name,
        razaosocial,
        type,
        document: safeDoc,
        contacts,
        adress,
        observations,
        ramo,
        salesperson,
        origin,
        status,
      },
      client.id,
    )

    setDialogOpen(false)
    if (response.status === true) {
      toast.success(response.message)

      router.push('/painel/clientes')
    }

    if (response.status === false) {
      toast.error(response.message)
    }
    return
  }

  function formatDocument(value: string, type: string) {
    if (type === 'company') {
      return formatCNPJ(value)
    } else return formatCPF(value)
  }

  const type = watch('type')
  const name = watch('name')

  return (
    <ContentLayout
      title={`${edit ? 'Editar c' : 'C'}liente`}
      navbarButtons={
        <Button
          type='submit'
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          variant='default'
        >
          <Icons.Save className='mr-2 h-5 w-5' /> Salvar
        </Button>
      }
    >
      <Form {...form}>
        {/* {!editMode && (
          <div className='sticky top-0 z-10 flex  items-center justify-between border-b bg-background px-4 pb-6 pt-8 '>
            <Heading variant='h5'>{name || 'Novo cliente'}</Heading>
            <Button
              type='submit'
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              variant='default'
            >
              <Icons.Save className='mr-2 h-5 w-5' /> Salvar
            </Button>

            <ConfirmationModal
              isDialogOpen={isDialogOpen}
              setDialogOpen={setDialogOpen}
              onConfirm={handleSubmit(onSubmit)}
            />
          </div>
        )} */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 px-2 pt-4'
        >
          <div className='grid grid-cols-1 gap-2 tablet:grid-cols-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='razaosocial'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(e) => {
                        field.onChange(e)
                        form.setValue('document', client.document)
                      }}
                      disabled={editMode}
                      value={field.value}
                      className='flex items-center space-x-4'
                      defaultValue='company'
                    >
                      <FormItem>
                        <FormControl>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='company' />
                            <FormLabel>Pessoa Juridica</FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value='individual' />
                            <FormLabel>Pessoa física</FormLabel>
                          </div>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='document'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{type === 'company' ? 'CNPJ' : 'CPF'}</FormLabel>
                  <FormControl>
                    <Controller
                      control={control}
                      name='document'
                      render={({ field }) => (
                        <Input
                          {...field}
                          disabled={editMode}
                          placeholder={
                            type === 'company'
                              ? '__.___.___/____-__'
                              : '___.___.___-__'
                          }
                          value={formatDocument(field.value, type)}
                          onChange={field.onChange}
                          maxLength={type === 'company' ? 18 : 14}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='salesperson'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // setSalespersonId(value)
                    }}
                    disabled={editMode}
                    value={field.value}
                  >
                    <SelectTrigger className='disabled:opacity-100'>
                      {editMode && typeof client.salesperson === 'object' ? (
                        <div className='flex items-center space-x-2'>
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

                          <p className='font-semibold'>
                            {client.salesperson.name}
                          </p>
                        </div>
                      ) : (
                        <SelectValue placeholder='Selecione um Vendedor' />
                      )}
                    </SelectTrigger>
                    {!editMode ? (
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
                    ) : (
                      <></>
                    )}
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='clientSince'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente Desde</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          disabled={editMode}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <Icons.Calendar className='ml-auto h-5 w-5 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        locale={ptBR}
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='ramo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ramo</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='origin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={editMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select origin' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ads'>Anúncios</SelectItem>
                        <SelectItem value='indication'>Indicação</SelectItem>
                        <SelectItem value='fiergs-list'>
                          Lista FIERGS
                        </SelectItem>
                        <SelectItem value='telephone-list'>
                          Lista Telefonica
                        </SelectItem>
                        <SelectItem value='direct'>Mala Direta</SelectItem>
                        <SelectItem value='prospect'>Prospecção</SelectItem>
                        <SelectItem value='website'>Site</SelectItem>
                        <SelectItem value='other'>Outro</SelectItem>
                        <SelectItem value='migration'>Migração de dados</SelectItem>

                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='col-span-full'>
              <FormField
                control={form.control}
                name='observations'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='...'
                        {...field}
                        disabled={editMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />
          <div className='flex items-center justify-between gap-2'>
            <Heading variant='h5'>Contatos</Heading>
            <Button
              type='button'
              variant='outline'
              disabled={editMode}
              size='icon'
              onClick={() =>
                append({ name: '', email: '', phone: '', whatsapp: '' })
              }
            >
              <Icons.Add className='h-5 w-5' />
            </Button>
          </div>
          {/* Contacts Array */}
          <div className='grid grid-cols-1 gap-2 tablet:grid-cols-2'>
            {fields.map((item, index) => (
              <Card key={item.id}>
                <CardHeader
                  className='flex flex-row items-center justify-between space-y-0
              '
                >
                  <Heading variant='h5'>Contato {index + 1}</Heading>

                  {!editMode && (
                    <Button
                      type='button'
                      variant='destructive'
                      size='icon'
                      onClick={() => remove(index)}
                      className='m-0 mt-0'
                    >
                      <Icons.Trash className='h-5 w-5' />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className='grid grid-cols-2 items-center gap-2 gap-x-4'>
                  <FormField
                    control={control}
                    name={`contacts.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={editMode} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`contacts.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={editMode} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`contacts.${index}.whatsapp`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={editMode} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`contacts.${index}.phone`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={editMode} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
          <Separator />
          <Card>
            <CardHeader>
              <Heading variant='h5'>Endereço</Heading>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='adress.street'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='adress.number'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='adress.neighborhood'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  control={form.control}
                  name='adress.city'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value ?? ''}
                          disabled={editMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione a cidade' />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedState ? (
                              cities(selectedState).map((city) => (
                                <SelectItem key={city} value={city}>
                                  {city}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value={'unselected'}>
                                Selecione o estado primeiro
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='adress.state'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedState(value)
                          }}
                          value={field.value ?? ''}
                          disabled={editMode}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o estado' />
                          </SelectTrigger>
                          <SelectContent>
                            {states().map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='adress.cep'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={editMode} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </ContentLayout>
  )
}

interface ConfirmationModalProps {
  isDialogOpen: boolean
  setDialogOpen: (state: boolean) => void
  onConfirm: () => void
}

function ConfirmationModal({
  isDialogOpen,
  setDialogOpen,
  onConfirm,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar transferência</DialogTitle>
          <DialogDescription>
            Atenção, você irá transferir o cliente para outro vendedor.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='default' onClick={() => setDialogOpen(false)}>
            Voltar
          </Button>
          <Button variant='outline' onClick={onConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
