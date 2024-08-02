'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

import { Product } from '@/payload/payload-types'

import { Heading } from '@/pegasus/heading'
import { Button, buttonVariants } from '@/pegasus/button'

import { CartCard } from './cart-card'
import { LoadingSpinner } from '@/components/spinner'
import { useCartStore } from '@/components/cart-store-provider'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function CartDisplay() {
  const { cart } = useCartStore((state) => state)
  const [hasCartLoaded, sethasCartLoaded] = useState<boolean>(false)

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
    return (
      <>
        <Heading variant='h3'>Carregando carrinho...</Heading>
        <LoadingSpinner />
      </>
    )
  }

  return (
    <div className='mx-auto mt-12 grid  grid-cols-1 gap-8 px-4 py-12 desktop:grid-cols-[1fr_400px] desktop:px-0'>
      {cart.length === 0 && !isLoading ? (
        <div className='flex flex-col items-center justify-center space-y-8 rounded-lg text-center text-foreground'>
          <Heading variant='h2' className='text-foreground'>
            Não encontramos produtos no carrinho.
          </Heading>

          <Button size='lg' variant='outline' asChild>
            <Link href={'/'}>Voltar para o início</Link>
          </Button>
        </div>
      ) : (
        <></>
      )}

      <div className='flex flex-col items-center space-y-4'>
        {cart &&
          cart.map((item, index) => (
            <>
              <CartCard
                key={item.id}
                cartItem={item}
                product={products.find(
                  (product) => product.id === item.productId,
                )}
              />
              {index < cart.length - 1 && <Separator />}
            </>
          ))}
      </div>

      <Card className='sticky top-6 h-fit '>
        <CardHeader>
          <h2 className='text-xl font-bold'>Resumo do Orçamento</h2>
        </CardHeader>
        <CardContent className='grid gap-4'>
          {cart &&
            cart.map((item) => (
              <div className='flex items-center justify-between'>
                <div>{item.productName}</div>
                <div className='font-bold'>{item.amount}x</div>
              </div>
            ))}
          <Separator />
          {cart && (
            <div className='flex items-center justify-between font-bold'>
              <div>Total</div>
              <div>
                {cart.reduce((acc, item) => acc + item.amount, 0)} itens
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex flex-col gap-2'>
          <Button size='lg' variant='outline' asChild className='w-full'>
            <Link href={'/'}>Voltar para o início</Link>
          </Button>

          <Button
            size='lg'
            variant='default'
            // disabled={cart.length === 0}
            asChild
            className='w-full'
          >
            <Link href={'/carrinho/finalizar'}>Enviar orçamento</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
