import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Product } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { Image } from '@/components/media/image'
import { buttonVariants } from '@/components/ui/button'
import { ProductInteraction } from './(components)/product-interaction'

interface ProductPageProps {
  product: Product | null
}

export function ProductPageContent({ product }: ProductPageProps) {
  if (!product) {
    return (
      <section className='relative flex w-full flex-1 items-center self-center px-6 text-primary-foreground'>
        <div className='container flex flex-col items-center justify-center space-y-4 rounded-lg text-center text-foreground'>
          <Heading variant='h2' className='text-foreground'>
            Produto não encontrado.
          </Heading>

          <Link
            className={cn(buttonVariants(), 'text-lg font-medium')}
            href='/'
          >
            Voltar para o início.
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='relative my-6 flex w-full flex-col items-center justify-center self-center text-primary-foreground tablet:px-6'>
      <div className='container grid h-min grid-cols-1 text-foreground tablet:grid-cols-2'>
        <div className='mb-4 grid grid-cols-3 grid-rows-3 gap-x-6 gap-y-2'>
          <Image
            imgClassName='col-span-3 row-span-3 w-full border w-full object-cover max-h-[640px] rounded-lg shadow-wotan-light'
            resource={product.featuredImage}
          />

          {product.images.length > 0
            ? product.images.map((entry) => (
                <Image
                  key={entry.id}
                  resource={entry.image}
                  className='h-full w-full'
                  imgClassName='aspect-square rounded-lg border object-cover object-center col-span-1 row-span-1 shadow-wotan-light w-full h-full'
                />
              ))
            : null}
        </div>

        <ProductInteraction product={product} />
      </div>

      {/* Related products */}
      {/* {related && <div>Produtos relacionados:</div>} */}
    </section>
  )
}
