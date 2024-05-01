'use client'

import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

import type { Page } from '@/payload/payload-types'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { UpdatePageForm } from './_components/update-page-form'

interface EditPageContentProps {
  page: Page
}

export function EditPageContent({ page }: EditPageContentProps) {
  // console.log({ page })
  return (
    <Content>
      <ContentHeader
        title={`Editando ${page.title}`}
        description={`Ultima atualização: ${format(page.updatedAt, 'dd/MM/yyyy HH:mm', { locale: ptBR })}`}
      />

      <Separator className='mb-4' />

      <UpdatePageForm currentPage={page} />
    </Content>
  )
}
