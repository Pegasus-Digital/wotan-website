'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Client, Product, Salesperson } from '@/payload/payload-types'

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

  const form = useForm<BudgetProps>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  // console.log(fields)

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: BudgetProps) {
    const { contact, items, salesperson } = values

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
      items: items.map((item) => ({
        product:
          typeof item.product === 'string' ? item.product : item.product.id,
        description: item.description,
        quantity: item.quantity,
        price: Number(item.price),
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
    <Content>
      <ContentHeader
        title={`Novo orçamento`}
        description={`O número do orçamento será gerado automaticamente.`}
      />
      <Separator className='mb-4' />
      <Form {...form}>
        {
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
        }
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
                  <Label className='z-20 bg-background p-2'>ou</Label>
                </div>

                <div className='grid gap-1'>
                  <div className='space-y-1'>
                    <Label>Cliente</Label>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um Cliente' />
                      </SelectTrigger>

                      <SelectContent side='bottom'>
                        {typeof clients === 'object' && clients.length === 0 ? (
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
                    </Select>
                  </div>
                  <div className='space-y-1'>
                    <Label>Contato</Label>

                    <Select>
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

                      <TableCell className='text-right'>
                        <Button
                          type='button'
                          size='icon'
                          onClick={() => remove(index)}
                          variant='destructive'
                        >
                          <Icons.Trash className='h-5 w-5' />
                        </Button>
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
          append({
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
    </Content>
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
