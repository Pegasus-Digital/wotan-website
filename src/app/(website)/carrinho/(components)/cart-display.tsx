'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

import { Product } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { H2 } from '@/components/typography/headings'

import { CartCard } from './cart-card'
import { useCartStore } from '@/components/cart-store-provider'
import { Button, buttonVariants } from '@/pegasus/button'
import { ArrowRight } from 'lucide-react'

export function CartDisplay() {
  const { cart } = useCartStore((state) => state)
  const [hasCartLoaded, sethasCartLoaded] = useState<boolean>(false)

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (cart) {
      sethasCartLoaded(true)
    }
  }, [cart])

  useEffect(() => {
    // Route handler to fetch product data
    const fetchCartProducts = async () => {
      try {
        const response = await fetch(`/api/cart`, {
          body: JSON.stringify({
            productIds: cart.map((item) => item.productId),
          }),
          method: 'POST',
        })

        const data = await response.json()

        setProducts(data.docs)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCartProducts()
    setIsLoading(false)
  }, [hasCartLoaded])

  if (isLoading) {
    return <H2>Carregando produtos...</H2>
  }

  return (
    <div className='mt-12 w-full'>
      {cart.length === 0 && !isLoading && (
        <div className='flex flex-col items-center justify-center space-y-8 rounded-lg text-center text-foreground'>
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
        <div className='py-6 tablet:pt-12'>
          <Button
            asChild
            className='w-full'
            variant='expandIcon'
            size='lg'
            Icon={ArrowRight}
            iconPlacement='right'
          >
            <div className='cursor-pointer'>Enviar orçamento</div>
          </Button>
        </div>
      )}
    </div>
  )
}
