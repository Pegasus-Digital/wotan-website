'use client'
import ImagesCarousel from '@/components/image-carousel'
// import { ImagesSlider } from '@/components/images-slider'
import { Page } from '@/payload/payload-types'
import React from 'react'

type SlideshowProps = Pick<Page, 'carousel'>

function extractImageUrls(carousel: SlideshowProps['carousel']): string[] {
  const imageUrls: string[] = []

  if (carousel) {
    carousel.forEach((item) => {
      if (typeof item.image === 'object') {
        imageUrls.push(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/media/${item.image.filename}`,
        )
      }
    })
  }

  return imageUrls
}

export function SlideshowHero({ carousel }: SlideshowProps) {
  const images: string[] = extractImageUrls(carousel)

  return (
    <ImagesCarousel
      className=' aspect-[1920/480] w-full bg-black/50 '
      images={images}
    />
  )
}
