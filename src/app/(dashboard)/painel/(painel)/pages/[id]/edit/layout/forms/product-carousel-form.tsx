import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  ProductCarousel,
  Category,
  Product,
  Page,
} from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
} from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { TitleDescription } from './parts/title-description'
import { Link } from './parts/link'

const productCarouselSchema = z.object({
  id: z.string(),
  blockType: z.literal('product-carousel'),
  invertBackground: z.boolean().default(false),
  title: z.string(),
  description: z.string(),
  populateBy: z.enum(['categories', 'selection']),
  categories: z.array(z.union([z.string(), z.any()])),
  // selectedDocs: z.array(
  //   z.object({
  //     relationTo: z.literal('products'),
  //     value: z.union([z.string(), z.any()]),
  //   }),
  // ),
  seeMore: z.boolean(),
  seeMoreLink: z.object({
    type: z.enum(['reference', 'custom']),
    newTab: z.boolean(),
    label: z.string(),
    reference: z.union([
      z.object({
        relationTo: z.literal('pages'),
        value: z.union([z.string(), z.any()]),
      }),
      z.object({
        relationTo: z.literal('products'),
        value: z.union([z.string(), z.any()]),
      }),
      z.object({
        relationTo: z.literal('categories'),
        value: z.union([z.string(), z.any()]),
      }),
    ]),
  }),
})

type ProductCarouselFormValues = z.infer<typeof productCarouselSchema>

interface ProductCarouselFormProps {
  initialData?: ProductCarousel
  onSubmit: (data: ProductCarouselFormValues) => void
  isSubmitting?: boolean
}

interface ComboboxItem {
  value: string
  label: string
}

