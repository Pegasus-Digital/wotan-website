import { Separator } from '@/components/ui/separator'
import { Small } from '@/components/typography/texts'
import { Content, ContentHeader } from '@/components/content'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { EstimatesTable } from './(table)/estimates-table'

import { getEstimates } from './_logic/queries'

interface EstimatesContentProps {
  estimates: ReturnType<typeof getEstimates>
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
          <EstimatesTable estimatesPromise={estimates} />
        </TabsContent>

        <TabsContent value='interactive'>
          {/* <div className='grid grid-cols-dashboard gap-2'>
            <div className='rounded-sm border'>
              <EstimateCard />
            </div>
            <div className='flex-1 bg-blue-300'>b</div>
          </div> */}
        </TabsContent>
      </Tabs>
    </Content>
  )
}

interface EstimateCardProps {}

function EstimateCard() {
  return <div>a</div>
}
