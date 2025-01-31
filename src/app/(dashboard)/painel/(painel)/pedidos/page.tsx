import { OrdersContent } from './content'

import { ISearchParams, ordersParamsSchema } from '@/lib/validations'

import { getOrders } from './_logic/queries'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata = {
  title: 'Novo pedido',
}

interface OrdersPageProps {
  searchParams: ISearchParams
}

export default async function Orders({ searchParams }: OrdersPageProps) {
  const search = ordersParamsSchema.parse(searchParams)

  const ordersPromise = getOrders(search)

  return <OrdersContent orders={ordersPromise} />
}
