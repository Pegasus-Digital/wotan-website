import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Product } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { buttonVariants } from '@/components/ui/button'
import { ProductInteraction } from './(components)/product-interaction'
import ProductGallery from './(components)/product-gallery'
import { ProductSlider } from '@/components/product-slider'
import { RelatedProductsSlider } from './(components)/related-products'

interface ProductPageProps {
  product: Product | null
}

export function ProductPageContent({ product }: ProductPageProps) {
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
          {/* Galeria de imagens */}
          <ProductGallery product={product} />
          {/* Informaçoes e interação */}
          <ProductInteraction product={product} />
        </div>
      </div>

      {/* Related products */}
      <RelatedProductsSlider
        relatedProducts={product.relatedProducts}
        categories={product.categories}
      />
    </section>
  )
}
