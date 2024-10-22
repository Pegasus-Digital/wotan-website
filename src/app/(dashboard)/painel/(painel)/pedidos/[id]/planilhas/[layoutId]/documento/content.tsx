'use client'

import dynamic from 'next/dynamic'

import { OrderDocument } from '@/lib/pdf-generator/templates/order'

import { Content, ContentHeader } from '@/components/content'
import { LoadingSpinner } from '@/components/spinner'
import { Layout, Order } from '@/payload/payload-types'
import { ProductionDocument } from '@/lib/pdf-generator/templates/production'
import { formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
)

interface LayoutDocumentContentProps {
  order: Order
  layoutId: Layout['id']
}

export function LayoutDocumentContent({
  order,
  layoutId,
}: LayoutDocumentContentProps) {
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
    // <Content className='flex flex-col'>
    //   <ContentHeader
    //     title={`Planilha de produção`}
    //     description={`Gerado em ${formatRelative(order.updatedAt, new Date(), { locale: ptBR })}`}
    //   />
    <ContentLayout title={`Planilha de produção`}>
      <PDFViewer
        className='mt-2 w-full flex-1 animate-fade-in'
        showToolbar={false}
      >
        <ProductionDocument layoutItem={item} order={order} />
      </PDFViewer>
    </ContentLayout>
  )
}
