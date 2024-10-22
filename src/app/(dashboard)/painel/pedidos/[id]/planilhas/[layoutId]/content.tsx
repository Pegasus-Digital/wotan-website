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
  Layout,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { layoutSchema } from '../../../_logic/validation'
import update from 'payload/dist/collections/operations/update'
import { updateLayout } from '../../../_logic/actions'
import { formatBRL, formatBRLWithoutPrefix, parseValue } from '@/lib/format'
import { getDDMMYYDate } from '@/lib/date'

// Define the validation schema

type LayoutProps = z.infer<typeof layoutSchema>

interface SeeOrderContentProps {
  order: Order
  layout: Layout
  edit: boolean
}

export function LayoutContent({ order, edit, layout }: SeeOrderContentProps) {
  const form = useForm<LayoutProps>({
    resolver: zodResolver(layoutSchema),
    defaultValues: { ...layout },
  })

  const [editMode, toggleEditMode] = useState<boolean>(!edit)

  const item = order.itens.find((item) => {
    // console.log('item', item)
    // console.log('layout', layout.id)
    if (
      (typeof item.layout === 'object' ? item.layout.id : item.layout) ===
      layout.id
    ) {
      return {
        ...item,
      }
    }
    return null
  })

  const client = typeof order.client === 'object' ? order.client : null

  const contact = client.contacts.filter(
    (contact) => contact.id === order.contact,
  )

  // console.log(item)
  // console.log('Order default:', order)

  const { control, handleSubmit, formState, watch } = form

  // const { errors, isValid } = useFormState({ control })

  const { fields, append } = useFieldArray({
    control,
    name: 'supplyer',
  })
  const layoutItem = order.itens.find((item) => {
    if (
      (typeof item.layout === 'object' ? item.layout.id : item.layout) ===
      layout.id
    ) {
      return {
        ...item,
      }
    }
    return null
  })

  const agencyComissionPercent = watch('commisions.agency.value')
  const salespersonComissionPercent = watch('commisions.salesperson.value')

  const totalValue = (layoutItem.quantity * layoutItem.price) / 100

  const agencyComission = (totalValue * agencyComissionPercent) / 100
  const salespersonComission = (totalValue * salespersonComissionPercent) / 100

  async function onSubmit(values: LayoutProps) {
    console.log('Layout submitted:', values)

    const response = await updateLayout({
      layoutId: layout.id,
      layout: {
        ...values,
        sample: {
          with: values.sample.with,
          approved: values.sample.approved,
          new: values.sample.new,
        },
      },
    })

    if (response.status) {
      toast.success('Layout atualizado com sucesso.')
    } else {
      toast.error('Ocorreu um erro ao atualizar o layout.')
    }
  }

  return (
    <Content>
      <ContentHeader
        title={`${edit ? 'Editar p' : 'P'}lanilha de Produção`}
        description={`Visualize ou edite a planilha conforme necessário.`}
      />
      <Separator className='mb-4' />
      <Form {...form}>
        <div className='sticky top-0 z-10 flex  items-center justify-between border-b bg-background px-4 pb-2 pt-4 '>
          <div className='flex flex-col justify-start gap-2'>
            <Heading variant='h5'>
              Produto:{' '}
              {item && typeof item.product === 'object'
                ? item.product.sku + '-'
                : ''}
              {item && typeof item.product === 'object'
                ? item.product.title
                : ''}
            </Heading>
            <Label>Quantidade: {item && item.quantity}</Label>
            <Label>Material: | Cor:</Label>
          </div>
          <div className='flex flex-col justify-start gap-2'>
            <Label>Pedido: #{order.incrementalId}</Label>
            <Label> Data: {getDDMMYYDate(new Date(order.createdAt))}</Label>

            {order.shippingTime && (
              <Label>Prazo de Entrega: {order.shippingTime}</Label>
            )}
          </div>
          <div className='flex flex-col justify-start gap-2'>
            <Label>
              Cliente:{' '}
              {typeof order.client === 'object'
                ? order.client.name
                : order.client}
            </Label>
            <Label>Contato: {contact[0].name}</Label>
            {order.paymentConditions && (
              <Label>Condição de Pagamento: {order.paymentConditions}</Label>
            )}
          </div>
          {!editMode && (
            <Button
              type='submit'
              // disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              // () => {
              // console.log(form.getValues())
              // console.log(isValid)
              // console.log(errors)
              // handleSubmit(onSubmit)
              // }

              variant='default'
            >
              <Icons.Save className='mr-2 h-4 w-4' /> Salvar
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 px-2 pt-4'>
          <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2'>
            <Card>
              <CardHeader>
                <Heading variant={'h6'} className='text-black'>
                  Impressão 1
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormField
                  control={form.control}
                  name='printing.type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Impressão</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione...' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Selecione...</SelectItem>
                            <SelectItem value='serigrafia'>
                              Serigrafia
                            </SelectItem>
                            <SelectItem value='laser'>Laser</SelectItem>
                            <SelectItem value='bordado'>Bordado</SelectItem>
                            <SelectItem value='adesivo'>
                              Aplicação de Adesivo
                            </SelectItem>
                            <SelectItem value='madeira'>
                              Gravação em Madeira
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'printing.colors'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cores</FormLabel>
                      <FormControl>
                        <Input {...field} className='disabled:opacity-100' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'printing.supplyer'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <FormControl>
                        <Input {...field} className='disabled:opacity-100' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name={`printing.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className='disabled:opacity-100'
                            type='number'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`printing.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <div className='flex items-center gap-2 font-medium'>
                            <Label>R$</Label>

                            <Input
                              {...field}
                              value={formatBRLWithoutPrefix(field.value)}
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heading variant={'h6'} className='text-black'>
                  Impressão 2 (Opcional)
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormField
                  control={form.control}
                  name='printing2.type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Impressão</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Selecione...' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Selecione...</SelectItem>
                            <SelectItem value='serigrafia'>
                              Serigrafia
                            </SelectItem>
                            <SelectItem value='laser'>Laser</SelectItem>
                            <SelectItem value='bordado'>Bordado</SelectItem>
                            <SelectItem value='adesivo'>
                              Aplicação de Adesivo
                            </SelectItem>
                            <SelectItem value='madeira'>
                              Gravação em Madeira
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'printing2.colors'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cores</FormLabel>
                      <FormControl>
                        <Input {...field} className='disabled:opacity-100' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'printing2.supplyer'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <FormControl>
                        <Input {...field} className='disabled:opacity-100' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name={`printing2.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className='disabled:opacity-100'
                            type='number'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`printing2.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço</FormLabel>
                        <FormControl>
                          <div className='flex items-center gap-2 font-medium'>
                            <Label>R$</Label>

                            <Input
                              {...field}
                              value={formatBRLWithoutPrefix(field.value)}
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
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className='flex items-center justify-between gap-2'>
                <Heading variant={'h6'} className='text-black'>
                  Materiais/Fornecedores
                </Heading>
                {!editMode && (
                  <Button
                    type='button'
                    variant='outline'
                    disabled={editMode}
                    size='icon'
                    onClick={() =>
                      append({
                        material: '',
                        quantidade_material: 0,
                        fornecedor_material: '',
                        custo_material: 0,
                      })
                    }
                  >
                    <Icons.Add className='h-5 w-5' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className='grid grid-cols-1 gap-4 space-y-2 tablet:grid-cols-2'>
              {fields.map((supplier, index) => (
                <Card key={index} className='border-y-0 shadow-none'>
                  <CardContent className='flex flex-col space-y-2'>
                    <FormField
                      control={form.control}
                      name={`supplyer.${index}.material`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Material</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className='disabled:opacity-100'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`supplyer.${index}.fornecedor_material`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fornecedor</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className='disabled:opacity-100'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`supplyer.${index}.quantidade_material`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className='disabled:opacity-100'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`supplyer.${index}.custo_material`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custo</FormLabel>
                          <FormControl>
                            <div className='flex items-center gap-2 font-medium'>
                              <Label>R$</Label>

                              <Input
                                {...field}
                                value={formatBRLWithoutPrefix(field.value)}
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
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
          <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2'>
            <Card>
              <CardHeader>
                <Heading variant={'h6'} className='text-black'>
                  Observações
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormField
                  control={form.control}
                  name={'additionalCosts.obs'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='disabled:opacity-100'
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'additionalCosts.cost'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2 font-medium'>
                          <Label>R$</Label>

                          <Input
                            {...field}
                            value={formatBRLWithoutPrefix(field.value)}
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Heading variant={'h6'} className='text-black'>
                  Observações adicionais
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormField
                  control={form.control}
                  name={'additionalCosts2.obs'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className='disabled:opacity-100'
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'additionalCosts2.cost'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2 font-medium'>
                          <Label>R$</Label>

                          <Input
                            {...field}
                            value={formatBRLWithoutPrefix(field.value)}
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
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2'>
            <Card>
              <CardHeader>
                <Heading variant={'h6'} className='text-black'>
                  Frete
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormField
                  control={form.control}
                  name={'delivery.company'}
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
                  name={'delivery.cost'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2 font-medium'>
                          <Label>R$</Label>

                          <Input
                            {...field}
                            value={formatBRLWithoutPrefix(field.value)}
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
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Heading variant={'h6'} className='text-black'>
                  Frete 2 (Opcional)
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormField
                  control={form.control}
                  name={'delivery2.company'}
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
                  name={'delivery2.cost'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custo</FormLabel>
                      <FormControl>
                        <div className='flex items-center gap-2 font-medium'>
                          <Label>R$</Label>

                          <Input
                            {...field}
                            value={formatBRLWithoutPrefix(field.value)}
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
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <Heading variant={'h6'} className='text-black'>
                Comissões
              </Heading>
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='grid grid-cols-1  gap-4 tablet:grid-cols-3'>
                <FormField
                  control={form.control}
                  name={'commisions.agency.name'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comissão Agência</FormLabel>
                      <FormControl>
                        <Input {...field} className='disabled:opacity-100' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'commisions.agency.value'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentagem</FormLabel>
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
                <div className='mt-auto flex h-9 items-center justify-center'>
                  <Label className='text-black'>
                    {formatBRL(agencyComission)}
                  </Label>
                </div>
                <FormField
                  control={form.control}
                  name={'commisions.salesperson.name'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comissão Vendedor</FormLabel>
                      <FormControl>
                        <Input {...field} className='disabled:opacity-100' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'commisions.salesperson.value'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Porcentagem</FormLabel>
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
                <div className='mt-auto flex h-9 items-center justify-center'>
                  <Label className=' text-black'>
                    {formatBRL(salespersonComission)}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className='grid grid-cols-1 gap-4 tablet:grid-cols-2'>
            <Card>
              <CardHeader>
                <Heading variant='h6' className='text-black'>
                  Layout
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <div className='flex gap-2'>
                  <FormField
                    name={`layout.sent`}
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
                    name={`layout.approved`}
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
                  <FormField
                    name={`layout.sameAsPrevious`}
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
                            Idem ao anterior
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`layout.reSent`}
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
                            Reenviado
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`layout.fotolitus`}
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
                            Fotolito
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name={`layout.obs`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={editMode}
                          className='disabled:opacity-100'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heading variant='h6' className='text-black'>
                  Amostra
                </Heading>
              </CardHeader>
              <CardContent className='space-y-2'>
                <FormField
                  name={`sample.with`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amostra</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          disabled={editMode}
                          value={field.value ? 'true' : 'false'}
                          className='mr-6 flex flex-row gap-2'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value={'true'} id='r1' />
                            <Label htmlFor='r1'>Com</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value={'false'} id='r2' />
                            <Label htmlFor='r2'>Sem</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`sample.approved`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aprovado</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          disabled={editMode}
                          value={field.value ? 'true' : 'false'}
                          className='mr-6 flex flex-row gap-2'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value={'true'} id='r1' />
                            <Label htmlFor='r1'>Sim</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value={'false'} id='r2' />
                            <Label htmlFor='r2'>Não</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`sample.new`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova amostra</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          disabled={editMode}
                          value={field.value ? 'true' : 'false'}
                          className='mr-6 flex flex-row gap-2'
                        >
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value={'true'} id='r1' />
                            <Label htmlFor='r1'>Sim</Label>
                          </div>
                          <div className='flex items-center space-x-2'>
                            <RadioGroupItem value={'false'} id='r2' />
                            <Label htmlFor='r2'>Não</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className='space-y-2 pt-4'>
              <FormField
                name={'prazoentrega'}
                control={form.control}
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
                name={'transp'}
                control={form.control}
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
                name={'shipmentType'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frete</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          disabled={editMode}
                          className='disabled:opacity-100'
                        >
                          <SelectValue placeholder='Selecione...' />
                        </SelectTrigger>
                        <SelectContent>
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
                name={'shipmentCost'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Frete</FormLabel>
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
                name={'quote'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número Cotação</FormLabel>
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
                name={'volumeNumber'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto</FormLabel>
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
            </CardContent>
          </Card>

          <Card>
            <CardContent className='space-y-2 pt-4'>
              <FormField
                name={'shipmentDate'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Remessa/Entrega</FormLabel>
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
                name={'paymentType'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo Pagamento</FormLabel>
                    <FormControl>
                      <Select
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          disabled={editMode}
                          className='disabled:opacity-100'
                        >
                          <SelectValue placeholder='Selecione...' />
                        </SelectTrigger>
                        <SelectContent>
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
              <div className='grid grid-cols-3 gap-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>Nota 1</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <FormField
                      name={'invoice.number'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>N° Nota Fiscal</FormLabel>
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
                      name={'invoice.due'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vencimento</FormLabel>
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
                      name={'invoice.value'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <div className='flex items-center gap-2 font-medium'>
                              <Label>R$</Label>

                              <Input
                                {...field}
                                value={formatBRLWithoutPrefix(field.value)}
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
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Nota 2</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <FormField
                      name={'invoice2.number'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>N° Nota Fiscal</FormLabel>
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
                      name={'invoice2.due'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vencimento</FormLabel>
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
                      name={'invoice2.value'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <div className='flex items-center gap-2 font-medium'>
                              <Label>R$</Label>

                              <Input
                                {...field}
                                value={formatBRLWithoutPrefix(field.value)}
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
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Nota 3</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <FormField
                      name={'invoice3.number'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>N° Nota Fiscal</FormLabel>
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
                      name={'invoice3.due'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vencimento</FormLabel>
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
                      name={'invoice3.value'}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <div className='flex items-center gap-2 font-medium'>
                              <Label>R$</Label>

                              <Input
                                {...field}
                                value={formatBRLWithoutPrefix(field.value)}
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
                  </CardContent>
                </Card>
              </div>
              <FormField
                name={'ncm'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NCM</FormLabel>
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
                name={'obs_final'}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observação</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={editMode}
                        className='disabled:opacity-100'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* 

   
     
          <>
            <div>
              <Label htmlFor='data_entrega'>Data Remessa/Entrega</Label>
              <Input id='data_entrega' name='data_entrega' />
            </div>
            <div>
              <Label htmlFor='tipopagamento'>Tipo Pagamento</Label>
              <Select id='tipopagamento' name='tipopagamento'>
                <option value='0'>Selecione</option>
                <option value='1'>Cheque</option>
                <option value='2'>Boleto</option>
                <option value='3'>Depósito</option>
              </Select>
            </div>
            <div>
              <Label htmlFor='numero_nota'>N° Nota Fiscal</Label>
              <Input id='numero_nota' name='numero_nota' />
            </div>
            <div>
              <Label htmlFor='vencimento_entrega'>Vencimento</Label>
              <Input id='vencimento_entrega' name='vencimento_entrega' />
            </div>
            <div>
              <Label htmlFor='valor_entrega'>Valor</Label>
              <Input id='valor_entrega' name='valor_entrega' />
            </div>
          </>

          <>
            <div>
              <Label htmlFor='ncm'>NCM</Label>
              <Input id='ncm' name='ncm' />
            </div>
            <div>
              <Label htmlFor='obs_final'>Observações</Label>
              <Textarea id='obs_final' name='obs_final' />
            </div>
          </>

          <div>
            <Button type='submit'>Salvar</Button>
            <Button type='button' variant='secondary'>
              Voltar
            </Button>
          </div> */}
        </form>
      </Form>
    </Content>
  )
}
