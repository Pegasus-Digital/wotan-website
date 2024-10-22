'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { Category } from '@/payload/payload-types'

import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { createCategory } from '../_logic/actions'
import { createCategorySchema } from '../_logic/validations'

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
      active: false,
    },
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof createCategorySchema>) {
    const { title, parent, active } = values

    const hasNoParent = values.parent === 'base' || values.parent === ''

    const response = hasNoParent
      ? await createCategory({ title, parent: '', active: false })
      : await createCategory({ title, parent, active })

    if (response.status === true) {
      toast.success(response.message)

      setOpen(false)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className='grid h-full grid-cols-1 gap-2'>
          <FormField
            name='title'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>

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
                    <SelectItem value='base'>
                      Sem categoria (Nova base)
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormDescription>
                  Este campo define o aninhamento das categorias. Limitação de 5
                  categorias superiores.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='active'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center gap-1'>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    name='Ativa'
                  />
                  <FormLabel>Ativa</FormLabel>
                </div>
                <FormDescription>
                  Este campo define se a categoria está ativa no site.
                </FormDescription>
              </FormItem>
            )}
          />

          <Button disabled={isSubmitting} type='submit'>
            Criar categoria
          </Button>
        </section>
      </form>
    </Form>
  )
}
