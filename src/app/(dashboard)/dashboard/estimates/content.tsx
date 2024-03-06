import { Small } from '@/components/typography/texts'

import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Product } from '@/payload/payload-types'
import { DataTable } from './(table)/data-table'
import { columns } from './(table)/columns'

export interface EstimateItem {
  amount: number
  product: Product
}

export interface Estimate {
  id: string

  items: EstimateItem[]

  clientName: string
  clientId: string

  representativeName: string
  representativeId: string
}

interface EstimatesContentProps {
  estimates: Estimate[]
}

export function EstimatesContent({ estimates }: EstimatesContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Orçamentos'
        description='Visualize e gerencie os orçamentos da sua loja.'
      />

      <Separator className='mb-4' />

      <Tabs defaultValue='table'>
        <Small className='mr-2 inline'>Modos:</Small>

        <TabsList>
          <TabsTrigger value='table'>Tabela</TabsTrigger>
          <TabsTrigger value='interactive'>Interativo</TabsTrigger>
        </TabsList>

        <TabsContent value='table'>
          <DataTable columns={columns} data={estimates} />
        </TabsContent>

        <TabsContent value='interactive'>
          <div className='grid grid-cols-dashboard gap-2'>
            {/* Select */}
            <div className='rounded-sm border'>
              <EstimateCard />
            </div>
            {/*  */}
            <div className='flex-1 bg-blue-300'>b</div>
          </div>
        </TabsContent>
      </Tabs>
    </Content>
  )
}

interface EstimateCardProps {}

function EstimateCard() {
  return <div>a</div>
}
