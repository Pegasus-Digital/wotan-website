import { getOldBudgets } from './_logic/queries'
import { ContentLayoutSales } from '@/components/painel-sistema/content-layout'
import { OldBudgetsTable } from './_table/old-budgets-table'

interface EstimatesContentProps {
  estimates: ReturnType<typeof getOldBudgets>
}

export function EstimatesContent({ estimates }: EstimatesContentProps) {
  return (
    <ContentLayoutSales title='Orçamentos antigos'>
      < OldBudgetsTable estimatesPromise={estimates} />
    </ContentLayoutSales >
  )
}
