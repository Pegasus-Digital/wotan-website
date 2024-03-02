'use client'

import { Heart, Menu, ShoppingCart } from 'lucide-react'
import { Input } from './ui/input'
import { Large } from './typography/texts'
import { Button } from './ui/button'

export function SearchBar() {
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
          <Button
            className='hover:bg-primary hover:text-primary-foreground'
            size='icon'
            variant='ghost'
          >
            <ShoppingCart className='h-6 w-6' />
          </Button>
        </div>
      </div>
    </div>
  )
}
