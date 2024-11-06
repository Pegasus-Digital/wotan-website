'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
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
import Link from 'next/link'
import { LoadingSpinner } from '@/components/spinner'
import { Badge } from '@/components/ui/badge'

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
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    (budget.client as Client) ?? null,
  )
  const [addProductDialog, setAddProductDialog] = useState<boolean>(false)

  const router = useRouter()

  const [editMode, setEditMode] = useState<boolean>(!edit)
  // console.log('budget', budget)
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
      client:
        budget.client &&
        (typeof budget.client === 'string' ? budget.client : budget.client?.id),
      selectedContact: budget.selectedContact,

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
        client: values.client ? values.client : null,
        selectedContact: values.selectedContact,

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
      navbarButtons={
        <>
          <div className='flex flex-row items-center justify-center gap-2 text-sm font-bold'>
            Origem:
            <Badge variant={'outline'} className='capitalize'>
              {budget.origin === 'interno' ? 'Interno' : 'Website'}
            </Badge>
            Status:
            <Badge
              variant={
                budget.status === 'aprovado'
                  ? 'affirmative'
                  : budget.status === 'cancelado'
                    ? 'destructive'
                    : 'outline'
              }
              className='capitalize'
            >
              {budget.status ?? 'Nenhum'}
            </Badge>
            {!editMode && (
              <Button
                type='submit'
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                variant='default'
                size='sm'
              >
                <Icons.Save className='mr-2 h-5 w-5' /> Salvar
              </Button>
            )}
          </div>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <Heading variant='h6' className='text-black'>
            Cliente
          </Heading>

          <div className='grid grid-cols-[1fr_auto_1fr]  items-center gap-x-6 gap-y-2 px-3'>
            <div className={`grid gap-1 ${editMode ? 'col-span-3' : ''}`}>
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
            {!editMode && (
              <>
                <div className='relative z-0 flex h-full flex-col items-center justify-center gap-2'>
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
                            value={
                              !editMode
                                ? selectedClient
                                  ? selectedClient.id
                                  : undefined
                                : typeof budget.client === 'object'
                                  ? budget.client.id
                                  : budget.client
                            }
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
                                {!editMode && clients.length === 0 && (
                                  <SelectItem
                                    value={null}
                                    disabled
                                    className='flex items-center justify-center'
                                  >
                                    Você ainda não possui nenhum cliente.
                                  </SelectItem>
                                )}

                                {!editMode &&
                                  clients.map((client) => (
                                    <SelectItem
                                      key={client.id}
                                      value={client.id}
                                    >
                                      {client.name}
                                    </SelectItem>
                                  ))}

                                {editMode && (
                                  <SelectItem
                                    key={
                                      typeof budget.client === 'object'
                                        ? budget.client.id
                                        : budget.client
                                    }
                                    value={
                                      typeof budget.client === 'object'
                                        ? budget.client.id
                                        : budget.client
                                    }
                                  >
                                    {typeof budget.client === 'object'
                                      ? budget.client.name
                                      : budget.client}
                                  </SelectItem>
                                )}
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
                    name='selectedContact'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contato</FormLabel>
                        <FormControl>
                          <Select
                            value={budget.selectedContact || undefined}
                            onValueChange={(value) => {
                              field.onChange(value)
                              const selectedContact =
                                selectedClient?.contacts.find(
                                  (contact) => contact.id === value,
                                )
                              form.setValue(
                                'contact.customerName',
                                selectedContact?.name,
                              )
                              form.setValue(
                                'contact.email',
                                selectedContact?.email,
                              )
                              form.setValue(
                                'contact.phone',
                                selectedContact?.phone,
                              )
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
                                  Não encontramos nenhum contato para este
                                  cliente.
                                </SelectItem>
                              )}
                              {selectedClient &&
                                selectedClient?.contacts.length > 0 &&
                                selectedClient.contacts.map((contact) => (
                                  <SelectItem
                                    key={contact.id}
                                    value={contact.id}
                                  >
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
              </>
            )}

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
                <TableHead className='w-28 pl-2 pr-0'></TableHead>
                <TableHead className='max-w-24 pl-2 pr-0'>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className='w-32'>Quantidade</TableHead>
                <TableHead className='w-40'>Valor Unitário</TableHead>
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
                      <TableCell className='pl-2 pr-0'>
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
                      <TableCell className=' pl-2 pr-0'>
                        {item.product.sku}
                      </TableCell>
                      <TableCell className=' pl-2 pr-0'>
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
                                  className='min-h-24 disabled:opacity-100'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className='pl-2 pr-0 font-medium'>
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
                      <TableCell className='pl-2 pr-0 text-right'>
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
                  <Button variant='outline' className='w-full' asChild>
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
