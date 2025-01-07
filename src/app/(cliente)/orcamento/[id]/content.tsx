'use client'

import dynamic from 'next/dynamic'

import { Budget } from '@/payload/payload-types'

import { LoadingSpinner } from '@/components/spinner'
import { BudgetDocument } from '@/lib/pdf-generator/templates/budget'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
)

interface BudgetDocumentContentProps {
  budget: Budget
  showToolbar?: boolean
}

export function ClientBudgetContent({
  budget,
  showToolbar = false,
}: BudgetDocumentContentProps) {
  return (
    <PDFViewer
      className='min-h-[100vh] w-full flex-1 animate-fade-in'
      showToolbar={showToolbar}
    >
      <BudgetDocument budget={budget} />
    </PDFViewer>
  )
}
