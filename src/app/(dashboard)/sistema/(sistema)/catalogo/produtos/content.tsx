import { getProducts } from './_logic/queries'
import { ProductsTable } from './(table)/products-table'
import { ContentLayoutSales } from '@/components/painel-sistema/content-layout'

interface ProductsContentProps {
  products: ReturnType<typeof getProducts>
}

export function ProductsContent({ products }: ProductsContentProps) {
  return (
    <ContentLayoutSales title='Produtos'>
      <ProductsTable productsPromise={products} />
    </ContentLayoutSales>
  )
}
