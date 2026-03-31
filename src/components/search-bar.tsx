'use client'

import { FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { NestedCategory } from '@/lib/category-hierarchy'

import { Icons } from './icons'
import { Input } from './ui/input'
import { CategoriesMenu } from './categories-menu'
import { FavoritesCartActions } from './favorites-cart-actions'
import { Button } from './ui/button'

export function SearchBar({ categories }: { categories: NestedCategory[] }) {
  const searchParams = useSearchParams()

  const router = useRouter()

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const query = e.currentTarget.search.value

    if (query.length >= 3) {
      router.push(`/pesquisa?query=${encodeURIComponent(query)}`)
    } else {
      toast.warning('A pesquisa deve conter no mínimo 3 caracteres.', {
        icon: <Icons.SearchFail className='h-5 w-5' />,
      })
    }
  }

  return (
    <div className='flex h-16 w-full items-center justify-between bg-wotan'>
      <div className='container flex items-center justify-between'>
        <div className='hidden tablet:block'>
          <CategoriesMenu categories={categories} />
        </div>
        <form
          onSubmit={handleSearch}
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
            <Icons.Search className='h-6 w-6' />
          </Button>
        </form>

        <FavoritesCartActions className='hidden text-primary-foreground tablet:flex' />
      </div>
    </div>
  )
}
