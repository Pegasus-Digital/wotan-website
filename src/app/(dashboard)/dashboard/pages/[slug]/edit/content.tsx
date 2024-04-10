import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'

import type { Page } from '@/payload/payload-types'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import Statistics, {
  statisticSectionSchema,
} from './_components/statistics-section'
import { faqSchema } from './_components/z-sections'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const sectionEdits = {
  // 'product-carousel': ProductSlider,
  // 'featured-section': FeaturedGrid,
  'statistic-section': Statistics,
  // 'content-section': ContentSection,
  // 'client-grid': ClientGrid,
  // 'content-media': ContentMedia,
  // 'faq-section': FAQ,
  // 'three-columns': ThreeColumns,
  // 'timeline-section': Timeline,
}

const page = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  publishedOn: z.string().optional().nullable(),
  layout: z.array(z.union([statisticSectionSchema, faqSchema])),
  slug: z.string().optional().nullable(),
  updatedAt: z.string(),
  createdAt: z.string(),
  _status: z.union([z.literal('draft'), z.literal('published')]).optional(),
})

export function EditPageContent({
  title,
  updatedAt,
  slug,
  description,
  carousel,
  layout,
}: Page) {
  const form = useForm<z.infer<typeof page>>({
    resolver: zodResolver(page),
  })

  async function onSubmit(values: z.infer<typeof page>) {}

  return (
    <Content>
      <ContentHeader
        title={`Editando ${title}`}
        description={`Ultima atualização: ${format(updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}`}
      />

      <Separator className='mb-4' />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-2'
        >
          <Input value={title} className='font-bold' />
          {slug === 'home' ? <div></div> : <Textarea value={description} />}
          {layout.map((section, index) => {
            if (section.blockType && section.blockType in sectionEdits) {
              const Block = sectionEdits[section.blockType]
              return <Block key={index} {...section} />
            }
          })}
        </form>
      </Form>
    </Content>
  )
}
