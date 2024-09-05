'use client'

import Link from 'next/link'

import { NestedCategory } from '@/lib/category-hierarchy'

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu'

import { Icons } from './icons'
import { Button } from '@/pegasus/button'
import { Large } from './typography/texts'

interface CategoriesMenuProps {
  categories: NestedCategory[]
}

export function CategoriesMenu({ categories }: CategoriesMenuProps) {
  const renderDropdownMenu = (cats: NestedCategory[], depth: number) => {
    if (depth >= 5) return null

    return cats.map((category, index) => {
      if (category.children.length >= 1) {
        return (
          <DropdownMenuSub key={index}>
            <Link href={`/categorias${category.url}`} passHref>
              <DropdownMenuSubTrigger className='cursor-pointer p-2'>
                {category.title}
              </DropdownMenuSubTrigger>
            </Link>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='min-w-72 cursor-pointer font-semibold'>
                {renderDropdownMenu(category.children, depth + 1)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )
      } else {
        return (
          <Link href={`/categorias${category.url}`} passHref key={index}>
            <DropdownMenuItem className='cursor-pointer p-2'>
              {category.title}
            </DropdownMenuItem>
          </Link>
        )
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='group flex items-center justify-center gap-2 text-primary-foreground transition-all hover:brightness-125'>
          <Icons.ChevronsDown className='h-6 w-6 stroke-2 transition-all group-data-[state=open]:rotate-180' />
          <Large className='select-none'>Produtos</Large>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='min-w-72 font-semibold'>
        {renderDropdownMenu(categories, 0)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
