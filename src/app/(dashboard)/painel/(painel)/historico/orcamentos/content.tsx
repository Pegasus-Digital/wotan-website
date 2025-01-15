import { getOldBudgets } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { OldBudgetsTable } from './_table/old-budgets-table'

interface EstimatesContentProps {
  estimates: ReturnType<typeof getOldBudgets>
}

export function EstimatesContent({ estimates }: EstimatesContentProps) {
  return (
    <ContentLayout title='Orçamentos antigos'>
      <OldBudgetsTable estimatesPromise={estimates} />
    </ContentLayout>
  )
}
