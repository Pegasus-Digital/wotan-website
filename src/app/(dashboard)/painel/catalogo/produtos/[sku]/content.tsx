import { ptBR } from 'date-fns/locale'
import { formatRelative } from 'date-fns'

import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { UpdateProductForm } from '../_components/update-product-form'

interface ProductContentProps {
  product: any
  edit: boolean
}

export function ProductContent({ product, edit }: ProductContentProps) {
  return (
    <Content>
      <ContentHeader
        title={`${edit ? 'Editar p' : 'P'}roduto #${product.sku}`}
        description={`Criado: ${formatRelative(product.createdAt, new Date(), { locale: ptBR })}`}
      />
      <Separator className='mb-4' />

      <UpdateProductForm currentProduct={product} edit={!edit} />
    </Content>
  )
}
