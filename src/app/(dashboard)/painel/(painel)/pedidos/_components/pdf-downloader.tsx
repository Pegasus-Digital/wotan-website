'use client'

import dynamic from 'next/dynamic'

import { OrderDocument } from '@/lib/pdf-generator/templates/order'

import { LoadingSpinner } from '@/components/spinner'
import { Order } from '@/payload/payload-types'
import { Button } from '@/pegasus/button'
import { Download, Loader2, Printer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button variant='outline' className='w-full' disabled>
        <Loader2 className='mr-2 animate-spin' />
        Baixar PDF
      </Button>
    ),
  },
)

interface OrderDocumentDownloaderProps {
  order: Order
}

export function OrderDocumentDownloader({
  order,
}: OrderDocumentDownloaderProps) {
  return (
    <>
      <PDFDownloadLink
        document={<OrderDocument order={order} />}
        fileName={`Pedido_n${order.incrementalId}.pdf`}
      >
        {({ url, loading }) =>
          loading ? (
            <Button variant='outline' className='w-full' disabled>
              <Loader2 className='mr-2 animate-spin' />
              Baixar PDF
            </Button>
          ) : (
            <Button variant='outline' className='w-full'>
              <Download className='mr-2' />
              Baixar PDF
            </Button>
          )
        }
      </PDFDownloadLink>
    </>
  )
}
