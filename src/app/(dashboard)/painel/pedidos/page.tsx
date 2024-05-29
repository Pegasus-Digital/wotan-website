import { Metadata } from 'next'
import { OrdersContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Pedidos',
}

export default async function Orders() {
  return <OrdersContent />
}
