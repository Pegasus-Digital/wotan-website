import { Metadata } from 'next'
import { DashboardContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Início',
}

export default async function Dashboard() {
  return <DashboardContent />
}