export function ProductCarouselForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ProductCarouselFormProps) {
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean }>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<ProductCarouselFormValues>({
    resolver: zodResolver(productCarouselSchema),
    mode: 'onChange',
    defaultValues: {
      id: initialData?.id || '',
      blockType: 'product-carousel',
      invertBackground: initialData?.invertBackground || false,
      title: initialData?.title || '',
      description: initialData?.description || '',
      populateBy: initialData?.populateBy || 'categories',
      categories: initialData?.categories?.map(cat => typeof cat === 'string' ? cat : cat.id) || [],
      // selectedDocs: initialData?.selectedDocs?.map(doc => ({
      //   relationTo: 'products' as const,
      //   value: typeof doc.value === 'string' ? doc.value : doc.value.id
      // })) || [],
      seeMore: initialData?.seeMore || false,
      seeMoreLink: initialData?.seeMoreLink || {
        type: 'reference',
        newTab: false,
        label: '',
        reference: {
          relationTo: 'pages',
          value: '',
        },
      },
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
          fetchAllData('/api/products')
        ])
        
        setCategories(categoriesData)
        setProducts(productsData)
      } catch (error) {
        setError('Não foi possível carregar as categorias e produtos. Por favor, tente novamente.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getComboboxItems = (relationTo: 'categories' | 'products'): ComboboxItem[] => {
    if (relationTo === 'categories') {
      return categories.map(category => ({
        value: category.id,
        label: typeof category.parent === 'object' && category.parent ? 
          `${category.parent.title} > ${category.title}` : 
          category.title
      }))
    }
    return products.map(product => ({
      value: product.id,
      label: `${product.title} (${product.sku || 'No SKU'})`
    }))
  }

  function handleSubmit(data: ProductCarouselFormValues) {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      alert('Form has validation errors. Check console for details.')
    } else {
      onSubmit(data)
    }
  }

  const toggleOpen = (fieldName: string) => {
    setOpenStates(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }

  const getSelectedItemsCount = (fieldName: 'categories' | 'selectedDocs') => {
    const value = form.getValues('categories')
    return Array.isArray(value) ? value.length : 0
  }

  const handleCategorySelect = (currentValue: string, field: any) => {
    const currentValues = field.value || []
    const newValues = currentValues.includes(currentValue)
      ? currentValues.filter(v => v !== currentValue)
      : [...currentValues, currentValue]
    field.onChange(newValues)
  }

  const handleProductSelect = (currentValue: string, field: any) => {
    const currentValues = field.value || []
    const isSelected = currentValues.some(v => v.value === currentValue)
    
    let newValues
    if (isSelected) {
      newValues = currentValues.filter(v => v.value !== currentValue)
    } else {
      newValues = [...currentValues, { 
        relationTo: 'products' as const, 
        value: currentValue 
      }]
    }
    
    field.onChange(newValues)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium">Carrossel de Produtos</h3>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={form.handleSubmit(handleSubmit)}
          className="min-w-[100px]"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                <h3 className="font-bold">Form Validation Errors:</h3>
                <ul className="list-disc pl-5">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>
                      {field}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
            <TitleDescription form={form} />
            {/* <FormField
              control={form.control}
              name="populateBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Popular por</FormLabel>
                  <FormDescription>
                    Escolha como os produtos serão exibidos no carrossel
                  </FormDescription>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="categories" id="categories" />
                        <Label htmlFor="categories">Categorias</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="selection" id="selection" />
                        <Label htmlFor="selection">Seleção Individual</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

           {/* {form.watch('populateBy') === 'categories' ? ( */}
              <FormField
                control={form.control}
                name="categories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categorias</FormLabel>
                    <FormDescription>
                      Selecione as categorias que serão exibidas no carrossel
                    </FormDescription>
                    <Popover 
                      open={openStates['categories']} 
                      onOpenChange={() => toggleOpen('categories')}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openStates['categories']}
                          disabled={isLoading}
                          className="w-full justify-between"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Carregando...
                            </>
                          ) : getSelectedItemsCount('categories') > 0 ? (
                            `${getSelectedItemsCount('categories')} categoria(s) selecionada(s)`
                          ) : (
                            "Selecione as categorias"
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Buscar categoria..." />
                          <CommandList>
                            <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                            <CommandGroup>
                              {getComboboxItems('categories').map((item) => (
                                <CommandItem
                                  key={item.value}
                                  value={item.value}
                                  onSelect={(currentValue) => handleCategorySelect(currentValue, field)}
                                >
                                  <Check className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value?.includes(item.value) ? "opacity-100" : "opacity-0"
                                  )} />
                                  {item.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*
            // ) : (
            //   <FormField
            //     control={form.control}
            //     name="selectedDocs"
            //     render={({ field }) => (
            //       <FormItem>
            //         <FormLabel>Produtos Selecionados</FormLabel>
            //         <FormDescription>
            //           Selecione os produtos que serão exibidos no carrossel
            //         </FormDescription>
            //         <Popover 
            //           open={openStates['selectedDocs']} 
            //           onOpenChange={() => toggleOpen('selectedDocs')}
            //         >
            //           <PopoverTrigger asChild>
            //             <Button
            //               variant="outline"
            //               role="combobox"
            //               aria-expanded={openStates['selectedDocs']}
            //               disabled={isLoading}
            //               className="w-full justify-between"
            //             >
            //               {isLoading ? (
            //                 <>
            //                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            //                   Carregando...
            //                 </>
            //               ) : getSelectedProductsCount() > 0 ? (
            //                 `${getSelectedProductsCount()} produto(s) selecionado(s)`
            //               ) : (
            //                 "Selecione os produtos"
            //               )}
            //               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            //             </Button>
            //           </PopoverTrigger>
            //           <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            //             <Command>
            //               <CommandInput placeholder="Buscar produto ou SKU..." />
            //               <CommandList>
            //                 <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            //                 <CommandGroup>
            //                   {getComboboxItems('products').map((item) => (
            //                     <CommandItem
            //                       key={item.value}
            //                       value={item.value}
            //                       onSelect={(currentValue) => handleProductSelect(currentValue, field)}
            //                     >
            //                       <Check className={cn(
            //                         "mr-2 h-4 w-4",
            //                         isProductSelected(item.value) ? "opacity-100" : "opacity-0"
            //                       )} />
            //                       {item.label}
            //                     </CommandItem>
            //                   ))}
            //                 </CommandGroup>
            //               </CommandList>
            //             </Command>
            //           </PopoverContent>
            //         </Popover>
            //         <FormMessage />
            //       </FormItem>
            //     )}
            //   />
            // )} */}
            <Link form={form} />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
