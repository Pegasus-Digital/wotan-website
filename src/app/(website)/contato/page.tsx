import { Metadata } from 'next'
import type { Setting } from '@/payload/payload-types'
import { ContactContent } from './content'
import { fetchSettings } from '@/app/_api/fetchGlobals'

export const metadata: Metadata = {
  title: 'Contato',
}

async function fetchConfigs() {
  try {
    const settings = await fetchSettings()
    return settings
  } catch (error) {
    console.error(error)
  }
}

export default async function Contact() {
  const settings: Setting | null = await fetchConfigs()
  const { company } = settings
  const { adress, contact } = company

  return <ContactContent address={adress} contact={contact} />
}
