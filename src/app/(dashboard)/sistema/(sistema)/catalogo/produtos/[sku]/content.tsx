import { ptBR } from 'date-fns/locale'
import { formatRelative } from 'date-fns'

import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { UpdateProductForm } from '../_components/update-product-form'
import { ContentLayoutSales } from '@/components/painel-sistema/content-layout'

interface ProductContentProps {
  product: any
  edit: boolean
}

export function ProductContent({ product, edit }: ProductContentProps) {
  return (
    <UpdateProductForm currentProduct={product} edit={!edit} />
  )
}
