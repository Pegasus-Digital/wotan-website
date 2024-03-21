'use client'

import { Button } from '../pegasus/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu'
import { Menu } from 'lucide-react'
import { Large } from './typography/texts'
import { NestedCategory } from '@/lib/categoryHierarchy'
import Link from 'next/link'

export function CategoriesMenu({
  categories,
}: {
  categories: NestedCategory[]
}) {
  const renderDropdownMenu = (cats, depth) => {
    if (depth >= 5) return null

    return cats.map((cat, index) => {
      if (cat.children.length >= 1) {
        return (
          <DropdownMenuSub key={index}>
            <Link href={`/categorias${cat.url}`} passHref>
              <DropdownMenuSubTrigger className='p-2'>
                {cat.title}
              </DropdownMenuSubTrigger>
            </Link>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='min-w-72 font-semibold'>
                {renderDropdownMenu(cat.children, depth + 1)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )
      } else {
        return (
          <Link href={`/categorias${cat.url}`} passHref key={index}>
            <DropdownMenuItem className='p-2'>{cat.title}</DropdownMenuItem>
          </Link>
        )
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='flex items-center justify-center gap-2 text-primary-foreground'>
          <Menu className='h-6 w-6' />
          <Large>Produtos</Large>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-72  font-semibold' alignOffset={50}>
        {renderDropdownMenu(categories, 0)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
