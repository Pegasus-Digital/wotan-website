import { Content, ContentHeader } from '@/components/content'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { GeneralSettingsForm } from './_components/general-settings-form'
import { ContactSettingsForm } from './_components/contact-settings-form'
import { AddressSettingsForm } from './_components/address-settings-form'
import { SocialsSettingsForm } from './_components/socials-settings-form'

import { Setting } from '@/payload/payload-types'

interface SettingsContentProps {
  settings: Setting
}

export function SettingsContent({ settings }: SettingsContentProps) {
  const { header, company, footer, general } = settings

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

        <TabsContent
          className='grid grid-cols-1 gap-6 lg:grid-cols-2'
          value='company'
        >
          <GeneralSettingsForm company={company} />
          <ContactSettingsForm company={company} />
          <AddressSettingsForm company={company} />
          <SocialsSettingsForm company={company} />
        </TabsContent>

        <TabsContent value='header'>cabeçalho</TabsContent>
        <TabsContent value='footer'>rodapé</TabsContent>
      </Tabs>
    </Content>
  )
}
