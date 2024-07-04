import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Product } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { buttonVariants } from '@/components/ui/button'
import { ProductGallery } from './(components)/product-gallery'
import { RelatedProductsSlider } from './(components)/related-products'
import { ProductInteraction } from './(components)/product-interaction'
import payload from 'payload'

interface ProductPageProps {
  product: Product | null
}

async function fetchConfigs() {
  try {
    await payload.init({
      // Init Payload
      secret: process.env.PAYLOAD_SECRET,
      local: true, // Enables local mode, doesn't spin up a server or frontend
    })

    // const settings = await fetchSettings()

    const settings = await payload.findGlobal({
      slug: 'settings',
    })
    // console.log({ settings })
    return settings
  } catch (error) {
    console.error(error)
  }
}

export async function ProductPageContent({ product }: ProductPageProps) {
  const { general } = await fetchConfigs()

  if (!product) {
    return (
      <section className='relative flex w-full flex-1 items-center self-center px-6 text-primary-foreground'>
        <div className='container flex flex-col items-center justify-center space-y-4 rounded-lg text-center text-foreground'>
          <Heading variant='h2' className='text-foreground'>
            Produto não encontrado.
          </Heading>

          <Link
            className={cn(buttonVariants(), 'text-lg font-medium')}
            href='/'
          >
            Voltar para o início.
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='relative my-6 flex w-full flex-col items-center justify-center gap-12 self-center text-primary-foreground tablet:gap-12 tablet:px-6 desktop:gap-24'>
      <div className='container flex justify-center'>
        <div className='flex h-min max-w-screen-xl flex-col gap-6 text-foreground tablet:flex-row'>
          <ProductGallery product={product} />
          <ProductInteraction
            product={product}
            biggerQuantity={general.biggerQuantity}
          />
        </div>
      </div>

      <RelatedProductsSlider
        relatedProducts={product.relatedProducts}
        categories={product.categories}
      />
    </section>
  )
}
