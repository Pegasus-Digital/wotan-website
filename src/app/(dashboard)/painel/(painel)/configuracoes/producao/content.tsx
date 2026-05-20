'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { PrintingTypeOption } from '@/lib/printing-types'
import { ContentLayout } from '@/components/painel-sistema/content-layout'
import { Button } from '@/components/ui/button'

import { ProductionSettingsForm } from '../_components/production-settings-form'

interface ProductionSettingsContentProps {
  printingTypes: PrintingTypeOption[]
}

export function ProductionSettingsContent({
  printingTypes,
}: ProductionSettingsContentProps) {
  return (
    <ContentLayout
      title='Planilha de produção'
      navbarButtons={
        <Button variant='outline' size='sm' asChild>
          <Link href='/painel/configuracoes'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Configurações
          </Link>
        </Button>
      }
    >
      <ProductionSettingsForm printingTypes={printingTypes} />
    </ContentLayout>
  )
}
