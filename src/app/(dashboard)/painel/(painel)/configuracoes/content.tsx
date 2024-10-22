'use client'

import { Content, ContentHeader } from '@/components/content'

import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { GeneralSettingsForm } from './_components/general-settings-form'
import { ContactSettingsForm } from './_components/contact-settings-form'
import { AddressSettingsForm } from './_components/address-settings-form'
import { SocialsSettingsForm } from './_components/socials-settings-form'

import { Setting } from '@/payload/payload-types'
import FooterSettingsForm from './_components/footer-settings-form'
import HeaderSettingsForm from './_components/header-settings-form'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

interface SettingsContentProps {
  settings: Setting
}

export function SettingsContent({ settings }: SettingsContentProps) {
  const { header, company, footer, general } = settings

  return (
    // <Content>
    //   <ContentHeader
    //     title='Configurações'
    //     description='Altere as configurações da plataforma.'
    //   />

    //   <Separator className='mb-4' />
    <ContentLayout title='Configurações'>
      <Tabs defaultValue='company'>
        <TabsList>
          {/* <TabsTrigger value='general'>Geral</TabsTrigger> */}
          <TabsTrigger value='company'>Empresa</TabsTrigger>
          <TabsTrigger value='contato'>Contato</TabsTrigger>
          <TabsTrigger value='endereco'>Endereço</TabsTrigger>
          <TabsTrigger value='socials'>Redes Sociais</TabsTrigger>
          <TabsTrigger value='header'>Cabeçalho</TabsTrigger>
          <TabsTrigger value='footer'>Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value='company'>
          <GeneralSettingsForm company={company} />
        </TabsContent>
        <TabsContent value='endereco'>
          <AddressSettingsForm company={company} />
        </TabsContent>
        <TabsContent value='contato'>
          <ContactSettingsForm company={company} />
        </TabsContent>
        <TabsContent value='socials'>
          <SocialsSettingsForm company={company} />
        </TabsContent>
        <TabsContent value='header'>
          <HeaderSettingsForm header={header} />
        </TabsContent>
        <TabsContent value='footer'>
          <FooterSettingsForm footer={footer} />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  )
}
