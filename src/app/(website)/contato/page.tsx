import { Metadata } from 'next'

import { ContactContent } from './content'

export const metadata: Metadata = {
  title: 'Contato',
}

export default async function Contact() {
  return <ContactContent />
}
