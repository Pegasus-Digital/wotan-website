'use client'

import dynamic from 'next/dynamic'

import { OrderDocument } from '@/lib/pdf-generator/templates/order'

import { LoadingSpinner } from '@/components/spinner'
import { Layout, Order } from '@/payload/payload-types'
import { Button } from '@/pegasus/button'
import { Download, Loader2, Printer } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProductionDocument } from '@/lib/pdf-generator/templates/production'

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

interface LayoutDocumentDownloaderProps {
  order: Order
  layoutId: Layout['id']
}

export function LayoutDocumentDownloader({
  order,
  layoutId,
}: LayoutDocumentDownloaderProps) {
  const item = order.itens.find((item) => {
    if (
      (typeof item.layout === 'object' ? item.layout.id : item.layout) ===
      layoutId
    ) {
      return {
        ...item,
      }
    }
    return null
  })

  return (
    <>
      <PDFDownloadLink
        document={<ProductionDocument layoutItem={item} order={order} />}
        fileName={`Planilha_producao_pedido_n${order.incrementalId}_produto_${item && typeof item.product === 'object' ? item.product.sku : item.product}.pdf`}
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
