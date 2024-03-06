import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { DataTable } from './(table)/data-table'
import { columns } from './(table)/columns'
import { Product } from '@/payload/payload-types'

interface CatalogContentProps {
  products: Product[]
}

export function CatalogContent({ products }: CatalogContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Catálogo'
        description='Configure os produtos da sua loja.'
      />

      <Separator className='mb-4' />

      <Tabs defaultValue='products'>
        <TabsList>
          <TabsTrigger value='products'>Produtos</TabsTrigger>
          <TabsTrigger value='categories'>Categorias</TabsTrigger>
        </TabsList>
        <TabsContent value='products'>
          <DataTable columns={columns} data={products} />
        </TabsContent>
        <TabsContent value='categories'>
          Faça mudanças às suas categorias aqui.
        </TabsContent>
      </Tabs>
    </Content>
  )
}
