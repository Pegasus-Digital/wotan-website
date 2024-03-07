import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './ui/carousel'

import { ProductCard } from './product-card'
import { Lead } from './typography/texts'
import { buttonVariants } from './ui/button'
import Link from 'next/link'
import { Page, Product } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'
import { Button } from '@/pegasus/button'
import { ArrowRight } from 'lucide-react'

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
      <div className='flex w-full flex-col gap-4 desktop:container'>
        <div className='flex flex-col gap-2 text-center'>
          <Heading variant='h2'>{title}</Heading>
          <Lead>{description}</Lead>
        </div>

        <Carousel
          className=' w-full border-x'
          opts={{ align: 'center', loop: true }}
        >
          <CarouselContent>
            {selectedDocs.map((doc, index) => {
              if (typeof doc.value !== 'string') {
                return (
                  <CarouselItem className='max-w-[300px]' key={index}>
                    <ProductCard
                      title={doc.value.title}
                      categories={doc.value.categories}
                    />
                  </CarouselItem>
                )
              }
            })}
          </CarouselContent>
          <CarouselPrevious className='hidden desktop:flex' />
          <CarouselNext className='hidden desktop:flex' />
        </Carousel>

        <Button
          className='self-center'
          size='lg'
          variant='expandIcon'
          Icon={ArrowRight}
          iconPlacement='right'
          asChild
        >
          <Link href='/see-more'>Ver mais</Link>
        </Button>
      </div>
    </section>
  )
}
