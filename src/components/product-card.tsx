'use client'

import type { Attribute, Category, Product } from '@/payload/payload-types'

import { Image } from './media/image'
import { Card, CardContent, CardFooter } from './ui/card'
import { ProductCardActions } from './product-card-actions'

import { Lead, P } from './typography/texts'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const mainCategory =
    product.categories.find((category: Category) => category.parent === null) ??
    product.categories[0]

  return (
    <Card className='group my-3 aspect-[16/10] shadow-wotan-light'>
      <CardContent className='relative m-0 overflow-hidden  rounded-md border-b p-0'>
        <Image
          resource={product.featuredImage}
          imgClassName='bg-white w-full h-full aspect-square rounded-t-md'
        />

        <div className='absolute bottom-2 flex w-full items-center justify-center gap-2.5 transition duration-200 tablet:translate-y-10 tablet:opacity-0 tablet:group-hover:translate-y-0 tablet:group-hover:opacity-100'>
          <ProductCardActions product={product} />
        </div>
      </CardContent>

      <CardFooter className='z-10 flex flex-col items-start space-y-2.5 py-4'>
        <Lead className='text-sm font-bold text-wotanRed-500'>
          {typeof mainCategory === 'object' && mainCategory.title}
          {!mainCategory && 'Sem categoria'}
        </Lead>

        <P className='text-base font-bold text-foreground'>{product.title}</P>

        {/* <div className='flex h-4 items-center gap-1'>
          {typeof product.attributes === 'object' &&
            product.attributes.map(
              // Filter attributes by color, and render the colors
              (attribute: Attribute) =>
                typeof attribute.type === 'object' &&
                attribute.type.type === 'color' && (
                  <div
                    key={attribute.id}
                    style={{ backgroundColor: attribute.value }}
                    className='h-4 w-4 rounded-full border'
                  />
                ),
            )}
        </div> */}
      </CardFooter>
    </Card>
  )
}
