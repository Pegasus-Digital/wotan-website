'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Order,
  Client,
  Product,
  Attribute,
  Salesperson,
} from '@/payload/payload-types'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState, useFieldArray } from 'react-hook-form'

import { Heading } from '@/pegasus/heading'
import { P } from '@/components/typography/texts'

import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table'

import {
  Command,
  CommandItem,
  CommandList,
  CommandInput,
  CommandGroup,
  CommandEmpty,
} from '@/components/ui/command'

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import {
  Select,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectSeparator,
} from '@/components/ui/select'

import { updateOrder } from '../_logic/actions'
import { orderSchema } from '../_logic/validation'

// Define the validation schema

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
    typeof order.client === 'string' ? order.client : order.client.id,
  )
  const [selectedContact, setSelectedContact] = useState<string>(order.contact)
  const [editMode, toggleEditMode] = useState<boolean>(!edit)
  const [deliveryAddress, setDeliveryAddress] = useState<boolean>(
    order.adress ? true : false,
  )

  const router = useRouter()

  const form = useForm<OrderProps>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client: typeof order.client === 'string' ? order.client : order.client.id,
      contact: order.contact,
      alternativeContact: order.alternativeContact,
      adress: order.adress,
      salesperson:
        typeof order.salesperson === 'string'
          ? order.salesperson
          : order.salesperson.id,
      shippingTime: order.shippingTime,
      shippingCompany: order.shippingCompany,
      shippingType: order.shippingType,
      paymentConditions: order.paymentConditions,
      paymentType: order.paymentType,
      agency: order.agency,
      commission: order.commission,
      notes: order.notes,
      status: order.status,
      itens: order.itens.map((item) => ({
        product:
          typeof item.product === 'string'
            ? item.product
            : {
                id: item.product.id,
                title: item.product.title,
                sku: item.product.sku,
                minimumQuantity: item.product.minimumQuantity,
                active: item.product.active,
                featuredImage: item.product.featuredImage,
              },
        // attributes: item.attributes,
        quantity: item.quantity,
        price: item.price,
        sample: item.sample,
        print: item.print,
        layoutSent: item.layoutSent,
        layoutApproved: item.layoutApproved,
      })),
    },
  })

  // console.log('Order default:', order)

  const { control, handleSubmit } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itens',
  })

  const [addProductDialog, setAddProductDialog] = useState<boolean>(false)

  // const

  const { isSubmitting } = useFormState({ control: form.control })

  const formatValue = (value: number) => {
    const integerPart = Math.floor(value / 100).toString()
    const decimalPart = (value % 100).toString().padStart(2, '0')
    return `${integerPart},${decimalPart}`
  }

  const parseValue = (formattedValue: string) => {
    const numericValue = formattedValue.replace(/\D/g, '') // Remove non-numeric characters
    return parseInt(numericValue, 10)
  }

  async function onSubmit(values: OrderProps) {
    // console.log('Order submitted:', values)

    const response = await updateOrder({
      id: order.id,
      order: {
        ...values,
        itens: values.itens.map((item) => ({
          ...item,
          product:
            typeof item.product === 'string' ? item.product : item.product.id,

          // attributes: item.attributes,
          quantity: item.quantity,
          price: item.price,
          layoutSent: item.layoutSent,
          layoutApproved: item.layoutApproved,
          sample: item.sample,
        })),
        client: selectedClient,
        contact: selectedContact,
      },
    })

    // console.log('Response:', response)

    if (response.status === true) {
      toast.success('Pedido atualizado com sucesso')
      router.push('/painel/pedidos')
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  return (
    <Content>
      <ContentHeader
        title={`${edit ? 'Editar o' : 'O'} Pedido`}
        description={`Visualize ou edite o pedido conforme necessário.`}
      />
      <Separator className='mb-4' />
      <Form {...form}>
        {!editMode && (
          <div className='sticky top-0 z-10 flex  items-center justify-between border-b bg-background px-4 pb-6 pt-8 '>
            <Heading variant='h5'>
              {/* {order.contact.companyName || 'Novo orçamento'} */}
            </Heading>
            <Button
              type='submit'
              // disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              variant='default'
            >
              <Icons.Save className='mr-2 h-4 w-4' /> Salvar
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 px-2 pt-4'>
          <Card>
            <CardHeader>
              <Heading variant='h6' className='text-black'>
                Cliente e Contato
              </Heading>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='client'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedClient(value)
                          }}
                          disabled={editMode}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione um Cliente' />
                          </SelectTrigger>
                          {!editMode ? (
                            <SelectContent side='bottom'>
                              {typeof clients === 'object' &&
                              clients.length === 0 ? (
                                <SelectItem value='nenhum' disabled>
                                  Você ainda não possui nenhum cliente.
                                </SelectItem>
                              ) : (
                                typeof clients === 'object' &&
                                clients.map((client) => (
                                  <SelectItem key={client.id} value={client.id}>
                                    {client.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          ) : (
                            <></>
                          )}
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='contact'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contato</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedContact(value)
                          }}
                          disabled={editMode || !selectedClient}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione um Contato' />
                          </SelectTrigger>
                          <SelectContent>
                            {/* {contacts
                              .filter(
                                (contact) => contact.id === selectedClient,
                              )
                              .map((contact) => (
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
                          {typeof order.salesperson === 'object' ? (
                            <div className='flex items-center space-x-2'>
                              {order.salesperson.avatar &&
                              typeof order.salesperson.avatar === 'object' &&
                              order.salesperson.avatar.url ? (
                                <Image
                                  width={20}
                                  height={20}
                                  src={order.salesperson.avatar.url}
                                  alt={order.salesperson.name} // Use name for the alt attribute for better accessibility
                                  className='select-none rounded-full'
                                />
                              ) : (
                                <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 p-1'>
                                  <Icons.User className='h-3 w-3 text-gray-600' />
                                </div>
                              )}

                              <p className='font-semibold'>
                                {order.salesperson.name}
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
                                  .filter(
                                    (person) => person.roles === 'internal',
                                  )
                                  .map((person) => (
                                    <SelectItem
                                      key={person.id}
                                      value={person.name}
                                    >
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
                                    (person) =>
                                      person.roles === 'representative',
                                  )
                                  .map((person) => (
                                    <SelectItem
                                      key={person.id}
                                      value='salesperson'
                                    >
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
                  control={form.control}
                  name={'commission'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comissão</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2 font-medium'>
                          <Input
                            {...field}
                            disabled={editMode}
                            className='disabled:opacity-100'
                            type='number'
                          />
                          <Label>%</Label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'paymentConditions'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condições de Pagamento</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={editMode}
                          className='disabled:opacity-100'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'shippingCompany'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transportadora</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={editMode}
                          className='disabled:opacity-100'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'shippingTime'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prazo de Entrega</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={editMode}
                          className='disabled:opacity-100'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'shippingType'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Frete</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          disabled={editMode}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='disabled:opacity-100'>
                            <SelectValue placeholder='Selecione um tipo de frete' />
                          </SelectTrigger>
                          <SelectContent side='bottom'>
                            <SelectItem value='cif'>CIF</SelectItem>
                            <SelectItem value='fob'>FOB</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'paymentType'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Pagamento</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          disabled={editMode}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='disabled:opacity-100'>
                            <SelectValue placeholder='Selecione um tipo de frete' />
                          </SelectTrigger>
                          <SelectContent side='bottom'>
                            <SelectItem value='boleto'>Boleto</SelectItem>
                            <SelectItem value='pix'>PIX</SelectItem>
                            <SelectItem value='deposito'>Depósito</SelectItem>
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
            <CardHeader className='flex flex-row justify-between'>
              <Heading variant='h6' className='text-black'>
                Endereço de entrega
              </Heading>
              <RadioGroup
                defaultValue={deliveryAddress ? 'same' : 'alternate'}
                className='mr-6 flex flex-row gap-2'
                onValueChange={(value) => {
                  setDeliveryAddress(value === 'same')
                }}
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='same' id='r1' />
                  <Label htmlFor='r1'>Mesmo endereço</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='alternate' id='r2' />
                  <Label htmlFor='r2'>Outro endereço</Label>
                </div>
              </RadioGroup>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='adress.street'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={editMode || deliveryAddress}
                      />
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
                      <Input
                        {...field}
                        disabled={editMode || deliveryAddress}
                      />
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
                      <Input
                        {...field}
                        disabled={editMode || deliveryAddress}
                      />
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
                        <Input
                          {...field}
                          disabled={editMode || deliveryAddress}
                        />
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
                          disabled={editMode || deliveryAddress}
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
                name='adress.zipCode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={editMode || deliveryAddress}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Separator className='my-4' />
          <div className='flex items-center justify-between gap-2'>
            <Heading variant='h6' className='text-black'>
              Produtos
            </Heading>
            <Button
              type='button'
              variant='outline'
              disabled={editMode}
              size='icon'
              onClick={() => setAddProductDialog(true)}
            >
              <Icons.Add className=' h-5 w-5' />
            </Button>
          </div>
          <Table>
            <TableHeader className='w-full'>
              <TableRow className='w-full'>
                {/* <TableHead className='w-32'></TableHead> */}
                <TableHead className='w-24'>Código</TableHead>
                <TableHead className='w-48'>Nome</TableHead>
                <TableHead className='w-48'>Quantidade</TableHead>
                <TableHead className='w-48'>Valor Unitário</TableHead>
                <TableHead>Atributos</TableHead>
                <TableHead className=''>Impressão</TableHead>

                <TableHead className=''>Amostra</TableHead>

                <TableHead className=''>Layout</TableHead>

                {!editMode && (
                  <TableHead className='text-end'>Interações</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  {typeof field.product === 'object' && (
                    <>
                      <TableCell>{field.product.sku}</TableCell>
                      <TableCell>{field.product.title}</TableCell>
                      <TableCell className='font-medium'>
                        <FormField
                          control={form.control}
                          name={`itens.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={editMode}
                                  placeholder='A partir de X produtos'
                                  className='disabled:opacity-100'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className='text-right'>
                        <FormField
                          control={form.control}
                          name={`itens.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className='flex items-center gap-2 font-medium'>
                                  <Label>R$</Label>

                                  <Input
                                    {...field}
                                    disabled={editMode}
                                    value={formatValue(field.value)}
                                    onChange={(e) => {
                                      field.onChange(parseValue(e.target.value))
                                    }}
                                    inputMode='numeric'
                                    placeholder='0,00'
                                    className='disabled:opacity-100'
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        {field.product.attributes && (
                          <AttributesCombobox
                            attributeArray={field.product.attributes.filter(
                              isAttribute,
                            )}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <FormField
                          name={`itens.${index}.print`}
                          control={form.control}
                          render={({ field }) => (
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                disabled={editMode}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder='Selecione' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='Serigrafia'>
                                    Serigrafia
                                  </SelectItem>
                                  <SelectItem value='Laser'>Laser</SelectItem>
                                  <SelectItem value='Bordado'>
                                    Bordado
                                  </SelectItem>
                                  <SelectItem value='Adesivo'>
                                    Adesivo
                                  </SelectItem>
                                  <SelectItem value='Gravação	em Madeira'>
                                    Gravação em Madeira
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          name={`itens.${index}.sample`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className='my-2 flex flex-col self-end '>
                              <div className='flex items-center gap-2.5 space-y-0'>
                                <FormControl>
                                  <Checkbox
                                    className='disabled:opacity-100 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={editMode}
                                  />
                                </FormControl>
                                {/* <FormLabel className='cursor-pointer hover:underline'>
                                  
                                </FormLabel> */}
                              </div>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className=''>
                        <FormField
                          name={`itens.${index}.layoutSent`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className='my-2 flex flex-col self-end '>
                              <div className='flex items-center gap-2.5 space-y-0'>
                                <FormControl>
                                  <Checkbox
                                    className='disabled:opacity-100 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={editMode}
                                  />
                                </FormControl>
                                <FormLabel className='cursor-pointer hover:underline'>
                                  Enviado
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`itens.${index}.layoutApproved`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className='my-2 flex flex-col self-end '>
                              <div className='flex items-center gap-2.5 space-y-0'>
                                <FormControl>
                                  <Checkbox
                                    className='disabled:opacity-100 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={editMode}
                                  />
                                </FormControl>
                                <FormLabel className='cursor-pointer hover:underline'>
                                  Aprovado
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      {!editMode && (
                        <TableCell className='text-right'>
                          <Button
                            type='button'
                            size='icon'
                            onClick={() => remove(index)}
                            variant='destructive'
                            disabled={editMode}
                          >
                            <Icons.Trash className='h-5 w-5' />
                          </Button>
                        </TableCell>
                      )}
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator className='my-4' />
          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observações</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={editMode}
                    placeholder='Observações'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <AddProductDialog
        open={addProductDialog}
        onClose={() => setAddProductDialog(false)}
        addProduct={(product) => {
          append({
            quantity: product.minimumQuantity,
            price: 0,
            product: {
              featuredImage: product.featuredImage,
              title: product.title,
              id: product.id,
              priceQuantityTable: product.priceQuantityTable,
              sku: product.sku,
              attributes: product.attributes,
              minimumQuantity: product.minimumQuantity,
              active: product.active,
            },
          })
        }}
      />
    </Content>
  )
}
interface AttributesComboboxProps {
  attributeArray: Attribute[]
}

function isAttribute(item: any): item is Attribute {
  return (
    typeof item === 'object' &&
    'name' in item &&
    typeof item.name === 'string' &&
    'value' in item &&
    typeof item.value === 'string' &&
    (typeof item.type === 'undefined' ||
      typeof item.type === 'string' ||
      (typeof item.type === 'object' &&
        'name' in item.type &&
        'type' in item.type))
  )
}

export function AttributesCombobox({
  attributeArray,
}: AttributesComboboxProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [value, setValue] = useState<Attribute[]>([])

  const toggleAttributeSelection = (attribute: Attribute) => {
    setValue((prev) => {
      // Check if the attribute is already selected
      if (prev.some((attr) => attr.value === attribute.value)) {
        // Remove it if it's already selected
        return prev.filter((attr) => attr.value !== attribute.value)
      } else {
        // Add it if it's not selected
        return [...prev, attribute]
      }
    })
  }

  const groupedAttributes = value.reduce<Record<string, Attribute[]>>(
    (acc, attribute) => {
      const label =
        typeof attribute.type === 'string'
          ? attribute.type
          : attribute.type?.name || 'default'
      if (!acc[label]) {
        acc[label] = []
      }
      acc[label].push(attribute)
      return acc
    },
    {},
  )

  return (
    <>
      {value.length > 0 && (
        <div className=''>
          {Object.entries(groupedAttributes).map(([label, attributes]) => (
            <div key={label} className='mb-2 flex flex-row'>
              <Label className='mr-1 mt-1'>{label}:</Label>
              <div className='mt-1 flex flex-wrap gap-1'>
                {attributes.map((attribute, index) => (
                  <Label key={attribute.value}>
                    {attribute.name}
                    {index !== attributes.length - 1 && attributes.length > 1
                      ? ','
                      : ''}
                  </Label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {attributeArray.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-[200px] justify-between'
            >
              {'Selecione atributo...'}
              <Icons.ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[200px] p-0'>
            <Command>
              <CommandInput placeholder='Pesquise atributo...' />
              <CommandList>
                <CommandEmpty>Attributo não encontrado.</CommandEmpty>
                <CommandGroup>
                  {attributeArray.map((attribute) => (
                    <CommandItem
                      key={`${attribute.name}-${attribute.value}`}
                      value={attribute.value}
                      onSelect={() => {
                        toggleAttributeSelection(attribute)
                        setOpen(false)
                      }}
                    >
                      <Icons.Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.some((attr) => attr.value === attribute.value)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {attribute.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}

function AddProductDialog({
  open,
  onClose,
  addProduct,
}: {
  open: boolean
  onClose: () => void
  addProduct: (product: Product) => void
}) {
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleProductSearch = async (sku: string) => {
    try {
      const response = await fetch(`/api/search`, {
        body: JSON.stringify({
          sku,
        }),
        method: 'POST',
      })
      if (response.ok) {
        const results = await response.json()
        // console.log('results', results)
        setSearchResults(results.docs)
      } else {
        console.error('Error fetching products:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSearch = () => {
    handleProductSearch(searchTerm) // Call the search function passed as a prop
    // console.log(searchResults)
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar um novo item ao orçamento</DialogTitle>
          <DialogDescription>
            Primeiro, escolha o item que deseja adicionar.
          </DialogDescription>
        </DialogHeader>

        <div className='flex items-center justify-between'>
          <Input
            id='search'
            name='search'
            placeholder='Pesquise por SKU...'
            maxLength={64}
            type='text'
            className='w-auto grow focus-visible:ring-0'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
          />
          <Button
            type='button'
            size='icon'
            className='bg-background text-primary hover:bg-background'
            onClick={handleSearch}
          >
            <Icons.Search className='h-5 w-5' />
          </Button>
        </div>
        <div className='rounded-lg border p-2'>
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <div
                key={index}
                className='flex h-full items-center gap-2 self-center'
              >
                {typeof result.featuredImage === 'object' ? (
                  <Image
                    src={result.featuredImage.url}
                    alt={result.title}
                    className='h-24 w-24 rounded-md border'
                    width={96}
                    height={96}
                  />
                ) : (
                  <div className='flex h-24 w-24 items-center justify-center rounded-md bg-neutral-200'>
                    <Icons.Shirt className='m-4 h-16 w-16 text-neutral-400' />
                  </div>
                )}
                <div className='flex flex-col justify-center'>
                  <Heading variant='h6'> {result.title}</Heading>
                  <Label>{result.sku}</Label>
                  <P className='text-sm [&:not(:first-child)]:mt-2'>
                    {result.description}
                  </P>
                </div>
              </div>
            ))
          ) : (
            <div className='flex h-full items-center gap-2 self-center'>
              <div className='flex h-24 w-24 items-center justify-center rounded-md bg-neutral-200'>
                <Icons.Shirt className='m-4 h-16 w-16 text-neutral-400' />
              </div>
              <div className='flex flex-col justify-center'>
                <Heading variant='h6'>Título</Heading>
                <Label>código</Label>
                <P className='text-sm [&:not(:first-child)]:mt-2'>
                  Descricão do item. Lorem ipsum dolor sit amet.
                </P>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' size='default' asChild>
            <DialogClose>Fechar</DialogClose>
          </Button>
          <Button
            variant='default'
            size='default'
            onClick={() => {
              addProduct(searchResults[0])
              setSearchResults([])

              onClose()
            }}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
