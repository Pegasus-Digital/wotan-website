'use client'

import Image from 'next/image'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import {
  Client,
  Product,
  Attribute,
  Salesperson,
} from '@/payload/payload-types'

import { toast } from 'sonner'
import { parseValue } from '@/lib/format'
import { BRAZIL_STATES } from '@/lib/brazil-states'

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
  Select,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectSeparator,
} from '@/components/ui/select'

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import { createOrder } from '../_logic/actions'
import { orderSchema } from '../_logic/validation'

import { AttributesCombobox } from '../_components/attributes-selector'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { LoadingSpinner } from '@/components/spinner'
import Link from 'next/link'

type OrderProps = z.infer<typeof orderSchema>

interface NewOrderContentProps {
  salespeople: Salesperson[]
  clients: Client[]
}

export function NewOrderContent({
  clients,
  salespeople,
}: NewOrderContentProps) {
  const router = useRouter()

  const [addProductDialog, setAddProductDialog] = useState<boolean>(false)

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const form = useForm<OrderProps>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client: '',
      contact: '',
      salesperson: '',
      commission: 0,

      paymentConditions: '',
      shippingCompany: '',
      shippingTime: '',
      adress: {
        zipCode: '',
        city: '',
        neighborhood: '',
        number: '',
        street: '',
        state: undefined,
      },
    },
  })

  const { control, handleSubmit } = form

  const { fields, append, remove, update, insert } = useFieldArray({
    control,
    name: 'itens',
  })

  const formatValue = (value: number) => {
    const integerPart = Math.floor(value / 100).toString()
    const decimalPart = (value % 100).toString().padStart(2, '0')
    return `${integerPart},${decimalPart}`
  }

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: OrderProps) {
    // Se um pedido for submetido sem nenhum item, é barrado.
    if (values.itens.length === 0) {
      return toast.error('Não é possível criar um pedido sem produtos.')
    }
    if (
      !values.client ||
      values.client === '' ||
      !values.contact ||
      values.contact === ''
    ) {
      return toast.error('É necessário selecionar um cliente e um contato.')
    }

    const response = await createOrder({
      order: {
        ...values,

        client: values.client ?? '',
        contact: values.contact ?? '',
        salesperson: values.salesperson ?? '',
        adress: {
          ...values.adress,
          cep: values.adress.zipCode,
        },

        itens: values.itens.map((item) => ({
          ...item,

          product:
            typeof item.product === 'string' ? item.product : item.product.id,
          quantity: item.quantity,
          price: item.price,
          layout: null,
          print: item.print,
          sample: item.sample,
          layoutSent: item.layoutSent,
          layoutApproved: item.layoutApproved,
        })),
      },
    })

    if (response.status === true) {
      toast.success(response.message)
      router.push('/painel/pedidos')
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  const [state, setState] = useState<string>('')
  const [addressRadio, setAddressRadio] = useState<
    'same' | 'alternate' | undefined
  >(undefined)

  function handleSameAddress() {
    const { cep, city, neighborhood, number, state, street } =
      selectedClient.adress

    form.setValue('adress', {
      street: street ?? '',
      number: number ?? '',
      neighborhood: neighborhood ?? '',
      city: city ?? '',
      zipCode: cep ?? '',
    })

    setState(state)
  }

  function resetContactForm() {
    form.setValue('contact', '')
  }

  function resetAddressForm() {
    form.resetField('adress')
    setState('')
  }

  return (
    // <Content>
    //   <ContentHeader
    //     title={`Novo pedido`}
    //     description={`Crie um novo pedido preenchendo as informações abaixo.`}
    //   />
    //   <Separator className='mb-4' />
    <ContentLayout
      title='Novo pedido'
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
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 px-2 pt-4'>
          <Card>
            <CardHeader>
              <Heading variant='h6' className='text-black'>
                Cliente e Contato
              </Heading>
            </CardHeader>
            <CardContent className='grid grid-cols-2 gap-6'>
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
                          const client = clients.find(
                            (client) => client.id === value,
                          )
                          setSelectedClient(client)
                          resetAddressForm()
                          resetContactForm()
                          setAddressRadio(null)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um Cliente' />
                        </SelectTrigger>
                        {
                          <SelectContent side='bottom'>
                            {!clients ||
                              (clients.length === 0 && (
                                <SelectItem
                                  value={null}
                                  disabled
                                  className='flex items-center justify-center'
                                >
                                  Você ainda não possui nenhum cliente.
                                </SelectItem>
                              ))}

                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        }
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
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder='Selecione um Contato' />
                        </SelectTrigger>
                        <SelectContent>
                          {!selectedClient && (
                            <SelectItem
                              value={null}
                              disabled
                              className='flex items-center justify-center'
                            >
                              Selecione um cliente para ver seus contatos
                            </SelectItem>
                          )}
                          {selectedClient?.contacts?.length === 0 && (
                            <SelectItem value={null} disabled>
                              Não encontramos nenhum contato para este cliente.
                            </SelectItem>
                          )}
                          {selectedClient &&
                            selectedClient?.contacts.length > 0 &&
                            selectedClient.contacts.map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.name}
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
                name='salesperson'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendedor</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className='disabled:opacity-100'>
                        <SelectValue placeholder='Selecione um Vendedor' />
                      </SelectTrigger>

                      <SelectContent side='bottom'>
                        <SelectGroup>
                          <SelectLabel>Vendedor Interno</SelectLabel>
                          {salespeople.map((person) => {
                            if (person.roles === 'internal') {
                              return (
                                <SelectItem key={person.id} value={person.id}>
                                  {person.name}
                                </SelectItem>
                              )
                            }
                          })}
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
                      <Input {...field} className='disabled:opacity-100' />
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
                      <Input {...field} className='disabled:opacity-100' />
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
                      <Input {...field} className='disabled:opacity-100' />
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
                      <Select onValueChange={field.onChange}>
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
                      <Select onValueChange={field.onChange}>
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
            </CardContent>
          </Card>
          <Separator className='my-4' />
          <Card>
            <CardHeader className='flex flex-row justify-between'>
              <Heading variant='h6' className='text-black'>
                Endereço de entrega
              </Heading>
              <RadioGroup
                defaultValue={undefined}
                className='mr-6 flex flex-row gap-2'
                value={addressRadio}
                disabled={!selectedClient}
                onValueChange={(value) => {
                  if (value === 'same') {
                    setAddressRadio('same')
                    handleSameAddress()
                    return
                  }

                  if (value === 'alternate') {
                    setAddressRadio('alternate')
                    resetAddressForm()
                    return
                  }
                }}
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value='same'
                    checked={addressRadio === 'same'}
                    id='r1'
                  />
                  <Label htmlFor='r1'>Mesmo endereço</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value='alternate'
                    checked={addressRadio === 'alternate'}
                    id='r2'
                  />
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
                          value={state}
                          onValueChange={(newState) => {
                            setState(newState)
                            field.onChange(newState)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione o estado' />
                          </SelectTrigger>
                          <SelectContent>
                            {BRAZIL_STATES.map((state) => (
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
                      <Input {...field} />
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
              size='icon'
              onClick={() => setAddProductDialog(true)}
            >
              <Icons.Add className='h-5 w-5' />
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

                {<TableHead className='text-end'>Interações</TableHead>}
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
                                  placeholder='A partir de X produtos'
                                  className='disabled:opacity-100'
                                  type='number'
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
                        {field.product.attributes ? (
                          <AttributesCombobox
                            attributeArray={field.product.attributes.filter(
                              isAttribute,
                            )}
                            selectedAttributes={
                              field.attributes ? field.attributes : []
                            }
                            onUpdate={(attributes) => {
                              // if (!attributes || attributes.length === 0) return
                              update(index, {
                                ...field,
                                attributes: attributes.map(
                                  (attribute) => attribute.id,
                                ),
                              })
                            }}
                          />
                        ) : (
                          <Label>Nenhum</Label>
                        )}
                      </TableCell>

                      <TableCell>
                        <FormField
                          name={`itens.${index}.print`}
                          control={form.control}
                          render={({ field }) => (
                            <FormControl>
                              <Select onValueChange={field.onChange}>
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
                                  <SelectItem value='UV'>UV</SelectItem>
                                  <SelectItem value='DTF'>DTF</SelectItem>
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
                                  />
                                </FormControl>
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
                      {
                        <TableCell className='text-right'>
                          <Button
                            type='button'
                            size='icon'
                            onClick={() => {
                              remove(index)
                              toast.warning(
                                'Produto foi removido do pedido com sucesso.',
                              )
                            }}
                            variant='destructive'
                          >
                            <Icons.Trash className='h-5 w-5' />
                          </Button>
                        </TableCell>
                      }
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
                  <Textarea {...field} placeholder='Observações' />
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
          insert(0, {
            quantity: product.minimumQuantity,
            price: 0,
            product: {
              id: product.id,
              sku: product.sku,
              title: product.title,
              active: product.active,
              minimumQuantity: product.minimumQuantity,
              priceQuantityTable: product.priceQuantityTable,
              featuredImage: product.featuredImage,
              attributes: product.attributes,
            },
          })
        }}
      />
    </ContentLayout>
  )
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isPending, startTransition] = useTransition()
  const [delayedPending, setDelayedPending] = useState(false)

  const handleProductSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search`, {
        body: JSON.stringify({
          query,
        }),
        method: 'POST',
      })
      if (response.ok) {
        const results = await response.json()
        setSearchResults(results.docs)
      } else {
        console.error('Error fetching products:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSearch = () => {
    setSelectedProduct(null)
    setDelayedPending(true) // Start the visual loading effect

    startTransition(() => {
      handleProductSearch(searchTerm).finally(() => {
        // Simulate delay to ensure a smoother transition
        setTimeout(() => {
          setDelayedPending(false)
        }, 300) // Adjust the delay duration as needed
      })
    })
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
            placeholder='Pesquise'
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
        <div className='flex flex-col gap-1'>
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => {
              return index < 3 ? (
                <div
                  key={index}
                  className='flex h-28 w-full items-center gap-2 self-center rounded-lg border p-2'
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
                  <div className='flex w-full flex-col justify-center'>
                    <div className='flex items-center justify-between gap-2'>
                      <div className='flex flex-col justify-center'>
                        <Heading variant='h6'> {result.title}</Heading>
                        <Label>{result.sku}</Label>
                      </div>
                      <div>
                        <Checkbox
                          checked={selectedProduct?.id === result.id}
                          onCheckedChange={() => {
                            setSelectedProduct(result)
                          }}
                        />
                      </div>
                    </div>
                    <P className='h-12 overflow-hidden text-sm [&:not(:first-child)]:mt-2'>
                      {result.description}
                    </P>
                  </div>
                </div>
              ) : (
                index === 3 && (
                  <Button variant='outline' className='w-full' disabled>
                    <Link
                      href={`/painel/catalogo/busca-avancada?query=${encodeURIComponent(searchTerm)}`}
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      Ver outros {searchResults.length - 3}+ itens encontrados
                    </Link>
                  </Button>
                )
              )
            })
          ) : (
            <div
              className={` relative flex h-full w-full items-center gap-2 self-center  rounded-lg border p-2 ${delayedPending && 'opacity-50'}`}
            >
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
              {delayedPending && (
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                  <LoadingSpinner />
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            size='default'
            asChild
            onClick={() => {
              setSearchResults([])
              onClose()
            }}
          >
            <DialogClose>Fechar</DialogClose>
          </Button>
          <Button
            disabled={!selectedProduct}
            variant='default'
            size='default'
            onClick={() => {
              setSearchResults([])
              onClose()

              addProduct(selectedProduct)
            }}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
