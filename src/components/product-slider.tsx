import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel'

import { ProductCard } from './product-card'
import { H1 } from './typography/headings'
import { Lead } from './typography/texts'
import { buttonVariants } from './ui/button'
import Link from 'next/link'
import { Page, Product } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'

export type ProductSliderProps = Extract<
  Page['layout'][0],
  { blockType: 'product-carousel' }
>

export function ProductSlider({
  title,
  description,
  selectedDocs,
}: ProductSliderProps) {
  return (
    <section className='w-full overflow-x-hidden'>
      <div className='container flex w-full flex-col space-y-2'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <Heading variant='h2'>{title}</Heading>
          <Lead>{description}</Lead>
        </div>

        <Carousel
          className='w-full border-x'
          opts={{ align: 'start', loop: true }}
        >
          <CarouselContent>
            {selectedDocs.map((doc, index) => {
              if (typeof doc.value !== 'string') {
                return (
                  <CarouselItem className='max-w-[300px] shadow-sm' key={index}>
                    <ProductCard
                      title={doc.value.title}
                      categories={doc.value.categories}
                    />
                  </CarouselItem>
                )
              }
            })}
            {/* {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem className='max-w-[300px] shadow-sm' key={index}>
                <ProductCard />
              </CarouselItem>
            ))} */}
          </CarouselContent>
          <CarouselPrevious className='hidden desktop:flex' />
          <CarouselNext className='hidden desktop:flex' />
        </Carousel>

        <Link
          href='/see-more'
          className={buttonVariants({
            size: 'lg',
            className: 'self-center',
          })}
        >
          Ver mais
        </Link>
      </div>
    </section>
  )
}
