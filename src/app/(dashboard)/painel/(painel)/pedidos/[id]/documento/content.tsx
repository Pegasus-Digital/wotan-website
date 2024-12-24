'use client'

import dynamic from 'next/dynamic'

import { Order } from '@/payload/payload-types'

import { LoadingSpinner } from '@/components/spinner'
import { OrderDocument } from '@/lib/pdf-generator/templates/order'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
)

interface OrderDocumentContentProps {
  order: Order
}

export function OrderDocumentContent({ order }: OrderDocumentContentProps) {
  return (
    <ContentLayout title={`Pedido n° ${order.incrementalId}`}>
      <PDFViewer
        className='min-h-[90vh] w-full flex-1 animate-fade-in'
        showToolbar={false}
      >
        <OrderDocument order={order} />
      </PDFViewer>
    </ContentLayout>
  )
}
