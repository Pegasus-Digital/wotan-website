'use client'

import Link from 'next/link'

import { useCartStore } from './cart-store-provider'

import { Input } from './ui/input'
import { Button, buttonVariants } from './ui/button'

import { Large } from './typography/texts'

import { Heart, Menu, ShoppingCart } from 'lucide-react'

export function SearchBar() {
  const { cart } = useCartStore((state) => state)

  return (
    <div className='flex h-16 w-full items-center justify-between bg-wotan'>
      <div className='container flex items-center justify-between'>
        {/* Shadcn Navigation Menu */}
        <div className='flex items-center justify-center gap-2 text-primary-foreground'>
          <Menu className='h-5 w-5' />
          <Large>Produtos</Large>
        </div>

        <Input
          className='mx-10 hidden max-w-[400px] tablet:flex'
          placeholder='Estou procurando por...'
        />

        {/* Actions */}
        <div className='flex gap-2 text-primary-foreground'>
          {/* Favorite items drawer */}
          <Button
            className='hover:bg-primary hover:text-primary-foreground'
            size='icon'
            variant='ghost'
          >
            <Heart className='h-6 w-6' />
          </Button>

          {/* Redirect to shopping cart */}
          <Link
            href='/carrinho'
            prefetch={true}
            className={buttonVariants({
              size: 'icon',
              variant: 'ghost',
              className:
                'relative hover:bg-primary hover:text-primary-foreground',
            })}
          >
            <ShoppingCart className='h-6 w-6' />

            {cart.length > 0 && (
              <span className='absolute -right-2 -top-2 flex aspect-square min-h-5 w-fit items-center justify-center rounded-full bg-wotanRed-500 text-center leading-none'>
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
