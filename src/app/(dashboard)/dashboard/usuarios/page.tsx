import { Metadata } from 'next'
import { UsersContent } from './content'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Usuários',
}

export default async function Orders() {
  return <UsersContent />
}
