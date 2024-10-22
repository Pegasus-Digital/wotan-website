import { getContactMessages } from './_logic/queries'
import { ContactTable } from './(table)/contact-table'

import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface ContactContentProps {
  messages: ReturnType<typeof getContactMessages>
}

export function ContactContent({ messages }: ContactContentProps) {
  return (
    // <Content>
    //   <ContentHeader
    //     title='Contatos'
    //     description='Verifique as tentativas de contato realizadas na plataforma.'
    //   />

    //   <Separator className='mb-4' />
    <ContentLayout title='Contatos'>
      <ContactTable messagesPromise={messages} />
    </ContentLayout>
  )
}
