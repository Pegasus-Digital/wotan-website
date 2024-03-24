'use client'

import { useEffect, useState } from 'react'

import { Heart, Trash, X } from 'lucide-react'

import { toast } from 'sonner'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

import { useCartStore } from './cart-store-provider'
import { Product } from '@/payload/payload-types'
import { Image } from './media/image'
import { Heading } from '@/pegasus/heading'
import { Small } from './typography/texts'
import { Card } from './ui/card'
import { LoadingSpinner } from './spinner'

export function FavoritesDrawer() {
  const { favorites, removeFavorite } = useCartStore((state) => state)
  const [products, setProducts] = useState<Product[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

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
          <Heart className='h-6 w-6 group-hover:fill-white' />
          {favorites.length > 0 && (
            <span className='absolute -right-2 -top-2 flex aspect-square min-h-5 w-fit items-center justify-center rounded-full bg-wotanRed-400 text-center leading-none'>
              {favorites.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className='right-0 w-full max-w-96'>
        <ScrollArea className='max-h-screen min-h-screen overflow-y-auto p-4'>
          <DrawerHeader>
            <DrawerTitle className='text-xl'>Favoritos</DrawerTitle>
            <DrawerDescription>Seus produtos favoritos</DrawerDescription>
          </DrawerHeader>

          <div className='flex flex-col items-center space-y-2'>
            {products.length === 0 && !isLoading && (
              <Small>Nenhum item foi adicionado aos favoritos.</Small>
            )}

            {isLoading && <LoadingSpinner />}

            {!isLoading &&
              products.map((product) => (
                <Card key={product.id} className='flex w-full items-center'>
                  <Image
                    imgClassName='w-16 h-16'
                    resource={product.featuredImage}
                  />

                  <div className='flex flex-col space-y-2'>
                    <Heading variant='h6'>{product.title}</Heading>
                    <Small>{product.description}</Small>
                  </div>

                  <Button onClick={() => handleRemoveFavorite(product.id)}>
                    <Trash />
                  </Button>
                </Card>
              ))}
          </div>

          <DrawerFooter className='mt-6'>
            <Button onClick={() => handleClearFavorites()}>
              <Trash className='mr-2 h-5 w-5' />
              Limpar
            </Button>
          </DrawerFooter>
        </ScrollArea>

        <DrawerClose className='absolute right-2 top-2'>
          <X className='h-5 w-5' />
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  )
}
