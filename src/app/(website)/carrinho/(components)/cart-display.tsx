'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

import { Heading } from '@/pegasus/heading'

import { CartCard } from './cart-card'
import { useCartStore } from '@/components/cart-store-provider'
import { Button, buttonVariants } from '@/components/ui/button'

export function CartDisplay() {
  const { cart } = useCartStore((state) => state)

  // TODO: For product in cart, fetch product data, including all possible attributes, so that we can render and select them

  return (
    <div className='my-12 w-full space-y-2'>
      {cart.length === 0 && (
        <div className='flex flex-col items-center justify-center space-y-4 rounded-lg text-center text-foreground'>
          <Heading variant='h2' className='text-foreground'>
            Não encontramos produtos no carrinho.
          </Heading>

          <Link
            className={cn(buttonVariants(), 'text-lg font-medium')}
            href='/'
          >
            Voltar para o início.
          </Link>
        </div>
      )}

      {cart.map((item, index) => (
        <CartCard key={item.productId + '-' + index} {...item} />
      ))}

      {cart.length > 0 && (
        <div className='flex justify-end'>
          <Button className='self-end'>Enviar orçamento</Button>
        </div>
      )}
    </div>
  )
}
