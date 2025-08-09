import { ProductsTable } from './(table)/products-table'

import { getProducts } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface ProductsContentProps {
  products: ReturnType<typeof getProducts>
}

export function ProductsContent({ products }: ProductsContentProps) {
  return (
    <ContentLayout title='Produtos'>
      <ProductsTable productsPromise={products} />
    </ContentLayout>
  )
}
