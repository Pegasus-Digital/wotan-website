'use client'

import { useState } from 'react'

import {
  Carousel,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Image } from '@/components/media/image'

export function ProductGallery({ product }) {
  const [bigImage, setBigImage] = useState(product.featuredImage)

  return (
    <div className='flex w-full min-w-80 max-w-screen-lg flex-col items-center justify-center gap-4 desktop:mx-8'>
      <Image
        imgClassName=' w-full border max-w-lg rounded-lg shadow-wotan-light aspect-square'
        resource={bigImage}
      />

      <Carousel
        className=' w-full max-w-lg select-none border-x  '
        opts={{ align: 'start', loop: true }}
      >
        <CarouselContent>
          {product.images.length > 0
            ? product.images.map((entry: any) => (
                <Image
                  key={entry.id}
                  resource={entry.image}
                  imgClassName={`aspect-square rounded-lg border object-cover object-center col-span-1 row-span-1 shadow-wotan-light h-28 w-28 tablet:h-32 tablet:w-32  desktop:h-36 desktop:w-36 m-2 cursor-pointer border  ${bigImage === entry.image ? ' border-2 border-wotanRed-500' : 'hover:border-wotanRed-700'}`}
                  onClick={() => {
                    setBigImage(entry.image)
                  }}
                />
              ))
            : null}
        </CarouselContent>
        <CarouselPrevious className='hidden desktop:flex' />
        <CarouselNext className='hidden desktop:flex' />
      </Carousel>
    </div>
  )
}
