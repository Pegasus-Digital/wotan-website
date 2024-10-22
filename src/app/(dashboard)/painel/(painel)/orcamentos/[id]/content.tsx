'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Attribute,
  Budget,
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
import { ptBR } from 'date-fns/locale'
import { formatRelative } from 'date-fns'

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
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '@/components/ui/table'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectLabel,
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

import { UpdateBudget } from '../_logic/actions'
import { budgetSchema } from '../_logic/validation'
import { AttributesCombobox } from '../../pedidos/_components/attributes-selector'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

type BudgetProps = z.infer<typeof budgetSchema>

interface SeeBudgetContentProps {
  budget: Budget
  edit: boolean
  salespeople: Salesperson[]
  clients: Client[]
}

export function SeeBudgetContent({
  budget,
  edit,
  salespeople,
  clients,
}: SeeBudgetContentProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [addProductDialog, setAddProductDialog] = useState<boolean>(false)

  const router = useRouter()

  const [editMode, toggleEditMode] = useState<boolean>(!edit)

  const form = useForm<BudgetProps>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      incrementalId: budget.incrementalId,
      salesperson:
        budget.salesperson &&
        (typeof budget.salesperson === 'string'
          ? budget.salesperson
          : budget.salesperson.id),
      origin: budget.origin,
      status: budget.status,
      conditions: budget.conditions,
      contact: {
        companyName: budget.contact.companyName,
        customerName: budget.contact.customerName,
        email: budget.contact.email,
        phone: budget.contact.phone,
        details: budget.contact.details,
      },
      comissioned: budget.comissioned,
      items: budget.items.map((item) => ({
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
                priceQuantityTable: item.product.priceQuantityTable,
                attributes: item.product.attributes,
              },
        attributes:
          item?.attributes?.map((attribute) =>
            typeof attribute === 'string' ? attribute : attribute.id,
          ) ?? [],

        description: item.description ? item.description : '',
        quantity: item.quantity,
        price: item.price,
        print: item.print,
      })),
    },
  })

  const { control, handleSubmit, watch } = form
  const { fields, append, remove, insert, update } = useFieldArray({
    control,
    name: 'items',
  })

  const { isSubmitting } = useFormState({ control: form.control })

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

  function getSalespersonName(salespersonId: string): string {
    // If we're not in edit mode, salesperson name needs to come from budget.salesperson.name
    if (editMode) {
      const salesperson = budget.salesperson as Salesperson
      return salesperson.name
    }

    return (
      salespeople.find((person) => person.id === salespersonId).name ??
      'Não encontrado'
    )
  }

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

  form.watch('items')

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

  async function onSubmit(values: BudgetProps) {
    const response = await UpdateBudget({
      budget: {
        ...values,

        contact: {
          // ...values.contact,
          companyName: values.contact.companyName
            ? values.contact.companyName
            : null,
          customerName: values.contact.customerName
            ? values.contact.customerName
            : null,
          email: values.contact.email ? values.contact.email : null,
          phone: values.contact.phone ? values.contact.phone : null,
          details: values.contact.details ? values.contact.details : null,
        },
        items: values.items.map((item) => ({
          // ...item,
          product:
            typeof item.product === 'string' ? item.product : item.product.id,
          // attributes: item.attributes,
          description: item.description ? item.description : '',
          quantity: item.quantity,
          price: item.price ? Number(item.price) : null,
          print: item.print,
          attributes: item.attributes,
        })),
      },
      id: budget.id,
    })

    if (response.status === true) {
      toast.success('Orcamento atualizado com sucesso')
      router.push('/painel/orcamentos')
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  return (
    // <Content>
    //   <ContentHeader
    //     title={`${edit ? 'Editar o' : 'O'}rçamento #${budget.incrementalId}`}
    //     description={`Criado em ${formatRelative(budget.createdAt, new Date(), { locale: ptBR })}`}
    //   />
    //   <Separator className='mb-4' />
    <ContentLayout
      title={`${edit ? 'Editar o' : 'O'}rçamento #${budget.incrementalId}`}
    >
      <Form {...form}>
        {!editMode && (
          <div className='sticky top-0 z-30 flex  items-center justify-between border-b bg-background px-4 pb-6 pt-8 '>
            <Heading variant='h5'>
              {budget.contact.companyName || 'Novo orçamento'}
            </Heading>
            <Button
              type='submit'
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              variant='default'
            >
              <Icons.Save className='mr-2 h-5 w-5' /> Salvar
            </Button>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 px-2 pt-4'>
          <Card className=''>
            <CardHeader className=''>
              <Heading variant='h6' className='text-black'>
                Cliente
              </Heading>
            </CardHeader>
            <CardContent className=''>
              <div className='grid grid-cols-[1fr_auto_1fr]  items-center gap-x-6 gap-y-2 px-3'>
                <div className='grid gap-1'>
                  <FormField
                    control={form.control}
                    name='contact.companyName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Empresa</FormLabel>
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
                    name='contact.customerName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
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
                    name='contact.email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
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
                    name='contact.phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            minLength={14}
                            maxLength={15}
                            onChange={(e) => {
                              const { value } = e.target
                              e.target.value = formatPhoneNumber(value)
                              field.onChange(e)
                            }}
                            disabled={editMode}
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
                  <Label className='z-20 bg-background p-2'>ou</Label>
                </div>

                <div className='grid gap-1'>
                  <div className='space-y-1'>
                    <Label>Cliente</Label>

                    <Select
                      onValueChange={(e) => {
                        console.log('detectei mudança', e)
                      }}
                      disabled={editMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um Cliente' />
                      </SelectTrigger>
                      {!editMode && (
                        <SelectContent side='bottom'>
                          {typeof clients === 'object' &&
                          clients.length === 0 ? (
                            <SelectItem value='nenhum' disabled>
                              Você ainda não possui nenhum cliente.
                            </SelectItem>
                          ) : (
                            clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      )}
                    </Select>
                  </div>
                  <div className='space-y-1'>
                    <Label>Contato</Label>

                    <Select disabled={editMode}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um Contato' />
                      </SelectTrigger>
                      <SelectContent side='bottom'>
                        {selectedClient === null ? (
                          <SelectItem value='nenhum' disabled>
                            Por favor, selecione um cliente primeiro.
                          </SelectItem>
                        ) : (
                          //
                          <SelectItem value='contact1'>Contato 1</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
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
                            disabled={editMode}
                            className='min-h-24 disabled:cursor-text disabled:opacity-100'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Separator className='my-2' />

          <div className='grid grid-cols-2 items-center gap-2 py-2'>
            <FormField
              control={form.control}
              name='salesperson'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor</FormLabel>

                  <Select onValueChange={field.onChange} disabled={editMode}>
                    <SelectTrigger className='disabled:opacity-100'>
                      {typeof budget.salesperson === 'object' ? (
                        <div className='flex items-center space-x-2'>
                          {budget.salesperson.avatar &&
                          typeof budget.salesperson.avatar === 'object' &&
                          budget.salesperson.avatar.url ? (
                            <Image
                              width={20}
                              height={20}
                              src={budget.salesperson.avatar.url}
                              alt={budget.salesperson.name}
                              className='select-none rounded-full'
                            />
                          ) : (
                            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-muted p-1'>
                              <Icons.User className='h-3 w-3 text-muted-foreground' />
                            </div>
                          )}

                          <p className='font-semibold'>
                            {getSalespersonName(field.value)}
                          </p>
                        </div>
                      ) : (
                        <SelectValue placeholder='Selecione um Vendedor' />
                      )}
                    </SelectTrigger>
                    <SelectContent side='bottom'>
                      <SelectGroup>
                        <SelectLabel>Vendedor Interno</SelectLabel>
                        {salespeople &&
                          typeof salespeople === 'object' &&
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
                        disabled={editMode}
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
                    disabled={editMode}
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
              disabled={editMode}
              size='icon'
              onClick={() => setAddProductDialog(true)}
            >
              <Icons.Add className='h-5 w-5' />
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
                {!editMode && (
                  <TableHead className='text-end'>Interações</TableHead>
                )}
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
                                  disabled={editMode}
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
                                  disabled={editMode}
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
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <TooltipProvider>
                                  <Tooltip delayDuration={100}>
                                    <TooltipTrigger type='button'>
                                      <div className='flex items-center gap-2 font-medium'>
                                        <Label>R$</Label>

                                        <Input
                                          {...field}
                                          disabled={editMode}
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
                        {!editMode &&
                        typeof item.product.attributes === 'object' ? (
                          <AttributesCombobox
                            attributeArray={item.product.attributes.filter(
                              isAttribute,
                            )}
                            selectedAttributes={
                              item.attributes ? item.attributes : []
                            }
                            onUpdate={(attributes) => {
                              // if (!attributes || attributes.length === 0) {
                              //   return
                              // }
                              update(index, {
                                ...item,
                                attributes: attributes.map(
                                  (attribute) => attribute.id,
                                ),
                              })
                            }}
                          />
                        ) : (
                          <div className='flex flex-col gap-1'>
                            {typeof item.product === 'object' &&
                              typeof item.product.attributes === 'object' &&
                              item.product.attributes.filter(isAttribute).map(
                                (attribute) =>
                                  item.attributes.includes(attribute.id) && (
                                    <Label key={attribute.id}>
                                      {typeof attribute.type === 'object' &&
                                        attribute.type.name + ': '}
                                      {attribute.name}
                                    </Label>
                                  ),
                              )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <FormField
                          name={`items.${index}.print`}
                          control={form.control}
                          render={({ field }) => (
                            <FormControl>
                              <Select
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                                disabled={editMode}
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
                                  <SelectItem value='UV'>UV</SelectItem>
                                  <SelectItem value='DTF'>DTF</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                          )}
                        />
                      </TableCell>

                      {!editMode && (
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
                              disabled={editMode}
                            >
                              <Icons.Trash className='h-5 w-5' />
                            </Button>
                          </div>
                        </TableCell>
                      )}
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
              setSearchResults([])
              onClose()
              addProduct(searchResults[0])
            }}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
