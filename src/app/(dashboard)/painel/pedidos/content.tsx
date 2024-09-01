import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'

import { OrdersTable } from './(table)/orders-table'

import { getOrders } from './_logic/queries'

interface OrdersContentProps {
  orders: ReturnType<typeof getOrders>
}

export function OrdersContent({ orders }: OrdersContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Pedidos'
        description='Visualize e gerencie os pedidos da sua loja.'
      />

      <Separator className='mb-4' />

      <OrdersTable ordersPromise={orders} />
    </Content>
  )
}
