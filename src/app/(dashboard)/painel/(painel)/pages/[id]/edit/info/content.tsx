'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'
import { useEffect, useState } from 'react'

import { Page } from '@/payload/payload-types'
import { toast } from 'sonner'
import { Icons } from '@/components/icons'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { updatePage } from '../../../_logic/actions'

const updatePageSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional(),
  slug: z.string().min(1, 'O slug é obrigatório'),
  meta: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.union([z.string(), z.any()]).optional(),
  }),
  _status: z.enum(['draft', 'published']),
})

type UpdatePageFormValues = z.infer<typeof updatePageSchema>

interface EditPageContentProps {
  pageId: string
  initialData: Page
}

export function EditPageContent({ pageId, initialData }: EditPageContentProps) {
  const [changedFields, setChangedFields] = useState<Record<string, any>>({})
  const [currentPage, setCurrentPage] = useState<Page>(initialData)

  const form = useForm<UpdatePageFormValues>({
    resolver: zodResolver(updatePageSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description || '',
      slug: initialData.slug || '',
      meta: {
        title: initialData.meta?.title || '',
        description: initialData.meta?.description || '',
        image: initialData.meta?.image || '',
      },
      _status: initialData._status || 'draft',
    },
  })

  const { isSubmitting } = useFormState(form)

  // Track form changes
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name) {
        const currentValue = form.getValues(name as any)
        const originalValue = currentPage?.[name as keyof Page]
        
        // Handle nested fields (meta)
        if (name.startsWith('meta.')) {
          const metaField = name.split('.')[1]
          const originalMetaValue = currentPage?.meta?.[metaField as keyof typeof currentPage.meta]
          
          if (JSON.stringify(currentValue) !== JSON.stringify(originalMetaValue)) {
            setChangedFields(prev => ({
              ...prev,
              meta: {
                ...prev.meta,
                [metaField]: currentValue
              }
            }))
          } else {
            setChangedFields(prev => {
              const newFields = { ...prev }
              if (newFields.meta) {
                delete newFields.meta[metaField]
                if (Object.keys(newFields.meta).length === 0) {
                  delete newFields.meta
                }
              }
              return newFields
            })
          }
        } else {
          // Handle regular fields
          if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
            setChangedFields(prev => ({
              ...prev,
              [name]: currentValue
            }))
          } else {
            setChangedFields(prev => {
              const newFields = { ...prev }
              delete newFields[name]
              return newFields
            })
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [form, currentPage])

  async function onSubmit(data: UpdatePageFormValues) {
    try {
      // Only send changed fields
      await updatePage(pageId, changedFields as Partial<Page>)
      toast.success('Página atualizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar página')
    }
  }

  return (
    <ContentLayout 
      title="Editar Informações e SEO"
      navbarButtons={
        <Button
          type='submit'
          disabled={isSubmitting}
          onClick={form.handleSubmit(onSubmit)}
          variant='default'
        >
          <Icons.Save className='mr-2 h-5 w-5' /> Salvar
        </Button>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Informações básicas da página
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                name='title'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Título da página'
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
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Descrição da página'
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='slug-da-pagina'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                Configurações para otimização de mecanismos de busca
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                name='meta.title'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título (SEO)</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='Título para SEO'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Título que aparecerá nos resultados de busca
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='meta.description'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (SEO)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Descrição para SEO'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Descrição que aparecerá nos resultados de busca
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='meta.image'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem (SEO)</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='URL da imagem'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Imagem que será exibida quando a página for compartilhada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </ContentLayout>
  )
} 