'use client'

import { useEffect, useState } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { NestedCategory, nestCategories } from '@/lib/category-hierarchy'

import { toast } from 'sonner'

import { Category, Product } from '@/payload/payload-types'

import { Icons } from '@/components/icons'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { bulkUpdateProductSchema } from '../_logic/validations'
import { bulkUpdateProductCategories } from '../_logic/actions'

interface BulkUpdateProductFormProps {
  products: Product[]
  setOpen: (open: boolean) => void
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export function BulkUpdateProductForm({
  products,
  setOpen,
}: BulkUpdateProductFormProps) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)

      try {
        const response = await fetch(`/api/all-categories`)
        const data = await response.json()

        await setCategories(data)
      } catch (error) {
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const form = useForm<z.infer<typeof bulkUpdateProductSchema>>({
    resolver: zodResolver(bulkUpdateProductSchema),
    defaultValues: { categories: [] },
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof bulkUpdateProductSchema>) {
    const { categories } = values

    toast.message(`Aguarde, atualizando ${products.length} produtos.`)

    const response = await bulkUpdateProductCategories(products, {
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
        <section className='grid grid-cols-2 gap-2.5'>
          <ScrollArea className='col-span-2 max-h-[440px] w-full rounded-lg border p-2'>
            <FormField
              name='categories'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {field.value.length > 0 && (
                    <>
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
                    </>
                  )}

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
            <Icons.Edit className='mr-2 h-5 w-5' />
            Atualizar produtos
          </Button>
        </section>
      </form>
    </Form>
  )
}

interface CategoryListProps {
  categories: NestedCategory[]
  field: any
  set: (name: string, value: any) => void
}

export function CategoryList({ categories, field, set }: CategoryListProps) {
  return (
    <div className='space-y-2'>
      {categories.map((category) => (
        <CategoryCheckbox
          key={category.id}
          category={category}
          field={field}
          set={set}
        />
      ))}
    </div>
  )
}

interface CategoryCheckboxProps {
  category: NestedCategory
  field: any
  set: (name: string, value: any) => void
}

export function CategoryCheckbox({
  category,
  field,
  set,
}: CategoryCheckboxProps) {
  function handleCheckedChange(id: string, state: boolean) {
    state
      ? field.value.push(id)
      : (field.value = field.value.filter(
          (categoryId: any) => categoryId !== id,
        ))

    set('categories', field.value)
  }

  return (
    <div className='ml-4 space-y-2'>
      <div className='group flex items-center gap-1.5'>
        <Checkbox
          id={category.id}
          name={category.title}
          value={category.id}
          onCheckedChange={(state) => handleCheckedChange(category.id, !!state)}
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
          field={field}
          set={set}
        />
      ))}
    </div>
  )
}
