'use client'

import Link from 'next/link'
import { NestedCategory } from '@/lib/category-hierarchy'

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

import { Button } from '@/pegasus/button'

import { Large } from './typography/texts'

import { ChevronsDown } from 'lucide-react'

interface CategoriesMenuProps {
  categories: NestedCategory[]
}

export function CategoriesMenu({ categories }: CategoriesMenuProps) {
  const renderDropdownMenu = (cats: NestedCategory[], depth: number) => {
    if (depth >= 5) return null

    return cats.map((cat, index) => {
      if (cat.children.length >= 1) {
        return (
          <DropdownMenuSub key={index}>
            <Link href={`/categorias${cat.url}`} passHref>
              <DropdownMenuSubTrigger className='cursor-pointer p-2'>
                {cat.title}
              </DropdownMenuSubTrigger>
            </Link>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className='min-w-72 cursor-pointer font-semibold'>
                {renderDropdownMenu(cat.children, depth + 1)}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        )
      } else {
        return (
          <Link href={`/categorias${cat.url}`} passHref key={index}>
            <DropdownMenuItem className='cursor-pointer p-2'>
              {cat.title}
            </DropdownMenuItem>
          </Link>
        )
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='flex items-center justify-center gap-2 text-primary-foreground hover:brightness-125'>
          <ChevronsDown className='h-6 w-6 stroke-2' />
          <Large>Produtos</Large>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='min-w-72 font-semibold'>
        {renderDropdownMenu(categories, 0)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
