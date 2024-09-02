'use client'

import { useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  useFormState,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Heading } from '@/pegasus/heading'
import { CalendarIcon, PlusCircle, Save, Trash, UserRound } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Salesperson } from '@/payload/payload-types'
import { toast } from 'sonner'
import { createClient } from '../_logic/actions'
import { useRouter, useSearchParams } from 'next/navigation'
import { clientSchema } from '../_logic/validations'

type ClientProps = z.infer<typeof clientSchema>

interface ClientFormProps {
  salespeople: Salesperson[]
}

export function ClientForm({ salespeople }: ClientFormProps) {
  // const [salespersonId, setSalespersonId] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<ClientProps>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      type: 'company',
      origin: 'ads',
      status: 'active',
      contacts: [],
      adress: {
        state: null,
      },
    },
  })

  const { control, handleSubmit, watch } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: ClientProps) {
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

    const response = await createClient({
      name,
      razaosocial,
      type,
      document,
      contacts,
      adress,
      observations,
      ramo,
      salesperson,
      origin,
      status,
    })

    if (response.status === true) {
      toast.success(response.message)

      router.push('/painel/clientes')
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  const type = watch('type')
  const name = watch('name')

  return (
    <Form {...form}>
      <div className='sticky top-0 z-10 flex  items-center justify-between border-b bg-background px-4 pb-6 pt-8 '>
        <Heading variant='h5'>{name || 'Novo cliente'}</Heading>
        <Button
          type='submit'
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          variant='default'
        >
          <Save className='mr-2 h-4 w-4' /> Salvar
        </Button>
      </div>
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
                  <Input {...field} />
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
                  <Input {...field} />
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
                    onValueChange={field.onChange}
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
                  <Input
                    placeholder={
                      type === 'company'
                        ? '__.___.___/____-__'
                        : '___.___.___-__'
                    }
                    {...field}
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
                >
                  <SelectTrigger className='disabled:opacity-100'>
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
                          .filter((person) => person.roles === 'representative')
                          .map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.name}
                            </SelectItem>
                          ))}
                    </SelectGroup>
                  </SelectContent>
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
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
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
                  <Input {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select origin' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='ads'>Anúncios</SelectItem>
                      <SelectItem value='indication'>Indicação</SelectItem>
                      <SelectItem value='fiergs-list'>Lista FIERGS</SelectItem>
                      <SelectItem value='telephone-list'>
                        Lista Telefonica
                      </SelectItem>
                      <SelectItem value='direct'>Mala Direta</SelectItem>
                      <SelectItem value='prospect'>Prospecção</SelectItem>
                      <SelectItem value='website'>Site</SelectItem>
                      <SelectItem value='other'>Outro</SelectItem>
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
                    <Textarea placeholder='...' {...field} />
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
            size='icon'
            onClick={() =>
              append({ name: '', email: '', phone: '', whatsapp: '' })
            }
          >
            <PlusCircle className=' h-5 w-5' />
          </Button>
        </div>
        {/* Contacts Array */}
        <div className=' grid grid-cols-1 gap-2 tablet:grid-cols-2'>
          {fields.map((item, index) => (
            <Card key={item.id}>
              <CardHeader
                className='flex flex-row items-center justify-between space-y-0
              '
              >
                <Heading variant='h5'>Contato {index + 1}</Heading>

                <Button
                  type='button'
                  variant='destructive'
                  size='icon'
                  onClick={() => remove(index)}
                  className='m-0 mt-0'
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </CardHeader>
              <CardContent className='grid grid-cols-2 items-center gap-2 gap-x-4'>
                <FormField
                  control={control}
                  name={`contacts.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                    <Input {...field} />
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
                      <Input {...field} />
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
                        onValueChange={field.onChange}
                        value={field.value ?? ''}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione o estado' />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            'AC',
                            'AL',
                            'AP',
                            'AM',
                            'BA',
                            'CE',
                            'DF',
                            'ES',
                            'GO',
                            'MA',
                            'MS',
                            'MT',
                            'MG',
                            'PA',
                            'PB',
                            'PR',
                            'PE',
                            'PI',
                            'RJ',
                            'RN',
                            'RS',
                            'RO',
                            'RR',
                            'SC',
                            'SP',
                            'SE',
                            'TO',
                          ].map((state) => (
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
