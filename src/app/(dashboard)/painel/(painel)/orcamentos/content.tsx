import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

import { EstimatesTable } from './(table)/estimates-table'

import { getEstimates } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface EstimatesContentProps {
  estimates: ReturnType<typeof getEstimates>
}

export function EstimatesContent({ estimates }: EstimatesContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Orçamentos'
    //     description='Visualize e gerencie os orçamentos da sua loja.'
    //   />

    // <Separator className='mb-4' />
    <ContentLayout title='Orçamentos'>
      <EstimatesTable estimatesPromise={estimates} />
    </ContentLayout>
  )
}
