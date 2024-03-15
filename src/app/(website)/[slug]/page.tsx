import { Page as PayloadPage } from '../../../payload/payload-types'
import { fetchDoc } from '@/app/_api/fetchDoc'
import { fetchDocs } from '@/app/_api/fetchDocs'
import { notFound } from 'next/navigation'

import { Hero } from '@/components/heros'
import { Sections } from '@/components/sections'
import { SlideshowHero } from '@/app/_sections/heros/slideshow'

async function fetchPage(slug: string) {
  try {
    const page = await fetchDoc<PayloadPage>({
      collection: 'pages',
      slug: slug,
    })
    return page
  } catch (error) {
    console.error(error)
  }
}

export default async function Page({ params: { slug = 'home' } }) {
  let page: PayloadPage | null = await fetchPage(slug)

  if (!page) return notFound()

  const { title, description, layout } = page
  return (
    <>
      {slug === 'home' ? (
        <SlideshowHero />
      ) : (
        <Hero title={title} description={description} />
      )}
      <Sections sections={layout} />
    </>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<PayloadPage>('pages')

    return pages?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}
