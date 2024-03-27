'use client'

import { useState } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'
import { motion } from 'framer-motion'

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AlertTriangle, ArrowRight, PlusCircle } from 'lucide-react'

import { createProduct } from '../_logic/actions'

const newProductSchema = z.object({
  // Non-optional fields
  title: z.string().min(3, 'Título do produto deve conter no mínimo 3 letras.'),
  active: z.boolean(),
  featuredImage: z.string(),
  minimumQuantity: z.coerce
    .number({
      required_error: 'Campo deve ser preenchido.',
      invalid_type_error: 'Campo deve conter um número.',
    })
    .min(1, 'Quantidade mínima deve ser maior que 1 unidade.'),
  sku: z
    .string()
    .refine(
      (value) => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(value),
      'SKU deve ser alfanumérico e pode conter hífens, porém não no início nem no fim do código.',
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

interface NewProductFormProps {
  setOpen: (state: boolean) => void
}

export function NewProductForm({ setOpen }: NewProductFormProps) {
  const form = useForm<z.infer<typeof newProductSchema>>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      sku: '',
      title: '',
      description: '',
      minimumQuantity: 0,
      featuredImage: '660315294d562058e2daa8fb',
      active: false,

      categories: [],
      attributes: [],
    },
  })

  // Values is already formatted and validated.
  async function onSubmit(values: z.infer<typeof newProductSchema>) {
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

      setOpen(false)
    }

    if (response.status === false) {
      toast.error(response.message)

      setOpen(false)
    }
  }

  function handleChangeStep(destination: string) {
    setActiveTab(destination)
  }

  const [activeTab, setActiveTab] = useState<string>('product')

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-2'>
        {/* Informações gerais do produto */}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <motion.div
              layout={'size'}
              className='flex items-center'
              transition={{ duration: 0.3 }}
            >
              <TabsTrigger value='product'>
                <motion.span layout={'size'}>Produto</motion.span>

                {!form.formState.isValid && form.formState.submitCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    layout={'size'}
                  >
                    <AlertTriangle className='ml-2 h-4 w-4 text-destructive' />
                  </motion.div>
                )}
              </TabsTrigger>
              <TabsTrigger value='attributes'>Atributos</TabsTrigger>
              <TabsTrigger value='categories'>Categorias</TabsTrigger>
            </motion.div>
          </TabsList>

          <TabsContent asChild value='product'>
            <motion.section
              layout
              transition={{ ease: 'easeInOut' }}
              className='grid h-full grid-cols-2 gap-2.5'
            >
              <FormField
                name='title'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do produto</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Nome do produto'
                        {...field}
                      />
                    </FormControl>
                    <StyledFormMessage form={form} field='title' />
                  </FormItem>
                )}
              />

              <FormField
                name='sku'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do produto (SKU)</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='SKU' {...field} />
                    </FormControl>
                    <FormMessage className='h-0' />
                  </FormItem>
                )}
              />

              <FormField
                name='description'
                control={form.control}
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
                name='minimumQuantity'
                control={form.control}
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
                    <StyledFormMessage form={form} field='minimumQuantity' />
                  </FormItem>
                )}
              />

              <FormField
                name='featuredImage'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='col-span-2'>
                    <FormLabel htmlFor='featured'>Imagem em destaque</FormLabel>

                    <FormControl>
                      {/* <Input id='featured' type='file' {...field} /> */}
                      <Input id='featured' type='text' {...field} />
                    </FormControl>
                    <FormDescription>
                      Escolha uma imagem de até 999x777 px
                    </FormDescription>
                    <StyledFormMessage form={form} field='featuredImage' />
                  </FormItem>
                )}
              />

              <FormField
                name='active'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='col-span-2 mt-2 flex flex-col'>
                    <div className='flex items-center gap-2.5 space-y-0'>
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
                    </div>

                    <FormDescription className='block'>
                      Se esta caixa estiver marcada, o produto será
                      disponibilizado na loja imediatamente após sua criação.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button
                onClick={() => handleChangeStep('attributes')}
                type='button'
                className='col-span-2 w-fit place-self-end'
              >
                Próximo <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </motion.section>
          </TabsContent>

          <TabsContent value='attributes'>
            <section className='grid grid-cols-2 gap-2.5'>
              <FormField
                name='attributes'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atributos</FormLabel>

                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select attributes' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={'attr1'}>Attribute 1</SelectItem>
                        <SelectItem value={'attr2'}>Attribute 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                onClick={() => handleChangeStep('categories')}
                type='button'
                className='col-span-2 w-fit place-self-end'
              >
                Próximo <ArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </section>
          </TabsContent>

          <TabsContent value='categories'>
            <section className='grid grid-cols-2 gap-2.5'>
              <FormField
                name='categories'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorias</FormLabel>

                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Selecione as categorias' />
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

              <Button type='submit' className='col-span-2 w-full'>
                <PlusCircle className='mr-2 h-5 w-5' />
                Criar produto
              </Button>
            </section>
          </TabsContent>
        </Tabs>

        {/* Relacionamentos - Atributos, categorias */}
      </form>
    </Form>
  )
}

interface StyledFormMessageProps {
  form: any
  field: string
}

function StyledFormMessage({ form, field }: StyledFormMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: form.getFieldState(field).error ? 1 : 0,
        y: form.getFieldState(field).error ? 0 : -10,
      }}
      transition={{ duration: 0.3 }}
      style={{
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <FormMessage />
    </motion.div>
  )
}
