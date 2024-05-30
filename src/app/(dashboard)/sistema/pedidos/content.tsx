import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

import { OrdersTable } from './(table)/orders-table'

import { getEstimates } from './_logic/queries'

interface OrdersContentProps {
  estimates: ReturnType<typeof getEstimates>
}

export function OrdersContent({ estimates }: OrdersContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Pedidos'
        description='Visualize e gerencie os pedidos da sua loja.'
      />

      <Separator className='mb-4' />

      <OrdersTable ordersPromise={estimates} />
    </Content>
  )
}
