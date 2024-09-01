'use client'

import { P, Small } from '@/components/typography/texts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Attribute,
  Budget,
  Client,
  Product,
  Salesperson,
} from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'
import { formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Content, ContentHeader } from '@/components/content'
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
import { Checkbox } from '@/components/ui/checkbox'
import { getClients, getProducts, getSalespeople } from '../_logic/queries'
import Image from 'next/image'
import {
  PlusCircle,
  Save,
  Search,
  Shirt,
  Trash2,
  UserRound,
} from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/pegasus/button'
import { useFieldArray, useForm, useFormState } from 'react-hook-form'
import { budgetSchema } from '../_logic/validation'
import { Dialog } from '@radix-ui/react-dialog'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import update from 'payload/dist/collections/operations/update'

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

  const [editMode, toggleEditMode] = useState<boolean>(!edit)

  const form = useForm<BudgetProps>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      incrementalId: budget.incrementalId,
      salesperson:
        typeof budget.salesperson === 'string'
          ? budget.salesperson
          : budget.salesperson.id,
      origin: budget.origin,
      status: budget.status,
      conditions: budget.conditions,
      contact: {
        companyName: budget.contact.companyName,
        customerName: budget.contact.customerName,
        email: budget.contact.email,
        phone: budget.contact.phone,
      },
    },
  })

  const { control, handleSubmit, watch } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: BudgetProps) {
    console.log('foi carai', values)
  }

  // console.log(budget)

  return (
    <Content>
      <ContentHeader
        title={`${edit ? 'Editar o' : 'O'}rçamento #${budget.incrementalId}`}
        description={`Criado em ${formatRelative(budget.createdAt, new Date(), { locale: ptBR })}`}
      />
      <Separator className='mb-4' />
      <Form {...form}>
        {!editMode && (
          <div className='sticky top-0 z-10 flex  items-center justify-between border-b bg-background px-4 pb-6 pt-8 '>
            <Heading variant='h5'>
              {budget.contact.companyName || 'Novo orçamento'}
            </Heading>
            <Button
              type='submit'
              // disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              variant='default'
            >
              <Save className='mr-2 h-4 w-4' /> Salvar
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
                          <Input {...field} disabled={editMode} />
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
                          <Input {...field} disabled={editMode} />
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
                          <Input {...field} disabled={editMode} />
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
                          <Input {...field} disabled={editMode} />
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

                    <Select disabled={editMode}>
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
                    name='contact.companyName'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={editMode}
                            value={budget.contact.details}
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      // setSalespersonId(value)
                    }}
                    disabled={editMode}
                    value={field.value}
                  >
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
                              alt={budget.salesperson.name} // Use name for the alt attribute for better accessibility
                              className='select-none rounded-full'
                            />
                          ) : (
                            <div className='flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 p-1'>
                              <UserRound className='h-3 w-3 text-gray-600' />
                            </div>
                          )}

                          <p className='font-semibold'>
                            {budget.salesperson.name}
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
                                <SelectItem key={person.id} value={person.name}>
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
                                <SelectItem key={person.id} value='salesperson'>
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
              name='comissioned'
              control={form.control}
              render={({ field }) => (
                <FormItem className='my-2 flex flex-col self-end '>
                  <div className='flex items-center gap-2.5 space-y-0'>
                    <FormControl>
                      <Checkbox
                        className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
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
                    value={budget.conditions}
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
              <PlusCircle className=' h-5 w-5' />
            </Button>
          </div>
          {fields.length > 0 && (
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
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    {typeof field.product === 'object' && (
                      <>
                        <TableCell>
                          <Image
                            src={
                              typeof field.product.featuredImage === 'object'
                                ? field.product.featuredImage.url
                                : ''
                            }
                            alt={field.product.title}
                            className='h-24 w-24 rounded-md object-cover'
                            width={96}
                            height={96}
                          />
                        </TableCell>
                        <TableCell>{field.product.sku}</TableCell>
                        <TableCell>
                          <FormField
                            name={`items.${index}.description`}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem className='col-span-2'>
                                <FormControl>
                                  <Textarea
                                    disabled={editMode}
                                    placeholder='Descrição do produto'
                                    maxLength={300}
                                    {...field}
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
                                    placeholder='A partir de X produtos'
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
                                  <div className='flex items-center gap-2 font-medium'>
                                    <Label>R$</Label>

                                    <Input
                                      {...field}
                                      disabled={editMode}
                                      // value={formatValue(field.value)}
                                      // onChange={(e) => {
                                      //   field.onChange(parseValue(e.target.value))
                                      // }}
                                      inputMode='numeric'
                                      placeholder='0,00'
                                    />
                                  </div>
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
                            disabled={editMode}
                          >
                            <Trash2 className='h-5 w-5' />
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </form>
      </Form>
      <AddProductDialog
        open={addProductDialog}
        onClose={() => setAddProductDialog(false)}
        addProduct={(product) => {
          // console.log('product', product)
          append({
            quantity: product.minimumQuantity,
            description: product.description,
            price: '',
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
            <Search className='h-5 w-5' />
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
                    <Shirt className='m-4 h-16 w-16 text-neutral-400' />
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
                <Shirt className='m-4 h-16 w-16 text-neutral-400' />
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
