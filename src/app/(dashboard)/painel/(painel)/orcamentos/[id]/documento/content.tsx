'use client'

import dynamic from 'next/dynamic'

import { Budget } from '@/payload/payload-types'

import { LoadingSpinner } from '@/components/spinner'
import { BudgetDocument } from '@/lib/pdf-generator/templates/budget'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

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
    <ContentLayout title={`Orçamento n° ${budget.incrementalId}`}>
      <PDFViewer
        className='min-h-[90vh] w-full flex-1 animate-fade-in'
        showToolbar={false}
      >
        <BudgetDocument budget={budget} />
      </PDFViewer>
    </ContentLayout>
  )
}
