'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { Category } from '@/payload/payload-types'

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

import { Button } from '@/pegasus/button'
import { Input } from '@/components/ui/input'

import { createCategory } from '../_logic/actions'

const createCategorySchema = z.object({
  title: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  parent: z.string().optional(),
})

interface CreateCategoryFormProps {
  categories: Category[]
  setOpen: (state: boolean) => void
}

export function CreateCategoryForm({
  categories,
  setOpen,
}: CreateCategoryFormProps) {
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      title: '',
      parent: 'base',
    },
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof createCategorySchema>) {
    const { title, parent } = values

    const hasNoParent = values.parent === 'base' || values.parent === ''

    const response = hasNoParent
      ? await createCategory({ title, parent: '' })
      : await createCategory({ title, parent })

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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className='grid h-full grid-cols-1'>
          <FormField
            name='title'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>

                <FormControl>
                  <Input
                    type='text'
                    placeholder='Nome da categoria'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='parent'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parentesco</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o parentesco da categoria' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side='bottom'>
                    <SelectItem value='base'>Categoria base</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormDescription>
                  Este campo define o aninhamento das categorias. Evite aninhar
                  demasiadamente.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type='submit' className='mt-4'>
            Criar categoria
          </Button>
        </section>
      </form>
    </Form>
  )
}
