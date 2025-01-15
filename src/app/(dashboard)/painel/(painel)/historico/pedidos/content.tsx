import { getOldOrders } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { OldOrdersTable } from './_table/old-orders-table'

interface OrdersContentProps {
  orders: ReturnType<typeof getOldOrders>
}

export function OrdersContent({ orders }: OrdersContentProps) {
  return (
    <ContentLayout title='Pedidos antigos'>
      <OldOrdersTable ordersPromise={orders} />
    </ContentLayout>
  )
}
