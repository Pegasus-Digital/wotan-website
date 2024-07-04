import { Metadata } from 'next'
import type { Setting } from '@/payload/payload-types'
import { ContactContent } from './content'
import { fetchSettings } from '@/app/_api/fetchGlobals'
import payload from 'payload'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a Wotan',
}

async function fetchConfigs() {
  try {
    await payload.init({
      // Init Payload
      secret: process.env.PAYLOAD_SECRET,
      local: true, // Enables local mode, doesn't spin up a server or frontend
    })

    // const settings = await fetchSettings()

    const settings = await payload.findGlobal({
      slug: 'settings',
    })
    // console.log({ settings })
    return settings
  } catch (error) {
    console.error(error)
  }
}

export default async function Contact() {
  const { company }: Setting = await fetchConfigs()
  const { adress, contact } = company

  return <ContactContent address={adress} contact={contact} />
}
