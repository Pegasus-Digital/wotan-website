'use client'

import dynamic from 'next/dynamic'

import { ptBR } from 'date-fns/locale'
import { formatRelative } from 'date-fns'
import { OrderDocument } from '@/lib/pdf-generator/templates/order'
import { BudgetDocument } from '@/lib/pdf-generator/templates/budget'
import { ProductionDocument } from '@/lib/pdf-generator/templates/production'

import { LoadingSpinner } from '@/components/spinner'
import { Content, ContentHeader } from '@/components/content'

import { Budget } from '@/payload/payload-types'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
)

interface BudgetDocumentContentProps {
  budget: Budget
}

export function BudgetDocumentContent({ budget }: BudgetDocumentContentProps) {
  return (
    <Content className='flex flex-col'>
      <ContentHeader
        title={`Orçamento n° ${budget.incrementalId}`}
        description={`Gerado em ${formatRelative(budget.updatedAt, new Date(), { locale: ptBR })}`}
      />
      <PDFViewer
        className='mt-2 w-full flex-1 animate-fade-in'
        showToolbar={false}
      >
        <BudgetDocument budget={budget} />
      </PDFViewer>

      {/* TODO: Remover depois de mostrar pra Wotan e coletar opinião */}

      {/* <PDFViewer className='h-full w-full animate-fade-in'>
        <ProductionDocument />
      </PDFViewer> */}

      {/* <PDFViewer className='h-full w-full animate-fade-in'>
        <OrderDocument />
      </PDFViewer> */}
    </Content>
  )
}