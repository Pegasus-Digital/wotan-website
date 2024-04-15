import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Page as PayloadPage } from '../../../payload/payload-types'
import { fetchDoc } from '@/app/_api/fetchDoc'
import { fetchDocs } from '@/app/_api/fetchDocs'

import { Heading } from '@/pegasus/heading'
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

  const { title, description, layout, carousel } = page

  return (
    <>
      {slug === 'home' ? (
        <>
          <Heading
            variant='h1'
            className='absolute select-none text-transparent'
          >
            Wotan Brindes. Brindes personalizados e presentes corporativos.
          </Heading>
          <SlideshowHero carousel={carousel} />
        </>
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

    return pages?.map(({ slug }) => slug)
  } catch (error) {
    return []
  }
}

export async function generateMetadata({
  params: { slug = 'home' },
}): Promise<Metadata> {
  let page: PayloadPage | null = await fetchPage(slug)

  if (!page)
    return {
      title: 'Página não encontrada',
      robots: {
        index: false,
      },
    }

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      images: [
        {
          url: new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}/wotan.png`),
          width: 800,
          height: 600,
        },
      ],
    },
  }
}
