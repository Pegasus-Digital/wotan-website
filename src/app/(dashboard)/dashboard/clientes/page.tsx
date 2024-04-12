import { Metadata } from 'next'
import { CustomersContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Clientes',
}

export default async function Customers() {
  return <CustomersContent />
}
