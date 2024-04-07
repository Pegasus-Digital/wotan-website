'use client'

import { useEffect, useState } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { Attribute, Category } from '@/payload/payload-types'

import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

import { nestCategories } from '@/lib/category-hierarchy'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { CategoryList } from './category-list'
import { AttributeList } from './attribute-list'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingSpinner } from '@/components/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AlertTriangle, ArrowRight, PlusCircle } from 'lucide-react'

import { createProduct } from '../_logic/actions'
import { newProductSchema } from '../_logic/validations'

interface NewProductFormProps {
  setOpen: (state: boolean) => void
}

export function NewProductForm({ setOpen }: NewProductFormProps) {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])

  const [activeTab, setActiveTab] = useState<string>('product')

  function handleChangeStep(destination: string) {
    setActiveTab(destination)
  }

  useEffect(() => {
    async function fetchAttributes() {
      setLoading(true)

      try {
        const response = await fetch(`/api/all-attributes`)
        const data = await response.json()

        setAttributes(data)
      } catch (error) {
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    async function fetchCategories() {
      setLoading(true)

      try {
        const response = await fetch(`/api/all-categories`)
        const data = await response.json()

        setCategories(data)
      } catch (error) {
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    fetchAttributes()
  }, [])

  const form = useForm<z.infer<typeof newProductSchema>>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      sku: '',
      title: '',
      description: '',
      minimumQuantity: 0,
      active: false,
      featuredImage: new File([], ''),

      categories: [],
      attributes: [],
    },
  })

  const { isSubmitting } = useFormState({ control: form.control })

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

    console.log('FeaturedImage onSubmit', JSON.stringify(featuredImage))

    const response = await createProduct({
      sku,
      title,
      description,
      minimumQuantity,
      active,

      // Placeholder image id
      featuredImage: 'test',

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 px-2'>
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

          <AnimatePresence>
            {activeTab === 'product' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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
                          <StyledFormMessage
                            form={form}
                            field='minimumQuantity'
                          />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name='featuredImage'
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className='col-span-2'>
                          <FormLabel htmlFor='featured'>
                            Imagem em destaque
                          </FormLabel>

                          <FormControl>
                            {/* <Input id='featured' type='file' {...field} /> */}
                            <Input
                              type='file'
                              onChange={(e) =>
                                field.onChange(
                                  e.target.files ? e.target.files[0] : null,
                                )
                              }
                            />
                          </FormControl>

                          <FormDescription>
                            Escolha uma imagem de até 999x777 px - png, jpg ou
                            jpeg
                          </FormDescription>
                          <StyledFormMessage
                            form={form}
                            field='featuredImage'
                          />
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
                            visível na loja imediatamente.
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
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeTab === 'attributes' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TabsContent value='attributes'>
                  <section className='grid grid-cols-2 gap-2.5'>
                    <ScrollArea className='col-span-2 max-h-[440px] w-full rounded-lg border p-2'>
                      <FormField
                        name='attributes'
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className='px-2'>
                            <AnimatePresence>
                              {field.value.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className='inline-flex flex-wrap gap-1 rounded-md'
                                >
                                  {field.value.map((item: string) => {
                                    const attribute = attributes.find(
                                      (attribute) => attribute.id === item,
                                    )

                                    return (
                                      <Badge key={item} className='h-fit w-fit'>
                                        {attribute.name}
                                      </Badge>
                                    )
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Render AttributeList, else render LoadingSpinner */}
                            <AnimatePresence>
                              {attributes && !isLoading ? (
                                <AttributeList
                                  attributes={attributes}
                                  field={field}
                                  set={form.setValue}
                                />
                              ) : (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className='flex w-full items-center justify-center'
                                >
                                  <LoadingSpinner />
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </ScrollArea>

                    <Button
                      onClick={() => handleChangeStep('categories')}
                      type='button'
                      className='col-span-2 w-fit place-self-end'
                    >
                      Próximo <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                  </section>
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {activeTab === 'categories' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TabsContent value='categories'>
                  <section className='grid grid-cols-2 gap-2.5'>
                    <ScrollArea className='col-span-2 max-h-[440px] w-full rounded-lg border p-2'>
                      <FormField
                        name='categories'
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <AnimatePresence>
                              {field.value.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className='inline-flex flex-wrap gap-1 rounded-md'
                                >
                                  {field.value.map((item: string) => {
                                    const category = categories.find(
                                      (category) => category.id === item,
                                    )

                                    return (
                                      <Badge key={item} className='h-fit w-fit'>
                                        {category.title}
                                      </Badge>
                                    )
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <AnimatePresence>
                              {isLoading && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className='flex w-full items-center justify-center'
                                >
                                  <LoadingSpinner />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {categories && (
                              <CategoryList
                                categories={nestCategories(categories)}
                                field={field}
                                set={form.setValue}
                              />
                            )}

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </ScrollArea>

                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className='col-span-2 w-full'
                    >
                      <PlusCircle className='mr-2 h-5 w-5' />
                      Criar produto
                    </Button>
                  </section>
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
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
