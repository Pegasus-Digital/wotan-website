import { Content, ContentHeader } from '@/components/content'

import { Separator } from '@/components/ui/separator'
import { CompanyForm } from './_components/settings-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function SettingsContent() {
  return (
    <Content>
      <ContentHeader
        title='Configurações'
        description='Altere as configurações da plataforma.'
      />

      <Separator className='mb-4' />

      <Tabs defaultValue='company'>
        <TabsList>
          <TabsTrigger value='company'>Empresa</TabsTrigger>
          <TabsTrigger value='header'>Cabeçalho</TabsTrigger>
          <TabsTrigger value='footer'>Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value='company'>
          <CompanyForm />
        </TabsContent>
        <TabsContent value='header'>cabeçalho</TabsContent>
        <TabsContent value='footer'>rodapé</TabsContent>
      </Tabs>
    </Content>
  )
}
