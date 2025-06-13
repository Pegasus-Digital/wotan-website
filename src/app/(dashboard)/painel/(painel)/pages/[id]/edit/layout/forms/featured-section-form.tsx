import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  FeaturedSection,
  Category,
  Product,
  Media,
} from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Check,
  ChevronsUpDown,
  GripVertical,
  Loader2,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect, useCallback } from 'react'
import { TitleDescription } from './parts/title-description'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ImageUploader } from '@/app/(dashboard)/sistema/(sistema)/catalogo/produtos/_components/image-uploader'
import { Image } from '@/components/media/image'
import { Icons } from '@/components/icons'
import { toast } from 'sonner'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'

const featuredSectionSchema = z.object({
  blockType: z.literal('featured-section'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional(),
  description: z.string().optional(),
  cards: z.array(
    z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      linkTo: z.union([
        z.object({
          relationTo: z.literal('categories'),
          value: z.union([z.string(), z.any()]),
        }),
        z.object({
          relationTo: z.literal('products'),
          value: z.union([z.string(), z.any()]),
        }),
      ]),
    }),
  ),
  id: z.string().optional(),
})

type FeaturedSectionFormValues = z.infer<typeof featuredSectionSchema>

interface FeaturedSectionFormProps {
  initialData?: FeaturedSection
  onSubmit: (
    data: FeaturedSectionFormValues & { cards: { image: string }[] },
  ) => void
  isSubmitting?: boolean
}

