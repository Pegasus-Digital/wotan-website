'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Attribute, Category, Media, Product } from '@/payload/payload-types'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm, useFormState } from 'react-hook-form'

import { formatBytes } from '@/lib/format'
import { nestCategories } from '@/lib/category-hierarchy'

import { toast } from 'sonner'

import { CategoryList } from './category-list'
import { AttributeList } from './attribute-list'
import { ImageUploader } from './image-uploader'

import { Heading } from '@/pegasus/heading'
import { Small } from '@/components/typography/texts'

import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Image } from '@/components/media/image'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/spinner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
} from '@/components/ui/table'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form'

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
  const router = useRouter()

  const currentFeaturedImage = currentProduct.featuredImage as Media

  const [images, setMedia] = useState<Media[]>(
    currentProduct.images.map((entry) => entry.image) as Media[],
  )
  const [featured, setFeatured] = useState<string>(currentFeaturedImage.id)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  // const [priceQuantityTable, setPrices] = useState<PriceQuantityTable>(
  //   currentProduct.priceQuantityTable,
  // )

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

      priceQuantityTable: currentProduct.priceQuantityTable,

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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'priceQuantityTable',
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof updateProductSchema>) {
    const {
      sku,
      title,
      active,
      attributes,
      categories,
      description,
      minimumQuantity,
      priceQuantityTable,
    } = values

    const quantities = priceQuantityTable.map((entry) => entry.quantity)
    const quantitiesSet = new Set(quantities)

    if (quantitiesSet.size !== quantities.length) {
      return toast.error(
        'A tabela preço-quantidades contém entradas duplicadas.',
      )
    }

    // Order quantities
    const sortedQuantityTable = priceQuantityTable.sort((a, b) => {
      if (a.quantity > b.quantity) return 1
      if (a.quantity < b.quantity) return -1
      if (a.quantity === b.quantity) return 0
    })

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
      priceQuantityTable: sortedQuantityTable,
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

      // If SKU is updated, then redirect user to the new page
      if (currentProduct.sku !== sku) {
        router.push(`/painel/catalogo/produtos/${sku}?edit=true`)
      }
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  const formatValue = (value: number) => {
    const integerPart = Math.floor(value / 100).toString()
    const decimalPart = (value % 100).toString().padStart(2, '0')
    return `${integerPart},${decimalPart}`
  }

  const parseValue = (formattedValue: string) => {
    // Solves edge case - CTRL + A -> Backspace was resulting in NaN,NaN
    if (formattedValue.length === 0) {
      return parseInt('0,00')
    }

    const numericValue = formattedValue.replace(/\D/g, '') // Remove non-numeric characters
    return parseInt(numericValue, 10)
  }

  const name = form.watch('title')

  return (
    <Form {...form}>
      {!edit && (
        <div className='sticky top-0 z-10 flex  items-center justify-between border-b bg-background px-4 pb-6 pt-8 '>
          <Heading variant='h5'>{name || 'Novo Produto'}</Heading>
          <Button
            type='submit'
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            variant='default'
          >
            <Icons.Save className='mr-2 h-5 w-5' /> Salvar
          </Button>
        </div>
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 px-2 pt-4'
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
              <FormMessage />
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
              <FormMessage />
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
                  disabled={edit}
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
          name='active'
          control={form.control}
          render={({ field }) => (
            <FormItem className='my-2 flex flex-col self-end '>
              <div className='flex items-center gap-2.5 space-y-0'>
                <FormControl>
                  <Checkbox
                    disabled={edit}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
                  />
                </FormControl>
                <FormLabel className='cursor-pointer hover:underline'>
                  Produto ativo
                </FormLabel>
              </div>

              <FormDescription className='block'>
                Se esta caixa estiver marcada, o produto será visível na loja
                imediatamente.
              </FormDescription>
            </FormItem>
          )}
        />

        <Separator />

        <Heading variant='h6' className='text-black'>
          Imagens
        </Heading>

        <div className='col-span-2'>
          <ImageUploader setMedia={setMedia} readonly={edit} />
        </div>

        {images.length >= 1 && (
          <div className='col-span-2'>
            <p className='my-2 text-sm font-medium text-muted-foreground'>
              Arquivos salvos
            </p>
            <div className='space-y-2 rounded-lg transition-all hover:bg-muted/40'>
              <RadioGroup onValueChange={(value) => setFeatured(value)}>
                {images.map((file) => {
                  return (
                    <div
                      key={file.id}
                      className='group flex w-full justify-between gap-2 overflow-hidden rounded-lg border border-slate-100 hover:border-slate-300'
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
                              <RadioGroupItem value={file.id} disabled={edit} />
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
                        className='items-center justify-center bg-destructive px-2 text-white transition-all group-hover:flex'
                        disabled={edit}
                      >
                        <Icons.Close className='h-5 w-5' />
                      </button>
                    </div>
                  )
                })}
              </RadioGroup>
            </div>
          </div>
        )}

        <Separator />
        <>
          <div className='flex items-center justify-between gap-2'>
            <Heading variant='h6' className='text-black'>
              Tabela Preço-Quantidade
            </Heading>
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={() => append({ quantity: 0, unitPrice: 0 })}
            >
              <Icons.Add className=' h-5 w-5' />
            </Button>
          </div>
          {fields.length > 0 && (
            <Table>
              <TableHeader className='w-full'>
                <TableRow className='w-full'>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço unitário</TableHead>
                  <TableHead className='text-end'>Interações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell className='font-medium'>
                      <FormField
                        control={form.control}
                        name={`priceQuantityTable.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={edit}
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
                        name={`priceQuantityTable.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className='flex items-center gap-2 font-medium'>
                                <Label>R$</Label>

                                <Input
                                  {...field}
                                  disabled={edit}
                                  value={formatValue(field.value)}
                                  onChange={(e) => {
                                    field.onChange(parseValue(e.target.value))
                                  }}
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
                        disabled={edit}
                      >
                        <Icons.Trash className='h-5 w-5' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
        <Separator />

        <Accordion type='multiple'>
          <AccordionItem value='attributes'>
            <AccordionTrigger>
              <Heading variant='h6' className='text-black'>
                Atributos
              </Heading>
            </AccordionTrigger>
            <AccordionContent>
              <FormField
                name='attributes'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='px-2'>
                    {field.value.length > 0 &&
                      field.value.map((item: string) => {
                        const attribute = attributes.find(
                          (attribute) => attribute.id === item,
                        )

                        return (
                          <Badge key={item} className='h-fit w-fit'>
                            {attribute.name}
                          </Badge>
                        )
                      })}

                    {/* Render AttributeList, else render LoadingSpinner */}
                    {attributes && !isLoading ? (
                      <AttributeList
                        attributes={attributes}
                        field={field}
                        set={form.setValue}
                        readonly={edit}
                      />
                    ) : (
                      <LoadingSpinner />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='categories'>
            <AccordionTrigger>
              <Heading variant='h6' className='text-black'>
                Categorias
              </Heading>
            </AccordionTrigger>

            <AccordionContent>
              <FormField
                name='categories'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    {field.value.length > 0 &&
                      field.value.map((item: string) => {
                        const category = categories.find(
                          (category) => category.id === item,
                        )

                        return (
                          <Badge key={item} className='h-fit w-fit'>
                            {category.title}
                          </Badge>
                        )
                      })}

                    {isLoading && <LoadingSpinner />}

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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
    </Form>
  )
}
