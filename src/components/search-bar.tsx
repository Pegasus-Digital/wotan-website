'use client'

import Link from 'next/link'
import { FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { NestedCategory } from '@/lib/category-hierarchy'

import { Input } from './ui/input'
import { CategoriesMenu } from './categories-menu'
import { FavoritesDrawer } from './favorites-drawer'
import { Button, buttonVariants } from './ui/button'
import { useCartStore } from './cart-store-provider'

import { ShoppingCart, Search, SearchX } from 'lucide-react'

export function SearchBar({ categories }: { categories: NestedCategory[] }) {
  const searchParams = useSearchParams()

  const router = useRouter()

  const { cart } = useCartStore((state) => state)

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
        <div className='hidden tablet:block'>
          <CategoriesMenu categories={categories} />
        </div>
        <form
          onSubmit={(e) => handleSearch(e, e.currentTarget.search.value)}
          className='flex max-w-xl grow rounded-md bg-background focus:ring-1 tablet:mx-10'
        >
          <label htmlFor='search' className='sr-only'>
            Search
          </label>
          <Input
            id='search'
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
        <div className='hidden gap-2 text-primary-foreground tablet:flex'>
          <FavoritesDrawer />

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
