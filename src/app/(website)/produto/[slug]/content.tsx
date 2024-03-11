import Link from 'next/link'
import { Category, Product } from '@/payload/payload-types'

import { cn } from '@/lib/utils'

import { P } from '@/components/typography/texts'

import { Heading } from '@/pegasus/heading'
import { Button, buttonVariants } from '@/components/ui/button'

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
    <section className='relative my-6 w-full flex-1 px-6 text-primary-foreground'>
      <div className='container grid grid-cols-2 text-foreground'>
        <div className='flex h-full flex-col items-end bg-green-300'>
          <img
            alt=''
            className='max-h-96'
            src='https://source.unsplash.com/random/?Product&1'
          />
        </div>

        <div className='bg-sky-300'>
          <Heading variant='h2' className='max-h-96 text-foreground'>
            {product.title}
          </Heading>
          <P>
            {product.categories.map((category: Category) => (
              <P key={category.id}>{category.title}</P>
            ))}
          </P>

          <P>Quantidade mínima: {product.minimumQuantity}</P>
          <P>Código de referência: {product.sku}</P>

          {/* Cores */}
          <div></div>

          <Button>Adicionar ao carrinho</Button>
        </div>
      </div>
    </section>
  )
}
