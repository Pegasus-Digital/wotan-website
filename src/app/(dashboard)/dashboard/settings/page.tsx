import { Metadata } from 'next'
import { SettingsContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Configurações',
}

export default async function Settings() {
  return <SettingsContent />
}
