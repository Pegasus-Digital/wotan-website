import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

import { ProductsTable } from './(table)/products-table'

import { getProducts } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface ProductsContentProps {
  products: ReturnType<typeof getProducts>
}

export function ProductsContent({ products }: ProductsContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Produtos'
    //     description='Configure os produtos cadastrados na sua loja.'
    //   />

    //   <Separator className='mb-4' />
    <ContentLayout title='Produtos'>
      <ProductsTable productsPromise={products} />
    </ContentLayout>
  )
}
