import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

import { Product } from '@/payload/payload-types'

import { columns } from './(table)/columns'
import { DataTable } from './(table)/data-table'

interface ProductsContentProps {
  products: Product[]
}

export function ProductsContent({ products }: ProductsContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Produtos'
        description='Configure os produtos cadastrados na sua loja.'
      />

      <Separator className='mb-4' />

      <DataTable columns={columns} data={products} />
    </Content>
  )
}
