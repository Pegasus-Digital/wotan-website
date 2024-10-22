import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { UsersTable } from './_components/(table)/users-table'

import { getUsers } from './_logic/queries'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface UsersContentProps {
  users: ReturnType<typeof getUsers>
}

export function UsersContent({ users }: UsersContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Usuários'
    //     description='Gerencie os usuários que acessam o painel de administrador.'
    //   />
    //   <Separator className='mb-4' />
    <ContentLayout title='Gerenciamento de usuários'>
      <UsersTable usersPromise={users} />
    </ContentLayout>
  )
}
