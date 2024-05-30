import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'
import { ClientsTable } from './_components/(table)/clients-table'
import { getClients } from './_logic/queries'

interface ClientsContentProps {
  clients: ReturnType<typeof getClients>
}

export function ClientsContent({ clients }: ClientsContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Clientes'
        description='Gerencie os clientes da empresa.'
      />
      <Separator className='mb-4' />

      <ClientsTable clientsPromise={clients} />
    </Content>
  )
}
