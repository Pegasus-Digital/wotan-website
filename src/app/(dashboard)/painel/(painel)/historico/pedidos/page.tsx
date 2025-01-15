import { OrdersContent } from './content'

import { ISearchParams, searchParamsSchema } from '@/lib/validations'

import { getOldOrders } from './_logic/queries'


export const metadata = {
  title: 'Novo pedido',
}

interface OrdersPageProps {
  searchParams: ISearchParams
}

export default async function Orders({ searchParams }: OrdersPageProps) {
  const search = searchParamsSchema.parse(searchParams)

  const ordersPromise = getOldOrders(search)

  return <OrdersContent orders={ordersPromise} />
}
