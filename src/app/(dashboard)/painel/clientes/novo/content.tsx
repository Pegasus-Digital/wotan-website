import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'
import { ClientForm } from '../_components/new-client-form'
import { Salesperson } from '@/payload/payload-types'

interface NewClientContentProps {
  salespeople: Salesperson[]
}

export function NewClientContent({ salespeople }: NewClientContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Cadastro de cliente'
        description='Crie um novo cliente para a sua carteira.'
      />

      <Separator />

      <ClientForm salespeople={salespeople} />
    </Content>
  )
}
