'use client'

import { useEffect, useState } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { nestCategories } from '@/lib/category-hierarchy'

import { toast } from 'sonner'

import { Category, Product } from '@/payload/payload-types'

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { CategoryList } from './category-list'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { ScrollArea } from '@/components/ui/scroll-area'

import { Pencil } from 'lucide-react'

import { bulkUpdateProductCategories } from '../_logic/actions'
import { bulkUpdateProductSchema } from '../_logic/validations'

interface BulkUpdateProductFormProps {
  products: Product[]
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export function BulkUpdateProductForm({
  products,
}: BulkUpdateProductFormProps) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true)

      try {
        const response = await fetch(`/api/all-categories`)
        const data = await response.json()

        // console.log(data)
        await setCategories(data)
      } catch (error) {
        toast.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  console.log(categories)

  const form = useForm<z.infer<typeof bulkUpdateProductSchema>>({
    resolver: zodResolver(bulkUpdateProductSchema),
    defaultValues: {},
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof bulkUpdateProductSchema>) {
    const { categories } = values
    const response = await bulkUpdateProductCategories({
      // sku,
      categories,
    })
    if (response.status === true) {
      toast.success(response.message)
      // setOpen(false)
    }
    if (response.status === false) {
      toast.error(response.message)
      // setOpen(false)
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
                  {/* {field.value.length > 0 && (
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
                    )} */}

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
            <Pencil className='mr-2 h-5 w-5' />
            Atualizar produtos
          </Button>
        </section>
      </form>
    </Form>
  )
}
