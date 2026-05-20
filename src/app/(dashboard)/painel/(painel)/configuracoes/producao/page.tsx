import { Metadata } from 'next'

import { Small } from '@/components/typography/texts'
import { getPrintingTypes } from '@/lib/queries/printing-types'

import { ProductionSettingsContent } from './content'

export const metadata: Metadata = {
  title: 'Planilha de produção | Configurações',
}

export default async function ProductionSettingsPage() {
  const printingTypes = await getPrintingTypes()

  if (!printingTypes) {
    return <Small>Não foi possível carregar as configurações.</Small>
  }

  return <ProductionSettingsContent printingTypes={printingTypes} />
}
