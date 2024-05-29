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

import { updateCategory } from '../_logic/actions'
import { updateCategorySchema } from '../_logic/validations'
import { Checkbox } from '@/components/ui/checkbox'


interface UpdateCategoryFormProps {
  currentCategory: Category
  categories: Category[]
  setOpen: (state: boolean) => void
}

export function UpdateCategoryForm({
  currentCategory,
  categories,
  setOpen,
}: UpdateCategoryFormProps) {
  const currentCategoryParentId = currentCategory.parent
    ? typeof currentCategory.parent === 'object'
      ? currentCategory.parent.id
      : 'base'
    : 'base'

  const form = useForm<z.infer<typeof updateCategorySchema>>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      title: currentCategory.title,
      slug: currentCategory.slug,
      parent: currentCategoryParentId,
      active: currentCategory.active,
    },
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof updateCategorySchema>) {
    const { title, parent, slug, active } = values

    const hasNoParent = values.parent === 'base' || values.parent === ''

    const response = await updateCategory({
      ...currentCategory,
      title,
      parent: hasNoParent ? '' : parent,
      slug,
      active,
    })

    if (response.status === true) {
      toast.success(response.message)
      setOpen(false)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  const handleSlugChange = (event: any) => {
    const inputValue = event.target.value
    const lastChar = inputValue.slice(-1) // Get the last character entered

    if (!lastChar) {
      form.setValue('slug', '')
    }

    // Check if the last character is valid (lowercase letter, number, or hyphen)
    if (/^[a-z0-9-]$/.test(lastChar)) {
      if (lastChar === '-' && inputValue.endsWith('--')) return
      form.setValue('slug', inputValue)
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
            name='slug'
            control={form.control}
            render={({ field: { onChange, ...props } }) => (
              <FormItem>
                <FormLabel>Slug (SEO)</FormLabel>

                <FormControl>
                  <Input
                    type='text'
                    pattern='^[a-z0-9]+(?:-[a-z0-9]+)*$'
                    onChange={handleSlugChange}
                    {...props}
                  />
                </FormControl>

                <FormDescription>
                  Este campo influencia a maneira como os mecanismos de busca
                  avaliam o site.
                </FormDescription>

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

                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o parentesco da categoria' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    defaultValue={currentCategoryParentId}
                    side='bottom'
                  >
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
                  Este campo define o aninhamento das categorias. Evite aninhar
                  demasiadamente.
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
            Atualizar categoria
          </Button>
        </section>
      </form>
    </Form>
  )
}
