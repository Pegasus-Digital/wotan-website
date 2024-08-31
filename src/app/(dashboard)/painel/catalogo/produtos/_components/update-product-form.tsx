'use client'

import { useEffect, useState } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { formatBytes } from '@/lib/format'
import { nestCategories } from '@/lib/category-hierarchy'

import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

import {
  Attribute,
  Category,
  Media,
  PriceQuantityTable,
  Product,
} from '@/payload/payload-types'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { PricesList } from './prices-list'
import { CategoryList } from './category-list'
import { AttributeList } from './attribute-list'
import { ImageUploader } from './image-uploader'

import { Heading } from '@/pegasus/heading'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/media/image'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingSpinner } from '@/components/spinner'
import { Small } from '@/components/typography/texts'
import { ScrollArea } from '@/components/ui/scroll-area'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { PlusCircle, X } from 'lucide-react'

import { updateProduct } from '../_logic/actions'
import { updateProductSchema } from '../_logic/validations'

interface UpdateProductFormProps {
  currentProduct: Product
  edit: boolean
}

export function UpdateProductForm({
  currentProduct,
  edit = false,
}: UpdateProductFormProps) {
  const currentFeaturedImage = currentProduct.featuredImage as Media

  const [images, setMedia] = useState<Media[]>(
    currentProduct.images.map((entry) => entry.image) as Media[],
  )
  const [featured, setFeatured] = useState<string>(currentFeaturedImage.id)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [priceQuantityTable, setPrices] = useState<PriceQuantityTable>(
    currentProduct.priceQuantityTable,
  )

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

  const form = useForm<z.infer<typeof updateProductSchema>>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      sku: currentProduct.sku,
      title: currentProduct.title,
      description: currentProduct.description,
      minimumQuantity: currentProduct.minimumQuantity,
      active: currentProduct.active,

      categories:
        typeof currentProduct.categories === 'object'
          ? currentProduct.categories.map((category: Category) => category.id)
          : [],
      attributes:
        typeof currentProduct.attributes === 'object'
          ? currentProduct.attributes.map(
              (attribute: Attribute) => attribute.id,
            )
          : [],
    },
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof updateProductSchema>) {
    const {
      sku,
      title,
      description,
      minimumQuantity,
      active,
      attributes,
      categories,
    } = values

    if (!featured || featured === '') {
      return toast.error(
        'Você deve escolher uma imagem em destaque para o produto.',
      )
    }

    const response = await updateProduct(currentProduct.id, {
      sku,
      title,
      description,
      minimumQuantity,
      priceQuantityTable,
      active,

      featuredImage: featured,
      images: images.map((image) => {
        return { image: image.id }
      }),

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='max-w-screen-xl space-y-4'
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
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
                      disabled={edit}
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
                    <Input
                      disabled={edit}
                      type='text'
                      placeholder='SKU'
                      {...field}
                    />
                  </FormControl>
                  <StyledFormMessage form={form} field='sku' />
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
                      disabled={edit}
                      placeholder='Descrição do produto'
                      maxLength={300}
                      {...field}
                    />
                  </FormControl>
                  <StyledFormMessage form={form} field='description' />
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
                      disabled={edit}
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
              name='active'
              control={form.control}
              render={({ field }) => (
                <FormItem className='my-2 flex flex-col self-end px-2'>
                  <div className='flex items-center gap-2.5 space-y-0'>
                    <FormControl>
                      <Checkbox
                        disabled={edit}
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
                    Se esta caixa estiver marcada, o produto será visível na
                    loja imediatamente.
                  </FormDescription>
                </FormItem>
              )}
            />

            {!edit && (
              <div className='col-span-2'>
                <ImageUploader setMedia={setMedia} />
              </div>
            )}

            {images.length >= 0 && (
              <div className='col-span-2'>
                <p className='my-2 text-sm font-medium text-muted-foreground'>
                  Arquivos salvos
                </p>
                <div className='space-y-2 pr-3'>
                  <RadioGroup onValueChange={(value) => setFeatured(value)}>
                    {images.map((file) => {
                      return (
                        <div
                          key={file.id}
                          className='group flex w-full justify-between gap-2 overflow-hidden rounded-lg border border-slate-100 pr-2 transition-all hover:border-slate-300 hover:pr-0'
                        >
                          <div className='flex flex-1 items-center p-2'>
                            <div>
                              <Image
                                resource={file}
                                imgClassName='w-24 object-cover'
                              />
                            </div>
                            <div className='ml-2 w-full space-y-2'>
                              <div className='flex flex-col justify-between text-sm'>
                                <p className='text-muted-foreground '>
                                  {file.filename}
                                </p>
                                <p>{formatBytes(file.filesize)}</p>

                                <div className='mt-1 flex items-center space-x-2'>
                                  <RadioGroupItem value={file.id} />
                                  <Small>Imagem em destaque</Small>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault()

                              setFeatured('')

                              const filteredImage = images.filter(
                                (image) => image.id !== file.id,
                              )

                              setMedia(filteredImage)
                            }}
                            className='items-center justify-center bg-red-500 px-2 text-white transition-all group-hover:flex'
                          >
                            <X size={20} />
                          </button>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
              </div>
            )}
          </motion.section>
        </motion.div>

        <PricesList
          table={priceQuantityTable}
          setPrices={setPrices}
          edit={edit}
        />
        {attributes.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section className='grid grid-cols-2 gap-2.5'>
              <ScrollArea className='col-span-2 max-h-[440px] w-full rounded-lg border p-2'>
                <FormField
                  disabled={edit}
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
                                  {attribute?.name}
                                </Badge>
                              )
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Render AttributeList, else render LoadingSpinner */}
                      <AnimatePresence>
                        {attributes && !isLoading ? (
                          <>
                            <Heading variant='h5'>Atributos</Heading>
                            <AttributeList
                              attributes={attributes}
                              field={field}
                              set={form.setValue}
                            />
                          </>
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
            </section>
          </motion.div>
        )}

        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <section className='grid grid-cols-2 gap-2.5'>
              <ScrollArea className='col-span-2 max-h-[440px] w-full rounded-lg border p-2'>
                <FormField
                  name='categories'
                  disabled={edit}
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
                        <>
                          <Heading variant='h5'>Categorias</Heading>
                          <CategoryList
                            categories={nestCategories(categories)}
                            field={field}
                            set={form.setValue}
                          />
                        </>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ScrollArea>
              {!edit && (
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='col-span-2 w-full'
                >
                  <PlusCircle className='mr-2 h-5 w-5' />
                  Atualizar produto
                </Button>
              )}
            </section>
          </motion.div>
        )}
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
