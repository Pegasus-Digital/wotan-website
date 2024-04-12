import { Content, ContentHeader } from '@/components/content'
import { Separator } from '@/components/ui/separator'

export function UsersContent() {
  return (
    <Content>
      <ContentHeader
        title='Usuários'
        description='Gerencia os usuários que acessam o painel de administrador.'
      />
      <Separator className='mb-4' />
    </Content>
  )
}
