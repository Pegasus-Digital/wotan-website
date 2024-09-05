import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

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

      <EstimatesTable estimatesPromise={estimates} />
    </Content>
  )
}
