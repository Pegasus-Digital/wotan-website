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

// Sugestao de props
interface ProductSliderProps {
  title: string
  description: string
  products: any[]
}

export function ProductSlider() {
  return (
    <section className='my-6 w-full'>
      <div className='container flex w-full flex-col space-y-2'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <H1 className='text-wotanRed-500'>Section title</H1>
          <Lead>
            This is the section description, make sure to leave a like and
            subscribe!!
          </Lead>
        </div>

        <Carousel
          className='w-full border-x'
          opts={{ align: 'start', loop: true }}
        >
          <CarouselContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <CarouselItem className='max-w-[300px] shadow-sm' key={index}>
                <ProductCard />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='desktop:flex hidden' />
          <CarouselNext className='desktop:flex hidden' />
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
