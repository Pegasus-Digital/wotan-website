import { Metadata } from 'next'
import { DashboardContent } from './content'
import { getDashboardData } from '@/app/(dashboard)/painel/(painel)/(home)/_logic/data'

// Force dynamic rendering for admin pages
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Início',
}

export default async function Dashboard() {
  const { orders, budgets } = await getDashboardData()

  return <DashboardContent orders={orders} budgets={budgets} />
}
