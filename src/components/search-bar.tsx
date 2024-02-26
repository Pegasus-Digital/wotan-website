'use client'

import { Heart, Menu, ShoppingCart } from 'lucide-react'
import { Input } from './ui/input'
import { Large } from './typography/texts'
import { Button } from './ui/button'

export function SearchBar() {
  return (
    <div className='bg-wotan flex h-16 w-full items-center justify-between'>
      <div className='container flex items-center justify-between'>
        {/* Shadcn Navigation Menu */}
        <div className='text-primary-foreground flex items-center justify-center gap-2'>
          <Menu className='h-5 w-5' />
          <Large>Produtos</Large>
        </div>

        <Input
          className='max-w-[480px]'
          placeholder='Estou procurando por...'
        />

        {/* Actions */}
        <div className='text-primary-foreground flex gap-2'>
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
