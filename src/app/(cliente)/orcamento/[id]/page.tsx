import { notFound } from 'next/navigation'

import { ClientBudgetContent } from './content'

import { getBudgetById } from '../../_logic/queries'

export const metadata = {
  title: 'Visualizando orçamento',
}
export default async function ClientBudgetPage({ params: { id } }) {
  const budget = await getBudgetById({ id })

  if (!budget.data) {
    notFound()
  }

  return <ClientBudgetContent budget={budget.data} showToolbar />
}
