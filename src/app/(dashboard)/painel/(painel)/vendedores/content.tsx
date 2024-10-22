import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'
import { SalespersonsTable } from './_components/(table)/salespersons-table'
import { getSalespersons } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface SalespersonsContentProps {
  salespersons: ReturnType<typeof getSalespersons>
}

export function SalespersonsContent({
  salespersons,
}: SalespersonsContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Vendedores e Representantes'
    //     description='Gerencie os vendedores e representantes do sistema.'
    //   />
    //   <Separator className='mb-4' />
    <ContentLayout title='Vendedores e Representantes'>
      <SalespersonsTable salespersonsPromise={salespersons} />
    </ContentLayout>
  )
}
