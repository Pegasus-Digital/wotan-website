import { Metadata } from 'next'
import { ContactContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Contatos',
}

export default async function Customers() {
  return <ContactContent />
}
