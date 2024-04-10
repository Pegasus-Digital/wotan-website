import { Metadata } from 'next'
import { PagesContent } from './content'
import staticPlaceholderImage from './(images)/768x432.png'
import payload from 'payload'

// This page is meant to be responsible for SEO, data fetching and/or other asynchronous functions

export const metadata: Metadata = {
  title: 'Páginas',
}

// const pages = [
//   {
//     title: 'Página inicial',
//     href: '/',
//     image: staticPlaceholderImage,
//   },
//   {
//     title: 'Quem somos',
//     href: '/quem-somos',
//     image: staticPlaceholderImage,
//   },
//   {
//     title: 'Contato',
//     href: '/contato',
//     image: staticPlaceholderImage,
//   },
// ]

export default async function Paginas() {
  const allPages = await payload.find({
    collection: 'pages',
    pagination: false,
    sort: 'title',
  })

  const pages = allPages.docs.map((page) => ({
    title: page.title,
    href: page.slug,
    image: staticPlaceholderImage,
    updatedAt: page.updatedAt,
  }))

  return <PagesContent pages={pages} />
}
