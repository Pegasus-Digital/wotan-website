'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

import { Product } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { H1 } from '@/components/typography/headings'

import { CartCard } from './cart-card'
import { useCartStore } from '@/components/cart-store-provider'
import { Button, buttonVariants } from '@/components/ui/button'

export function CartDisplay() {
  const { cart } = useCartStore((state) => state)

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // TODO: For product in cart, fetch product data, including all possible attributes, so that we can render and select them
  useEffect(() => {
    if (cart.length === 0) return

    const fetchProduct = async () => {
      const response = await fetch(`/api/cart`, {
        body: JSON.stringify({
          productIds: cart.map((item) => item.productId),
        }),
        method: 'POST',
      })

      const data = await response.json()

      setProducts(data.docs)
      setIsLoading(false)
    }

    fetchProduct()
  }, [cart])

  if (!products || !cart) {
    return <H1>Carregando carrinho...</H1>
  }

  return (
    <div className='my-12 w-full space-y-2'>
      {cart.length === 0 && isLoading === false && (
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

      {cart &&
        cart.map((item, index) => (
          <CartCard
            key={item.productId + '-' + index}
            cartItem={item}
            product={products.find((product) => product.id === item.productId)}
          />
        ))}

      {cart.length > 0 && (
        <div className='flex justify-end'>
          <Button className='self-end'>Enviar orçamento</Button>
        </div>
      )}
    </div>
  )
}
