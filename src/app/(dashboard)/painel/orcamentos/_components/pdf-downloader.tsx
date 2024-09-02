'use client'

import dynamic from 'next/dynamic'

import { BudgetDocument } from '@/lib/pdf-generator/templates/budget'

import { LoadingSpinner } from '@/components/spinner'
import { Budget } from '@/payload/payload-types'
import { Button } from '@/pegasus/button'
import { Printer } from 'lucide-react'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
)

interface BudgetDocumentDownloaderProps {
  budget: Budget
}

export function BudgetDocumentDownloader({
  budget,
}: BudgetDocumentDownloaderProps) {
  return (
    <PDFDownloadLink
      document={<BudgetDocument budget={budget} />}
      fileName={`Orcamento_n${budget.incrementalId}.pdf`}
    >
      <Button size='icon' variant='ghost' type='button'>
        <Printer className='h-5 w-5' />
      </Button>
    </PDFDownloadLink>
  )
}
