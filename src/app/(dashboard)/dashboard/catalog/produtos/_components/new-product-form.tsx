'use client'

import { useEffect, useState } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Attribute, Category } from '@/payload/payload-types'

import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'

import { NestedCategory, nestCategories } from '@/lib/category-hierarchy'

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

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { AlertTriangle, ArrowRight, PlusCircle } from 'lucide-react'

import { createProduct } from '../_logic/actions'
import {
  filterAttributesByName,
  filterAttributesByType,
  getUniqueTypes,
} from '@/lib/attribute-hooks'
import { Large, Small } from '@/components/typography/texts'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/spinner'

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
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>('product')

  function handleChangeStep(destination: string) {
    setActiveTab(destination)
  }

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

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/all-attributes`)

        const data = await response.json()

        setAttributes(data.docs)
        setLoading(false)
      } catch (error) {
        console.error(error)
        toast.error(error)
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/all-categories`)

        const data = await response.json()

        setCategories(data.docs)
        setLoading(false)
      } catch (error) {
        console.error(error)
        toast.error(error)
        setLoading(false)
      }
    }

    Promise.all([fetchCategories(), fetchAttributes()])
  }, [])

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

  interface AttributeListProps {
    attributes: Attribute[]
    props: any
  }

  const AttributeList: React.FC<AttributeListProps> = ({
    attributes,
    props,
  }) => {
    const colors = filterAttributesByType(attributes, 'color')
    const labels = filterAttributesByType(attributes, 'label')
    const types = getUniqueTypes(labels)

    function handleCheckedChange(id: string, state: boolean) {
      // state === true => Checkbox foi marcada => Atualiza estado do form adicionando o elemento
      // state === false => Checkbox foi desmarcada => Remove o elemento do valor do form
      state
        ? props.value.push(id)
        : (props.value = props.value.filter(
            (categoryId: any) => categoryId !== id,
          ))

      // Pra funcionar com form controlado
      form.setValue('attributes', props.value)
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='grid w-full grid-cols-2 gap-4'
      >
        <div className='space-y-2.5'>
          <Large>Cores</Large>

          {colors.map((color) => (
            <div key={color.id} className='flex items-center gap-1'>
              <Checkbox
                id={color.id}
                name={color.name}
                value={color.id}
                defaultChecked={props.value.includes(color.id)}
                onCheckedChange={(state) =>
                  handleCheckedChange(color.id, !!state)
                }
              />
              <div
                className='h-5 w-5 rounded-full border'
                style={{ backgroundColor: color.value }}
              />

              <Small>{color.name}</Small>
            </div>
          ))}
        </div>

        {types.map((type) => {
          const filteredAttributes = filterAttributesByName(labels, type)

          return (
            <div key={type} className='space-y-1'>
              <Large>{type}</Large>

              {filteredAttributes.map((label) => (
                <div key={label.id} className='flex items-center gap-1'>
                  <Checkbox
                    id={label.id}
                    name={label.name}
                    value={label.id}
                    defaultChecked={props.value.includes(label.id)}
                    onCheckedChange={(state) =>
                      handleCheckedChange(label.id, !!state)
                    }
                  />

                  <Small>{label.name}</Small>
                </div>
              ))}
            </div>
          )
        })}
      </motion.div>
    )
  }

  interface CategoryListProps {
    categories: NestedCategory[]
    props: any
  }

  const CategoryList: React.FC<CategoryListProps> = ({ categories, props }) => {
    return (
      <div className='space-y-2'>
        {categories.map((category) => (
          <CategoryCheckbox
            key={category.id}
            category={category}
            props={props}
          />
        ))}
      </div>
    )
  }

  interface CategoryCheckboxProps {
    category: NestedCategory
    props: any
  }

  const CategoryCheckbox: React.FC<CategoryCheckboxProps> = ({
    category,
    props,
  }) => {
    function handleCheckedChange(id: string, state: boolean) {
      // state === true => Checkbox foi marcada => Atualiza estado do form adicionando o elemento
      // state === false => Checkbox foi desmarcada => Remove o elemento do valor do form
      state
        ? props.value.push(id)
        : (props.value = props.value.filter(
            (categoryId: any) => categoryId !== id,
          ))

      // Pra funcionar com form controlado
      form.setValue('categories', props.value)
    }

    return (
      <div className='ml-4 space-y-2'>
        <div className='group flex items-center gap-1.5'>
          <Checkbox
            id={category.id}
            name={category.title}
            value={category.id}
            defaultChecked={props.value.includes(category.id)}
            onCheckedChange={(state) =>
              handleCheckedChange(category.id, !!state)
            }
          />
          <Label
            className='cursor-pointer hover:underline group-hover:underline'
            htmlFor={category.id}
          >
            {category.title}
          </Label>
        </div>

        {category.children.map((childCategory) => (
          <CategoryCheckbox
            key={childCategory.id}
            category={childCategory}
            props={props}
          />
        ))}
      </div>
    )
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
                            <Input id='featured' type='text' {...field} />
                          </FormControl>
                          <FormDescription>
                            Escolha uma imagem de até 999x777 px
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
                  <section className='flex flex-col'>
                    <FormField
                      name='attributes'
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
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

                          <AnimatePresence>
                            {attributes && !isLoading && (
                              <AttributeList
                                attributes={attributes}
                                props={field}
                              />
                            )}
                          </AnimatePresence>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      onClick={() => handleChangeStep('categories')}
                      type='button'
                      className='w-fit self-end'
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
                            <FormLabel className='text-lg'>
                              Categorias:{' '}
                            </FormLabel>

                            <div className='inline-flex flex-wrap gap-1 rounded-md'>
                              {field.value.map((item: string) => (
                                <Badge key={item} className='h-fit w-fit'>
                                  {
                                    categories.find(
                                      (category) => category.id === item,
                                    ).title
                                  }
                                </Badge>
                              ))}
                            </div>

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
                                props={field}
                              />
                            )}

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </ScrollArea>
                    <Button type='submit' className='col-span-2 w-full'>
                      <PlusCircle className='mr-2 h-5 w-5' />
                      Criar produto
                    </Button>
                  </section>
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
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
