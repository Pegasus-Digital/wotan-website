'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

import { createProduct } from '../_logic/actions'

const newProductSchema = z.object({
  // Non-optional fields
  title: z.string().min(3, 'Título do produto deve conter no mínimo 3 letras.'),
  active: z.boolean(),
  featuredImage: z.string(),
  minimumQuantity: z.coerce
    .number()
    .min(1, 'Quantidade mínima deve ser maior que 1 unidade.'),
  sku: z
    .string()
    .refine(
      (value) => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value),
      'SKU deve ser um valor alfanumérico e pode conter hífens, mas não no início nem no fim do código.',
    ),

  // Optional fields
  description: z
    .string()
    .max(300, 'Uma descrição pode ter no máximo 300 caracteres.')
    .optional(),

  // Relationship fields
  attributes: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export function NewProductForm() {
  const form = useForm<z.infer<typeof newProductSchema>>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      sku: '',
      title: '',
      description: '',
      minimumQuantity: 0,
      featuredImage: '660315294d562058e2daa8fb',

      categories: [],
      attributes: [],
    },
  })

  // Values is already formatted and validated.
  async function onSubmit(values: z.infer<typeof newProductSchema>) {
    console.log('onSubmit triggered.')

    const {
      sku,
      title,
      description,
      minimumQuantity,
      active,
      featuredImage,
      attributes,
      categories,
    } = values

    const response = await createProduct({
      sku,
      title,
      description,
      minimumQuantity,
      active,

      // Placeholder image id
      featuredImage,

      attributes,
      categories,
    })

    if (response.status === true) {
      toast.success(response.message)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-2'>
        {/* Informações gerais do produto */}
        <section className='grid grid-cols-2 gap-2.5'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do produto</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='Nome do produto' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel>Descrição do produto</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descrição do produto'
                    maxLength={300}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='minimumQuantity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade mínima</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Quantidade mínima'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='sku'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código do produto (SKU)</FormLabel>
                <FormControl>
                  <Input type='text' placeholder='SKU' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='active'
            render={({ field }) => (
              <FormItem className='mt-2 flex items-center gap-2.5 space-y-0'>
                <FormControl>
                  <Checkbox
                    className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className='cursor-pointer hover:underline'>
                  Produto deve estar visível imediatamente?
                </FormLabel>
              </FormItem>
            )}
          />
        </section>

        {/* Relacionamentos - Atributos, categorias */}
        <section>
          <FormField
            control={form.control}
            name='categories'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorias</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select attributes' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'categ1'}>Category 1</SelectItem>
                    <SelectItem value={'categ2'}>Category 2</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='categories'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorias</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Select payment type' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={'INCOME'}>Income</SelectItem>
                    <SelectItem value={'EXPENSE'}>Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='featuredImage'
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor='featured'>Imagem em destaque</FormLabel>

                <FormControl>
                  {/* <Input id='featured' type='file' {...field} /> */}
                  <Input id='featured' type='text' {...field} />
                </FormControl>
                <FormDescription>
                  Escolha uma imagem de até 999x777 px
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Button type='submit' className='w-full'>
          Criar produto
        </Button>
      </form>
    </Form>
  )
}
