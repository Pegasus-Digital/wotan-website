import { ProductSlider } from '@/components/product-slider'

import { Page as PayloadPage } from '../../../payload/payload-types'
import { fetchDoc } from '@/app/_api/fetchDoc'
import { fetchDocs } from '@/app/_api/fetchDocs'
import { notFound } from 'next/navigation'

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

  const { layout } = page

  return (
    <main className='flex min-h-screen flex-col items-center'>
      {layout.map((block, index) => {
        if (block.blockType === 'product-carousel') {
          return <ProductSlider key={index} />
        }
      })}
    </main>
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