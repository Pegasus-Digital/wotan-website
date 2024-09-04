'use client'

import dynamic from 'next/dynamic'

import { BudgetDocument } from '@/lib/pdf-generator/templates/budget'

import { Budget } from '@/payload/payload-types'
import { Button } from '@/components/ui/button'

import { Icons } from '@/components/icons'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button variant='outline' className='w-full' disabled>
        <Icons.Loader className='mr-2 animate-spin' />
        Baixar PDF
      </Button>
    ),
  },
)

interface BudgetDocumentDownloaderProps {
  budget: Budget
}

export function BudgetDocumentDownloader({
  budget,
}: BudgetDocumentDownloaderProps) {
  return (
    <>
      <PDFDownloadLink
        document={<BudgetDocument budget={budget} />}
        fileName={`Orcamento_n${budget.incrementalId}.pdf`}
      >
        {({ url, loading }) =>
          loading ? (
            <Button variant='outline' className='w-full' disabled>
              <Icons.Loader className='mr-2 animate-spin' />
              Baixar PDF
            </Button>
          ) : (
            <Button variant='outline' className='w-full'>
              <Icons.Download className='mr-2' />
              Baixar PDF
            </Button>
          )
        }
      </PDFDownloadLink>
    </>
  )
}
