import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'
import { ClientForm } from '../_components/new-client-form'
import { Salesperson } from '@/payload/payload-types'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface NewClientContentProps {
  salespeople: Salesperson[]
}

export function NewClientContent({ salespeople }: NewClientContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Cadastro de cliente'
    //     description='Crie um novo cliente para a sua carteira.'
    //   />

    //   <Separator />
    <ContentLayout title='Criando novo cliente'>
      <ClientForm salespeople={salespeople} />
    </ContentLayout>
  )
}
