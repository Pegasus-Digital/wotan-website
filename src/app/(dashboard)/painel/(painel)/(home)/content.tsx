import { formatBRL } from '@/lib/format'

import { Separator } from '@/components/ui/separator'
import { Card, CardHeader } from '@/components/ui/card'
import { Content, ContentHeader } from '@/components/content'

import { Large, Small } from '@/components/typography/texts'
import { Heading } from '@/pegasus/heading'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

export function DashboardContent() {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Dashboard'
    //     description='Analise com facilidade as recentes movimentações.'
    //   />
    <ContentLayout title='Dashboard'>
      {/* <Separator className='mb-4' /> */}

      <section className='space-y-2.5'>
        <Heading variant='h4'>Últimos 30 dias</Heading>

        <div className='flex gap-2.5'>
          <Card className='flex flex-1 items-center justify-center shadow-md'>
            <CardHeader className='flex flex-col items-center'>
              <Large>Receita esperada</Large>
              <Small>{formatBRL(1200)} em 25 pedidos pendentes</Small>
            </CardHeader>
          </Card>

          <Card className='flex flex-1 items-center justify-center shadow-md'>
            <CardHeader className='flex flex-col items-center'>
              <Large>Receita confirmada</Large>
              <Small>{formatBRL(1200)} em 12 pedidos completos</Small>
            </CardHeader>
          </Card>
        </div>
      </section>
    </ContentLayout>
    // </Content>
  )
}
