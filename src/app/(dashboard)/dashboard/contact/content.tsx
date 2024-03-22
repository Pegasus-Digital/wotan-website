import { Separator } from '@/components/ui/separator'
import { Content, ContentHeader } from '@/components/content'
import { getContactMessages } from './(table)/queries'
import { ContactTable } from './(table)/contact-table'

interface ContactContentProps {
  messages: ReturnType<typeof getContactMessages>
}

export function ContactContent({ messages }: ContactContentProps) {
  return (
    <Content>
      <ContentHeader
        title='Contatos'
        description='Verifique as tentativas de contato realizadas na plataforma.'
      />

      <Separator className='mb-4' />

      <ContactTable messagesPromise={messages} />
    </Content>
  )
}
