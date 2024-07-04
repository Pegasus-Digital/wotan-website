'use client'

import { useEffect, useState } from 'react'

import { Product } from '@/payload/payload-types'

import { LoadingSpinner } from './spinner'
import { ScrollArea } from './ui/scroll-area'
import { ProductGallery } from '@/app/(website)/produtos/[slug]/(components)/product-gallery'
import { ProductInteraction } from '@/app/(website)/produtos/[slug]/(components)/product-interaction'

interface AddToCartFormProps {
  productId: string
}

export function AddToCartContent({ productId }: AddToCartFormProps) {
  const [product, setProduct] = useState<Product>(null)

  // Refetch product, just to be sure
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/fetch-product`, {
          body: JSON.stringify({
            productId,
          }),
          method: 'POST',
        })

        const data = await response.json()

        setProduct(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchProduct()
  }, [])

  return product ? (
    <ScrollArea className='max-h-[720px]'>
      <div className='grid h-full w-full grid-cols-1 place-items-stretch gap-2 overflow-y-auto py-4 md:grid-cols-2'>
        <ProductGallery product={product} />
        <ProductInteraction product={product} biggerQuantity={false} />
      </div>
    </ScrollArea>
  ) : (
    <div className='flex w-full items-center justify-center'>
      <LoadingSpinner />
    </div>
  )
}
