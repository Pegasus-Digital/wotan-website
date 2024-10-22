import { ptBR } from 'date-fns/locale'
import { formatRelative } from 'date-fns'

import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { UpdateProductForm } from '../_components/update-product-form'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface ProductContentProps {
  product: any
  edit: boolean
}

export function ProductContent({ product, edit }: ProductContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title={`${edit ? 'Editar p' : 'P'}roduto #${product.sku}`}
    //     description={`Criado: ${formatRelative(product.createdAt, new Date(), { locale: ptBR })}`}
    //   />

    //   <Separator className='mb-4' />
    <ContentLayout title={`${edit ? 'Editar p' : 'P'}roduto #${product.sku}`}>
      <UpdateProductForm currentProduct={product} edit={!edit} />
    </ContentLayout>
  )
}
