import { ProductSlider } from '@/components/product-slider'

import { Page as PayloadPage } from '../../../payload/payload-types'
import { fetchDoc } from '@/app/_api/fetchDoc'
import { fetchDocs } from '@/app/_api/fetchDocs'
import { notFound } from 'next/navigation'

import { Sections } from '@/components/sections'
import { SlideshowHero } from '@/app/_sections/heros/slideshow'
import { LowImpactHero } from '@/app/_sections/heros/lowImpact'

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
  // console.log(page)
  return (
    <>
      {slug === 'home' ? (
        <SlideshowHero />
      ) : (
        <LowImpactHero title={title} description={description} />
      )}
      <Sections sections={layout} />
    </>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<PayloadPage>('pages')
    // console.log(pages)
    return pages?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}