export function FeaturedSectionForm({
  initialData,
  onSubmit,
  isSubmitting,
}: FeaturedSectionFormProps) {
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardImages, setCardImages] = useState<Media[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const form = useForm<FeaturedSectionFormValues>({
    resolver: zodResolver(featuredSectionSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      blockType: 'featured-section',
      invertBackground: false,
      title: '',
      description: '',
      cards: [
        {
          title: '',
          description: '',
          linkTo: {
            relationTo: 'categories',
            value: '',
          },
        },
      ],
    },
  })

  useEffect(() => {
    const fetchAllData = async (endpoint: string) => {
      let allItems: any[] = []
      let page = 1
      let hasMore = true

      while (hasMore) {
        try {
          const response = await fetch(`${endpoint}?page=${page}&limit=100`)
          if (!response.ok) throw new Error('Failed to fetch data')

          const data = await response.json()
          allItems = [...allItems, ...(data.docs || [])]

          hasMore = data.hasNextPage
          page++
        } catch (error) {
          throw error
        }
      }

      return allItems
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [categoriesData, productsData] = await Promise.all([
          fetchAllData('/api/categories'),
          fetchAllData('/api/products'),
        ])

        setCategories(categoriesData)
        setProducts(productsData)
      } catch (error) {
        setError(
          'Não foi possível carregar as categorias e produtos. Por favor, tente novamente.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (initialData?.cards) {
      const fetchImages = async () => {
        try {
          const imagePromises = initialData.cards
            .filter(card => card.image)
            .map(async (card) => {
              try {
                const response = await fetch(`/api/media/${card.image}`)
                if (!response.ok) return null
                return await response.json()
              } catch (error) {
                console.error('Error fetching image:', error)
                return null
              }
            })

          const images = (await Promise.all(imagePromises)).filter((img): img is Media => img !== null)
          setCardImages(images)
        } catch (error) {
          console.error('Error loading images:', error)
          toast.error('Erro ao carregar imagens')
        }
      }

      fetchImages()
    }
  }, [initialData])

  const getComboboxItems = (relationTo: 'categories' | 'products') => {
    if (relationTo === 'categories') {
      return categories.map((category) => ({
        value: category.id,
        label:
          typeof category.parent === 'object' && category.parent
            ? `${category.parent.title} > ${category.title}`
            : category.title,
      }))
    }
    return products.map((product) => ({
      value: product.id,
      label: `${product.title} (${product.sku || 'No SKU'})`,
    }))
  }

  const handleSetCardImages = useCallback((newMedia: Media[]) => {
    setCardImages(prev => {
      const updatedImages = [...prev]
      newMedia.forEach((media, index) => {
        updatedImages[index] = media
      })
      return updatedImages
    })
  }, [])

  const handleRemoveCardImage = useCallback((index: number) => {
    setCardImages(prev => prev.filter((_, i) => i !== index))
    toast.success('Imagem removida com sucesso')
  }, [])

  const onDragEnd = useCallback((result: any) => {
    setIsDragging(false)
    if (!result.destination) return

    const items = Array.from(cardImages)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setCardImages(items)
  }, [cardImages])

  const onDragStart = useCallback(() => {
    setIsDragging(true)
  }, [])

  function handleSubmit(data: FeaturedSectionFormValues) {
    const errors = form.formState.errors

    if (Object.keys(errors).length > 0) {
      alert('Form has validation errors. Check console for details.')
      return
    }

    const updatedData = {
      ...data,
      cards: data.cards.map((card, index) => {
        const image = cardImages[index]
        return {
          ...card,
          image: image?.id || '',
        }
      }),
    }

    if (updatedData.cards.length !== 4) {
      toast.error('São necessárias 4 imagens, uma para cada card.')
      return
    }

    onSubmit(
      updatedData as FeaturedSectionFormValues & {
        cards: { image: string }[]
      },
    )
  }

  const toggleOpen = (cardIndex: number) => {
    setOpenStates((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }))
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <h3 className='text-lg font-medium'>Em Destaque</h3>
        <Button
          type='submit'
          disabled={isSubmitting}
          onClick={form.handleSubmit(handleSubmit)}
          className='min-w-[100px]'
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            {Object.keys(form.formState.errors).length > 0 && (
              <div className='mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700'>
                <h3 className='font-bold'>Form Validation Errors:</h3>
                <ul className='list-disc pl-5'>
                  {Object.entries(form.formState.errors).map(
                    ([field, error]) => (
                      <li key={field}>
                        {field}: {error.message}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
            {error && (
              <div className='mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700'>
                {error}
              </div>
            )}
            <TitleDescription form={form} />
            <FormField
              control={form.control}
              name='cards'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Cards</FormLabel>
                  </div>
                  <div className='space-y-4'>
                    {field.value?.map((card, cardIndex) => (
                      <div
                        key={cardIndex}
                        className='space-y-4 rounded-lg border p-4'
                      >
                        <FormField
                          control={form.control}
                          name={`cards.${cardIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título do Card</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`cards.${cardIndex}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição do Card</FormLabel>
                              <FormControl>
                                <textarea
                                  {...field}
                                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* <FormItem>
                          <FormLabel>Imagem do Card</FormLabel>
                          <ImageUploader setMedia={(newMedia) => handleSetCardImage(cardIndex, newMedia)} />
                        </FormItem> */}
                        <FormField
                          control={form.control}
                          name={`cards.${cardIndex}.linkTo`}
                          render={({ field }) => (
                            <FormItem>
                              <div className='space-y-1'>
                                <FormLabel>Link do Card</FormLabel>
                                <FormDescription>
                                  Selecione o tipo de link e o item
                                  correspondente. Isso irá definir o link que o
                                  usuário será redirecionado ao clicar no card.
                                </FormDescription>
                              </div>
                              <div className='flex flex-col gap-4 sm:flex-row'>
                                <div className='w-full sm:w-1/3'>
                                  <Label
                                    htmlFor='type-select'
                                    className='mb-2 block'
                                  >
                                    Tipo de Link
                                  </Label>
                                  <Select
                                    value={field.value.relationTo}
                                    onValueChange={(
                                      value: 'categories' | 'products',
                                    ) => {
                                      field.onChange({
                                        ...field.value,
                                        relationTo: value,
                                        value: '',
                                      })
                                    }}
                                  >
                                    <SelectTrigger
                                      id='type-select'
                                      className='w-full'
                                    >
                                      <SelectValue placeholder='Selecione o tipo' />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value='categories'>
                                        Categorias
                                      </SelectItem>
                                      <SelectItem value='products'>
                                        Produtos
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div className='w-full sm:w-2/3'>
                                  <Label
                                    htmlFor='item-select'
                                    className='mb-2 block'
                                  >
                                    {field.value.relationTo === 'categories'
                                      ? 'Categoria'
                                      : 'Produto'}
                                  </Label>
                                  <Popover
                                    open={openStates[cardIndex]}
                                    onOpenChange={() => toggleOpen(cardIndex)}
                                  >
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant='outline'
                                        role='combobox'
                                        aria-expanded={openStates[cardIndex]}
                                        disabled={isLoading}
                                        className='w-full justify-between'
                                      >
                                        {isLoading ? (
                                          <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                            Carregando...
                                          </>
                                        ) : field.value.value ? (
                                          getComboboxItems(
                                            field.value.relationTo,
                                          ).find(
                                            (item) =>
                                              item.value === field.value.value,
                                          )?.label
                                        ) : (
                                          `Selecione ${field.value.relationTo === 'categories' ? 'uma categoria' : 'um produto'}`
                                        )}
                                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
                                      <Command>
                                        <CommandInput
                                          placeholder={`Buscar ${field.value.relationTo === 'categories' ? 'categoria' : 'produto ou SKU'}...`}
                                        />
                                        <CommandList>
                                          <CommandEmpty>
                                            Nenhum item encontrado.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {getComboboxItems(
                                              field.value.relationTo,
                                            ).map((item) => (
                                              <CommandItem
                                                key={item.value}
                                                value={item.value}
                                                onSelect={(currentValue) => {
                                                  field.onChange({
                                                    ...field.value,
                                                    value:
                                                      currentValue ===
                                                      field.value.value
                                                        ? ''
                                                        : currentValue,
                                                  })
                                                  toggleOpen(cardIndex)
                                                }}
                                              >
                                                <Check
                                                  className={cn(
                                                    'mr-2 h-4 w-4',
                                                    field.value.value ===
                                                      item.value
                                                      ? 'opacity-100'
                                                      : 'opacity-0',
                                                  )}
                                                />
                                                {item.label}
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

                    <FormItem>
                      <div className='space-y-1'>
                        <FormLabel>Imagens</FormLabel>
                        <FormDescription>
                          As imagens precisam estar na mesma ordem que os cards.
                        </FormDescription>
                      </div>
                      <DragDropContext
                        onDragEnd={onDragEnd}
                        onDragStart={onDragStart}
                      >
                        <Droppable droppableId='carousel'>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className='space-y-4'
                            >
                              {cardImages.map((image, index) => (
                                <Draggable
                                  key={image.id}
                                  draggableId={image.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`flex items-center gap-4 rounded-lg border px-4 py-2 transition-colors ${
                                        snapshot.isDragging
                                          ? 'bg-muted shadow-lg'
                                          : 'hover:bg-muted/50'
                                      }`}
                                    >
                                      <div {...provided.dragHandleProps}>
                                        <GripVertical className='h-5 w-5 text-muted-foreground' />
                                      </div>

                                      <div className='relative aspect-[1280/480] h-16 overflow-hidden rounded-md bg-muted'>
                                        <Image
                                          resource={image}
                                          fill
                                          className='object-cover'
                                        />
                                      </div>

                                      <div className='min-w-0 flex-1'>
                                        <p className='truncate font-medium'>
                                          {image.filename}
                                        </p>
                                        <p className='text-sm text-muted-foreground'>
                                          Posição: {index + 1}
                                        </p>
                                      </div>

                                      <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() =>
                                          handleRemoveCardImage(index)
                                        }
                                        className='text-destructive hover:text-destructive'
                                        disabled={isDragging}
                                      >
                                        <Icons.Trash className='h-5 w-5 hover:text-white' />
                                      </Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>

                      <ImageUploader setMedia={handleSetCardImages} />
                    </FormItem>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
