'use client'

import dynamic from 'next/dynamic'

import { OrderDocument } from '@/lib/pdf-generator/templates/order'

import { Content, ContentHeader } from '@/components/content'
import { LoadingSpinner } from '@/components/spinner'
import { Order } from '@/payload/payload-types'
import { ProductionDocument } from '@/lib/pdf-generator/templates/production'
import { formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'

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
    <Content className='flex flex-col'>
      <ContentHeader
        title={`Orçamento n° ${order.incrementalId}`}
        description={`Gerado em ${formatRelative(order.updatedAt, new Date(), { locale: ptBR })}`}
      />
      <PDFViewer
        className='mt-2 w-full flex-1 animate-fade-in'
        showToolbar={false}
      >
        <OrderDocument order={order} />
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