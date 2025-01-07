'use client'

import dynamic from 'next/dynamic'

import { Layout, Order } from '@/payload/payload-types'

import { LoadingSpinner } from '@/components/spinner'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { ProductionDocument } from '@/lib/pdf-generator/templates/production'

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
    <ContentLayout title={`Planilha de produção`}>
      <PDFViewer
        className='min-h-[90vh] w-full flex-1 animate-fade-in'
        showToolbar={false}
      >
        <ProductionDocument layoutItem={item} order={order} />
      </PDFViewer>
    </ContentLayout>
  )
}
