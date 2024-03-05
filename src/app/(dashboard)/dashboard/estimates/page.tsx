import { Metadata } from 'next'
import { EstimatesContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Orçamentos',
}

export default async function Estimates() {
  return <EstimatesContent />
}
