'use client'

import Link from 'next/link'

import { FavoritesDrawer } from './favorites-drawer'
import { Icons } from './icons'
import { buttonVariants } from './ui/button'
import { useCartStore } from './cart-store-provider'
import { cn } from '@/lib/utils'

export function FavoritesCartActions({ className }: { className?: string }) {
  const { cart } = useCartStore((state) => state)

  return (
    <div className={cn('flex gap-2', className)}>
      <FavoritesDrawer />

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
        <Icons.Cart className='h-6 w-6' />

        {cart.length > 0 && (
          <span className='absolute -right-2 -top-2 flex aspect-square min-h-5 w-fit items-center justify-center rounded-full bg-wotanRed-400 text-center leading-none'>
            {cart.length}
          </span>
        )}
      </Link>
    </div>
  )
}
