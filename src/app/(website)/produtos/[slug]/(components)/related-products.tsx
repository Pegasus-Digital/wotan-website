import payload from 'payload'
import { Product } from '@/payload/payload-types'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import { ProductCard } from '@/components/product-card'

import { Heading } from '@/pegasus/heading'
import { Lead } from '@/components/typography/texts'

export type RelatedProductsSliderProps = Pick<
  Product,
  'categories' | 'relatedProducts'
>

async function getRelated({
  relatedProducts,
  categories,
}: RelatedProductsSliderProps) {
  if (!relatedProducts && typeof categories[0] === 'object') {
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        'categories.breadcrumbs.label': {
          contains: categories[0].title,
        },
      },
      limit: 10,
      pagination: false,
    })

    return docs
  }

  return relatedProducts
}

export async function RelatedProductsSlider({
  relatedProducts,
  categories,
}: RelatedProductsSliderProps) {
  const carousel = await getRelated({ relatedProducts, categories })

  if (!carousel) {
    return null
  }

  return (
    <section className='w-full overflow-x-hidden'>
      <div className='flex w-full flex-col gap-4 desktop:container'>
        <div className='flex flex-col gap-2 text-center'>
          <Heading variant='h2'>Produtos Relacionados</Heading>
          <Lead>Quem viu este produto também gostou de</Lead>
        </div>

        <Carousel
          className=' w-full border-x'
          opts={{ align: 'center', loop: true }}
        >
          <CarouselContent>
            {carousel.map((doc, index) => {
              if (typeof doc === 'object') {
                return (
                  <CarouselItem className='max-w-[300px]' key={index}>
                    <ProductCard product={doc} />
                  </CarouselItem>
                )
              }
            })}
          </CarouselContent>
          <CarouselPrevious className='hidden desktop:flex' />
          <CarouselNext className='hidden desktop:flex' />
        </Carousel>
      </div>
    </section>
  )
}
