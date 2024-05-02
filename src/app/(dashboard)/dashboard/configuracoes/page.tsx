import { Metadata } from 'next'
import { SettingsContent } from './content'
import { getSettingsGlobal } from './_logic/queries'
import { Small } from '@/components/typography/texts'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Configurações',
}

export default async function Settings() {
  const response = await getSettingsGlobal()

  if (!response) {
    return <Small>Not found.</Small>
  }

  return <SettingsContent settings={response.data} />
}
