import { Metadata } from 'next'
import { DashboardContent } from './content'
import { getDashboardData } from './_logic/data'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Dashboard() {
  const { orders, budgets } = await getDashboardData()

  return <DashboardContent orders={orders} budgets={budgets} />
}
