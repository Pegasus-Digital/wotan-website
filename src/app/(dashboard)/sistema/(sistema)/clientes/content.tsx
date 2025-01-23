import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'
import { ClientsTable } from './_components/(table)/clients-table'
import { getClients } from './_logic/queries'
import { getSalespeople } from '../orcamentos/_logic/queries'
import { ContentLayoutSales } from '@/components/painel-sistema/content-layout'

interface ClientsContentProps {
  clients: ReturnType<typeof getClients>
}

export async function ClientsContent({ clients }: ClientsContentProps) {
  const { data: salespeopleData } = await getSalespeople()

  return (
    // <Content>
    //   <ContentHeader
    //     title='Clientes'
    //     description='Gerencie os clientes da empresa.'
    //   />
    //   <Separator className='mb-4' />
    <ContentLayoutSales title='Clientes'>
      < ClientsTable clientsPromise={clients} salespeople={salespeopleData} />
    </ContentLayoutSales >
  )
}
