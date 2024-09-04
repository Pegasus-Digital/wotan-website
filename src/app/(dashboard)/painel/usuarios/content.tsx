import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { UsersTable } from './_components/(table)/users-table'

import { getUsers } from './_logic/queries'

interface UsersContentProps {
  users: ReturnType<typeof getUsers>
}

export function UsersContent({ users }: UsersContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Usuários'
        description='Gerencie os usuários que acessam o painel de administrador.'
      />
      <Separator className='mb-4' />

      <UsersTable usersPromise={users} />
    </Content>
  )
}
