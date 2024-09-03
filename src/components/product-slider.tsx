import Link from 'next/link'
import { getHref } from './link'

import { Page } from '@/payload/payload-types'

import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from './ui/carousel'

import { Button } from '@/pegasus/button'
import { ProductCard } from './product-card'

import { Lead } from './typography/texts'
import { Heading } from '@/pegasus/heading'

import { Icons } from './icons'

// TODO: Acho que da pra simplificar essas tipagens
export type ProductSliderProps = Extract<
  Page['layout'][0],
  { blockType: 'product-carousel' }
>

export function ProductSlider({
  title,
  description,
  selectedDocs,
  seeMore,
  seeMoreLink,
  populateBy,
  populatedDocs,
}: ProductSliderProps) {
  const carousel = populateBy === 'categories' ? populatedDocs : selectedDocs

  return (
    <section className='w-full overflow-x-hidden'>
      <div className='flex w-full flex-col gap-4 desktop:container'>
        {title && (
          <div className='flex flex-col gap-2 text-center'>
            <Heading variant='h2'>{title}</Heading>
            {description && <Lead>{description}</Lead>}
          </div>
        )}

        <Carousel
          className=' w-full border-x'
          opts={{ align: 'center', loop: true }}
        >
          <CarouselContent>
            {carousel.map((doc, index) => {
              if (typeof doc.value === 'object') {
                return (
                  <CarouselItem className='max-w-[300px]' key={index}>
                    <ProductCard product={doc.value} />
                  </CarouselItem>
                )
              }
            })}
          </CarouselContent>
          <CarouselPrevious className='hidden desktop:flex' />
          <CarouselNext className='hidden desktop:flex' />
        </Carousel>

        {seeMore && (
          <Button
            asChild
            size='lg'
            variant='expandIcon'
            iconPlacement='right'
            className='self-center'
            Icon={Icons.ArrowRight}
          >
            <Link href={getHref(seeMoreLink)}>{seeMoreLink.label}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
