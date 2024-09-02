'use client'

import { useState } from 'react'
import { useForm, useFormState, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/pegasus/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Heading } from '@/pegasus/heading'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Content, ContentHeader } from '@/components/content'
import { Client, Order, Salesperson } from '@/payload/payload-types'

const orderSchema = z.object({
  cliente_sel: z.string().nonempty({ message: 'Cliente é obrigatório' }),
  contato_sel: z.string().nonempty({ message: 'Contato é obrigatório' }),
  vendedor: z.string().nonempty({ message: 'Vendedor é obrigatório' }),
  endereco: z.string().nonempty({ message: 'Endereço é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  rua: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cep: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  pagencia: z.string().optional(),
  produtos: z
    .array(
      z.object({
        codigo: z.string().nonempty({ message: 'Código é obrigatório' }),
        produto: z.string().nonempty({ message: 'Produto é obrigatório' }),
        impressao: z.string().nonempty({ message: 'Impressão é obrigatória' }),
        amostra: z.string().nonempty({ message: 'Amostra é obrigatória' }),
        quantidade: z
          .number()
          .positive({ message: 'Quantidade deve ser positiva' }),
        preco: z.number().positive({ message: 'Preço deve ser positivo' }),
      }),
    )
    .nonempty(),
})

type OrderProps = z.infer<typeof orderSchema>

interface SeeOrderContentProps {
  order: Order
  edit: boolean
  salespeople: Salesperson[]
  clients: Client[]
}

export function SeeOrderContent({
  order,
  edit,
  clients,
  salespeople,
}: SeeOrderContentProps) {
  const [selectedClient, setSelectedClient] = useState<string>(
    typeof order.client === 'object' ? order.client.id : order.client,
  )
  const [selectedContact, setSelectedContact] = useState<string>('')

  const form = useForm<OrderProps>({
    resolver: zodResolver(orderSchema),
    defaultValues: {},
  })

  const { control, handleSubmit } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'produtos',
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: OrderProps) {
    // console.log('Order submitted:', values)
  }

  return (
    <Content>
      <ContentHeader
        title={`${edit ? 'Editar o' : 'O'} Pedido`}
        description={`Visualize ou edite o pedido conforme necessário.`}
      />
      <Separator className='mb-4' />
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 px-2 pt-4'>
          <Card>
            <CardHeader>
              <Heading variant='h6' className='text-black'>
                Cliente
              </Heading>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='cliente_sel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedClient(value)
                          }}
                          disabled={edit}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione um Cliente' />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contato_sel'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedContact(value)
                          }}
                          disabled={edit || !selectedClient}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione um Contato' />
                          </SelectTrigger>
                          <SelectContent>
                            {/* {contacts.filter(contact => contact.id === selectedClient).map(contact => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.name}
                              </SelectItem>
                            ))} */}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='vendedor'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendedor</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          disabled={edit}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione um Vendedor' />
                          </SelectTrigger>
                          <SelectContent>
                            {salespeople.map((salesperson) => (
                              <SelectItem
                                key={salesperson.id}
                                value={salesperson.id}
                              >
                                {salesperson.name}
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
            </CardContent>
          </Card>
          <Separator className='my-4' />
          <Card>
            <CardHeader>
              <Heading variant='h6' className='text-black'>
                Produtos
              </Heading>
            </CardHeader>
            <CardContent>
              {fields.map((field, index) => (
                <div key={field.id} className='grid grid-cols-6 gap-6'>
                  <FormField
                    control={form.control}
                    name={`produtos.${index}.codigo`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={edit}
                            placeholder='Código do Produto'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`produtos.${index}.produto`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produto</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={edit}
                            placeholder='Nome do Produto'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`produtos.${index}.impressao`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impressão</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={edit}
                            placeholder='Tipo de Impressão'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`produtos.${index}.amostra`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amostra</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={edit}
                            placeholder='Amostra do Produto'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`produtos.${index}.quantidade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={edit}
                            type='number'
                            placeholder='Quantidade'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`produtos.${index}.preco`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={edit}
                            type='number'
                            placeholder='Preço'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          <Separator className='my-4' />
          <Button type='submit' variant='default' disabled={isSubmitting}>
            Salvar Pedido
          </Button>
        </form>
      </Form>
    </Content>
  )
}
