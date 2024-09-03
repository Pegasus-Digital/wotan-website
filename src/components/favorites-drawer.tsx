'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { toast } from 'sonner'

import { Category, Product } from '@/payload/payload-types'

import { Icons } from './icons'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Image } from './media/image'
import { LoadingSpinner } from './spinner'
import { ScrollArea } from './ui/scroll-area'

import { Small } from './typography/texts'
import { Heading } from '@/pegasus/heading'

import {
  Drawer,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
} from './ui/drawer'

import { useCartStore } from './cart-store-provider'

export function FavoritesDrawer() {
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [products, setProducts] = useState<Product[]>([])
  const { favorites, removeFavorite } = useCartStore((state) => state)

  function handleOpenChange(openState: boolean) {
    setOpen(openState)

    if (openState === true) {
      const fetchFavoriteProducts = async () => {
        try {
          setLoading(true)
          const response = await fetch(`/api/cart`, {
            body: JSON.stringify({
              productIds: favorites,
            }),
            method: 'POST',
          })

          const data = await response.json()

          setProducts(data.docs)
        } catch (error) {
          console.error(error)
          toast.error(error)
          setLoading(false)
        }
      }

      fetchFavoriteProducts()
    }
  }

  useEffect(() => {
    setLoading(false)
  }, [products])

  function handleClearFavorites() {
    favorites.map((item) => removeFavorite(item))

    toast.success('Sua lista de favoritos foi limpa com sucesso.')

    setProducts([])
  }

  function handleRemoveFavorite(id: string) {
    removeFavorite(id)

    const newProducts = products.filter((product) => product.id !== id)

    setProducts(newProducts)

    toast.success('Item excluído dos favoritos com sucesso.')
  }

  return (
    <Drawer onOpenChange={handleOpenChange} open={open} direction='right'>
      <DrawerTrigger asChild>
        <Button
          className='group relative hover:bg-primary hover:text-primary-foreground'
          size='icon'
          variant='ghost'
          onClick={() => setOpen(true)}
        >
          <Icons.Favorite className='h-6 w-6 group-hover:fill-white' />

          {favorites.length > 0 && (
            <span className='absolute -right-2 -top-2 flex aspect-square min-h-5 w-fit items-center justify-center rounded-full bg-wotanRed-400 text-center leading-none'>
              {favorites.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className='right-0 w-full max-w-[440px] pl-4'>
        <ScrollArea className='max-h-screen min-h-screen overflow-y-auto p-4 pt-12'>
          <DrawerHeader>
            <DrawerTitle className='text-xl'>Favoritos</DrawerTitle>
            <DrawerDescription>
              Seus produtos favoritos, clique para visitar a página.
            </DrawerDescription>
          </DrawerHeader>

          <div className='flex flex-col items-center space-y-2'>
            {products.length === 0 && !isLoading && (
              <Small>Nenhum item foi adicionado aos favoritos.</Small>
            )}

            {isLoading && <LoadingSpinner />}

            {!isLoading &&
              products.map((product) => (
                <Card
                  key={product.id}
                  className='flex w-full gap-2 px-2 py-1 shadow-md group-hover:bg-wotanRed-50'
                >
                  <Link
                    className='group flex w-full gap-2'
                    href={`/produtos/${product.id}`}
                  >
                    <Image
                      imgClassName='w-20 h-20 border rounded-md'
                      resource={product.featuredImage}
                    />

                    <div className='flex flex-1 flex-col space-y-2'>
                      <Heading className='m-0 p-0' variant='h6'>
                        {product.title}
                      </Heading>

                      <div className='mt-auto flex flex-wrap gap-2'>
                        {product.categories.map((category: Category) => {
                          return (
                            <Badge key={product.id}>{category.title}</Badge>
                          )
                        })}
                      </div>
                    </div>
                  </Link>

                  <Button
                    size='icon'
                    variant='outline'
                    onClick={() => handleRemoveFavorite(product.id)}
                    className='z-50'
                  >
                    <Icons.Trash />
                  </Button>
                </Card>
              ))}
          </div>

          <DrawerFooter className='mt-6'>
            <Button onClick={() => handleClearFavorites()}>
              <Icons.Trash className='mr-2 h-5 w-5' />
              Limpar
            </Button>
          </DrawerFooter>
        </ScrollArea>

        <DrawerClose className='absolute right-4 top-12'>
          <Icons.Close className='h-5 w-5' />
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
