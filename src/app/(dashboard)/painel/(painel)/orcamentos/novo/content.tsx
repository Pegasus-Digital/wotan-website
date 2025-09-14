'use client'

import Image from 'next/image'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import {
  Attribute,
  Client,
  Product,
  Salesperson,
} from '@/payload/payload-types'

import {
  formatBRL,
  parseValue,
  formatPhoneNumber,
  formatBRLWithoutPrefix,
} from '@/lib/format'
import { toast } from 'sonner'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useFormState } from 'react-hook-form'

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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { TooltipArrow } from '@radix-ui/react-tooltip'

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
  TableCell,
  TableBody,
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
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import { createBudget } from '../_logic/actions'
import { budgetSchema } from '../_logic/validation'
import { AttributesCombobox } from '../../pedidos/_components/attributes-selector'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { LoadingSpinner } from '@/components/spinner'
import Link from 'next/link'
import { filterClients } from '@/lib/utils'

type BudgetProps = z.infer<typeof budgetSchema>

interface SeeBudgetContentProps {
  salespeople: Salesperson[]
  clients: Client[]
}

export function NewBudgetContent({
  salespeople,
  clients,
}: SeeBudgetContentProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [addProductDialog, setAddProductDialog] = useState<boolean>(false)

  const router = useRouter()

  const [search, setSearch] = useState('')

  // Filter clients dynamically when the search input changes
  const filteredClients = useMemo(() => {
    return filterClients(clients, search)
  }, [clients, search])

  const form = useForm<BudgetProps>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      conditions:
        'Pagamento: 28 dias\nEntrega: 12 dias\nFrete:\nValidade da proposta: 10 dias\nPRODUTOS SUJEITOS Á DISPONIBILIDADE DE ESTOQUE',
      contact: {
        companyName: '',
        customerName: '',
        details: '',
        email: '',
        phone: '',
      },
    },
  })

  const { control, handleSubmit, watch } = form
  const { fields, append, remove, insert, update } = useFieldArray({
    control,
    name: 'items',
  })

  // console.log(fields)

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: BudgetProps) {
    const { contact, items, salesperson } = values

    if (items.length === 0) {
      return toast.error('Não é possível criar um orçamento sem produtos.')
    }

    const response = await createBudget({
      ...values,
      salesperson: salesperson,
      contact: {
        companyName: contact.companyName,
        customerName: contact.customerName,
        email: contact.email,
        phone: contact.phone,
        details: contact.details,
      },
      client: values.client ? values.client : null,
      selectedContact: values.selectedContact,
      items: items.map((item) => ({
        ...item,

        product:
          typeof item.product === 'string' ? item.product : item.product.id,
        quantity: item.quantity,
        price: Number(item.price),
        description: item.description,
        print: item.print,
      })),
      origin: 'interno',
    })

    if (response.status === true) {
      toast.success(response.message)

      router.push(`/painel/orcamentos/${response.data.budget.incrementalId}`)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  const name = watch('contact.companyName')
  form.watch('items')

  function getPriceForQuantity(productId: string, quantity: number) {
    const product = fields.find(
      (item) => (item.product as Product).id === productId,
    ).product as Product

    const table = product.priceQuantityTable

    if (!table) {
      return { quantity: 0, unitPrice: 0 }
    }

    table.sort((a, b) => {
      if (a.quantity > b.quantity) return -1
      if (a.quantity === b.quantity) return 0
      if (a.quantity < b.quantity) return 1
    })

    const firstLowestQuantityIndex = table.findIndex(
      (entry) => entry.quantity <= quantity,
    )

    // If product doesn't have a table, flag it.
    if (firstLowestQuantityIndex === -1) {
      return { quantity: -1, unitPrice: -1 }
    }

    const item = table[firstLowestQuantityIndex]

    return {
      quantity: item && item.quantity ? item.quantity : product.minimumQuantity,
      unitPrice: item && item.unitPrice / 100,
    }
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

  interface PriceQuantityTooltipContentProps {
    productId: string
    quantity: number
  }

  function PriceQuantityTooltipContent({
    productId,
    quantity,
  }: PriceQuantityTooltipContentProps) {
    const { quantity: nearestLowerQuantity, unitPrice } = getPriceForQuantity(
      productId,
      quantity,
    )

    return (
      <TooltipContent side='top' sideOffset={12} className='text-justify'>
        <TooltipArrow />
        {nearestLowerQuantity === -1 ? (
          <span className='font-medium'>
            Este produto não possui uma
            <br />
            tabela de sugestão de preços.
          </span>
        ) : (
          <span className='text-justify font-medium'>
            O preço sugerido a partir de <br />
            {nearestLowerQuantity} unidades é de: {formatBRL(unitPrice)}
          </span>
        )}
      </TooltipContent>
    )
  }

  return (
    // <Content>
    //   <ContentHeader
    //     title={`Novo orçamento`}
    //     description={`O número do orçamento será gerado automaticamente.`}
    //   />
    //   <Separator className='mb-4' />
    <ContentLayout
      title='Novo orçamento'
      navbarButtons={
        <Button
          type='submit'
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          variant='default'
          size='sm'
        >
          <Icons.Save className='mr-2 h-5 w-5' /> Salvar
        </Button>
      }
    >
      <Form {...form}>
        {/* {
          <div className='sticky top-0 z-50 flex  items-center justify-between border-b bg-background px-4 pb-6 pt-8 '>
            <Heading variant='h5'>{name || 'Novo orçamento'}</Heading>
            <Button
              type='submit'
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              variant='default'
            >
              <Icons.Save className='mr-2 h-5 w-5' /> Salvar
            </Button>
          </div>
        } */}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          {/* <Card className=''>
            <CardHeader className=''> */}
          <Heading variant='h6' className='text-black'>
            Cliente
          </Heading>
          {/* </CardHeader>
            <CardContent className=''> */}
          <div className='grid grid-cols-[1fr_auto_1fr]  items-center gap-x-6 gap-y-2 px-3'>
            <div className='grid gap-1'>
              <FormField
                control={form.control}
                name='contact.companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input {...field} className='disabled:opacity-100' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contact.customerName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} className='disabled:opacity-100' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contact.email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} className='disabled:opacity-100' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='contact.phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={15}
                        onChange={(e) => {
                          const { value } = e.target
                          e.target.value = formatPhoneNumber(value)
                          field.onChange(e)
                        }}
                        className='disabled:opacity-100'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='relative flex h-full flex-col items-center justify-center gap-2'>
              <div className='absolute left-1/2 z-10 h-full w-[1px] -translate-x-1/2 transform bg-primary/50 line-through' />
              <Label className='z-20 rounded-full bg-primary-foreground p-2'>
                ou
              </Label>
            </div>
            <div className='grid gap-1'>
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
                          form.setValue('contact.companyName', client?.name)
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

                            {filteredClients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name} - <b>{client.document}</b>
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
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Filtrar clientes ...'
                className='bottom-0 mt-auto'
              />

              <FormField
                control={form.control}
                name='selectedContact'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contato</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          const selectedContact = selectedClient?.contacts.find(
                            (contact) => contact.id === value,
                          )
                          form.setValue(
                            'contact.customerName',
                            selectedContact?.name,
                          )
                          form.setValue('contact.email', selectedContact?.email)
                          form.setValue('contact.phone', selectedContact?.phone)
                        }}
                      >
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
            </div>

            <div className='col-span-3'>
              <FormField
                control={form.control}
                name='contact.details'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className='min-h-24 disabled:cursor-text disabled:opacity-100'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* </CardContent>
          </Card> */}
          <Separator className='my-2' />

          <div className='grid grid-cols-2 items-center gap-2 py-2'>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='comissioned'
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
                      Comissionado
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='conditions'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condições</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    // value={budget.conditions}
                    className='min-h-32 disabled:cursor-text disabled:opacity-100'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator className='my-2' />

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
              <Icons.Add className=' h-5 w-5' />
            </Button>
          </div>
          <Table>
            <TableHeader className='w-full'>
              <TableRow className='w-full'>
                <TableHead className='w-32'></TableHead>
                <TableHead className='w-24'>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className='w-48'>Quantidade</TableHead>
                <TableHead className='w-48'>Valor Unitário</TableHead>
                <TableHead className=''>Atributos</TableHead>
                <TableHead className=''>Impressão</TableHead>

                <TableHead className='text-end'>Interações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((item, index) => (
                <TableRow key={item.id}>
                  {typeof item.product === 'object' && (
                    <>
                      <TableCell>
                        <Image
                          src={
                            typeof item.product.featuredImage === 'object'
                              ? item.product.featuredImage.url
                              : ''
                          }
                          alt={item.product.title}
                          className='h-24 w-24 rounded-md object-cover'
                          width={96}
                          height={96}
                        />
                      </TableCell>
                      <TableCell>{item.product.sku}</TableCell>
                      <TableCell>
                        <FormField
                          name={`items.${index}.description`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className='col-span-2'>
                              <FormControl>
                                <Textarea
                                  maxLength={300}
                                  {...field}
                                  className='disabled:opacity-100'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className='font-medium'>
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
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
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger type='button'>
                                      <div className='flex items-center gap-2 font-medium'>
                                        <Label>R$</Label>

                                        <Input
                                          {...field}
                                          // value={formatValue(field.value)}
                                          value={formatBRLWithoutPrefix(
                                            Number(field.value),
                                          )}
                                          onChange={(e) => {
                                            field.onChange(
                                              parseValue(e.target.value),
                                            )
                                          }}
                                          inputMode='numeric'
                                          placeholder='0,00'
                                          className='disabled:opacity-100'
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <PriceQuantityTooltipContent
                                      productId={(item.product as Product).id}
                                      quantity={
                                        form.getValues('items')[index].quantity
                                      }
                                    />
                                  </Tooltip>
                                </TooltipProvider>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        {item.product.attributes ? (
                          <AttributesCombobox
                            attributeArray={item.product.attributes.filter(
                              isAttribute,
                            )}
                            selectedAttributes={
                              item.attributes ? item.attributes : []
                            }
                            onUpdate={(attributes) => {
                              const currentValues = form.getValues(
                                `items.${index}`,
                              )
                              update(index, {
                                ...currentValues,
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
                          name={`items.${index}.print`}
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

                      <TableCell className='text-right'>
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            type='button'
                            size='icon'
                            onClick={() =>
                              insert(index + 1, {
                                ...item,
                              })
                            }
                            variant='outline'
                          >
                            <Icons.Copy className='h-5 w-5' />
                          </Button>
                          <Button
                            type='button'
                            size='icon'
                            onClick={() => {
                              if (fields.length === 1) {
                                return toast.error(
                                  'Não foi possível remover o produto. Um orçamento deve conter pelo menos um item.',
                                )
                              }
                              remove(index)
                            }}
                            variant='destructive'
                          >
                            <Icons.Trash className='h-5 w-5' />
                          </Button>
                        </div>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </form>
      </Form>
      <AddProductDialog
        open={addProductDialog}
        onClose={() => setAddProductDialog(false)}
        addProduct={(product) => {
          insert(0, {
            quantity: product.minimumQuantity,
            description: product.description,
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
    </ContentLayout>
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
  const [notFound, setNotFound] = useState(false)
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
        setNotFound(results.docs.length === 0)
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
    setNotFound(false)

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
                  <Button variant='outline' className='w-full'>
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
                <Heading variant='h6'>
                  {notFound ? 'Nenhum item encontrado' : 'Título'}
                </Heading>
                <Label>{notFound && 'código'}</Label>
                <P className='text-sm [&:not(:first-child)]:mt-2'>
                  {notFound
                    ? 'Nenhum item encontrado. Tente outro termo ou query.'
                    : 'Descricão do item. Lorem ipsum dolor sit amet.'}
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
