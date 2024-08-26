// 'use client'

import { useEffect, useState } from 'react'

import { Product } from '@/payload/payload-types'

import { LoadingSpinner } from './spinner'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import {
  ProductGallery,
  ProductGalleryDialog,
} from '@/app/(website)/produtos/[slug]/(components)/product-gallery'
import { ProductInteraction } from '@/app/(website)/produtos/[slug]/(components)/product-interaction'
import { Button } from '@/pegasus/button'

interface AddToCartFormProps {
  productId: string
  setOpen: (state: boolean) => void
}

export function AddToCartContent({ productId, setOpen }: AddToCartFormProps) {
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
    <ScrollArea className='max-h-[calc(100vh-10rem)] tablet:max-h-[32rem] desktop:max-h-[48rem]'>
      <div className=' grid w-full grid-cols-1 place-items-stretch gap-2 overflow-y-auto md:grid-cols-2'>
        <ProductGalleryDialog product={product} />
        <div className='flex flex-col items-start justify-start  gap-4'>
          <ProductInteraction product={product} biggerQuantity={false} />

          <Button
            className='w-full'
            variant='outline'
            size='lg'
            onClick={() => setOpen(false)}
          >
            Voltar para a navegação
          </Button>
        </div>
      </div>
    </ScrollArea>
  ) : (
    <div className='flex h-[calc(100vh-10rem)] w-full items-center justify-center '>
      <LoadingSpinner />
    </div>
  )
}
