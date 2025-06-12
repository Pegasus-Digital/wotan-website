import { Metadata } from 'next'
import { PagesContent } from './content'
import { getPages } from './_logic/queries'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Páginas',
  description: 'Gerencie as páginas do website.',
}

export default async function Pages() {
  const { docs: pages } = await getPages()

  // console.log('pages', pages)

  return <PagesContent pages={pages} />
}
