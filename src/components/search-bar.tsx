'use client'

import Link from 'next/link'

import { useCartStore } from './cart-store-provider'

import { Input } from './ui/input'
import { Button, buttonVariants } from './ui/button'

import { Large } from './typography/texts'

import { Heart, Menu, ShoppingCart, Search, SearchX } from 'lucide-react'

import { useSearchParams, useRouter } from 'next/navigation'
import { FormEvent } from 'react'
import { toast } from 'sonner'
import { CategoriesMenu } from './categories-menu'
import { Category } from '@/payload/payload-types'
import { NestedCategory, nestCategories } from '@/lib/categoryHierarchy'

export function SearchBar({ categories }: { categories: NestedCategory[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { cart } = useCartStore((state) => state)

  // const nestedCategories = nestCategories(categories)
  // console.log(nestedCategories)
  function handleSearch(e: FormEvent<HTMLFormElement>, query: string) {
    e.preventDefault()
    if (query.length >= 3) {
      router.push(`/pesquisa?query=${encodeURIComponent(query)}`)
    } else {
      toast('Sua pesquisa deve ter no mínimo 3 characteres.', {
        icon: <SearchX className='h-5 w-5 text-destructive' />,
      })
    }
  }

  return (
    <div className='flex h-16 w-full items-center justify-between bg-wotan'>
      <div className='container flex items-center justify-between'>
        {/* Shadcn Navigation Menu */}
        <CategoriesMenu categories={categories} />

        <form
          onSubmit={(e) => handleSearch(e, e.currentTarget.search.value)}
          className='mx-10 hidden max-w-[400px] grow rounded-md bg-background focus:ring-1 tablet:flex'
        >
          <label htmlFor='search' className='sr-only'>
            Search
          </label>
          <Input
            name='search'
            placeholder='Estou procurando por...'
            // minLength={3}
            maxLength={64}
            type='text'
            className='h-auto w-auto grow border-0 focus-visible:ring-0'
            defaultValue={searchParams.get('query')?.toString()}
          />
          <Button
            type='submit'
            size='icon'
            className='bg-background text-primary hover:bg-background'
          >
            <Search className='h-6 w-6' />
          </Button>
        </form>

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
              <span className='absolute -right-2 -top-2 flex aspect-square min-h-5 w-fit items-center justify-center rounded-full bg-wotanRed-400 text-center leading-none'>
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  )
}
