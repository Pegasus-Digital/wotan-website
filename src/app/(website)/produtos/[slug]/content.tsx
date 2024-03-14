import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Product } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { buttonVariants } from '@/components/ui/button'
import { ProductInteraction } from './(components)/product-interaction'
import { Media } from '@/components/media'

interface ProductPageProps {
  product: Product | null
}

export function ProductPageContent({ product }: ProductPageProps) {
  const related = product.relatedProducts

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
    <section className='relative my-6 w-full flex-1 text-primary-foreground tablet:px-6'>
      <main className='container grid grid-cols-1 gap-4 text-foreground tablet:grid-cols-2'>
        <div className='flex h-full flex-col'>
          <img
            alt=''
            className='aspect-square h-full max-h-[768px] w-full flex-1 rounded-lg border object-cover shadow-md'
            src='https://source.unsplash.com/random/?Product&1'
          />
        </div>

        <ProductInteraction product={product} />
      </main>

      {/* Related products */}
      {related && <div>Produtos relacionados:</div>}
    </section>
  )
}
