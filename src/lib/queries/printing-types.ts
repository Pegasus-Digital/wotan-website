import 'server-only'

import payload from 'payload'
import { unstable_noStore as noStore } from 'next/cache'

import {
  normalizePrintingTypes,
  PrintingTypeOption,
} from '@/lib/printing-types'

type SettingsWithProduction = {
  production?: {
    printingTypes?: { value?: string | null; label?: string | null }[] | null
  } | null
}

export async function getPrintingTypes(): Promise<PrintingTypeOption[]> {
  noStore()

  try {
    const settings = (await payload.findGlobal({
      slug: 'settings',
    })) as SettingsWithProduction

    return normalizePrintingTypes(settings.production?.printingTypes)
  } catch {
    return normalizePrintingTypes(null)
  }
}
