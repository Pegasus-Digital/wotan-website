import { Metadata } from 'next'
import { PagesContent } from './content'
import staticPlaceholderImage from './(images)/768x432.png'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Pedidos',
}

const pages = [
  {
    title: 'Página inicial',
    href: '/',
    image: staticPlaceholderImage,
  },
  {
    title: 'Quem somos',
    href: '/quem-somos',
    image: staticPlaceholderImage,
  },
  {
    title: 'Contato',
    href: '/contato',
    image: staticPlaceholderImage,
  },
]

export default async function Pages() {
  return <PagesContent pages={pages} />
}
