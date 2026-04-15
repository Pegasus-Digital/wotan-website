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
  compact?: boolean
}

export function CategoriesMenu({ categories, compact = false }: CategoriesMenuProps) {
  const maxSubmenuDepth = compact ? 1 : 4

  const renderDropdownMenu = (cats: NestedCategory[], depth: number) => {
    const sortedCategories = [...cats].sort((a, b) =>
      a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' }),
    )

    return sortedCategories.map((category, index) => {
      const hasExpandableChildren =
        category.children.length >= 1 && depth < maxSubmenuDepth

      if (hasExpandableChildren) {
        return (
          <DropdownMenuSub key={index}>
            <Link href={`/categorias${category.url}`} passHref>
              <DropdownMenuSubTrigger className='cursor-pointer p-2'>
                {category.title}
              </DropdownMenuSubTrigger>
            </Link>
            <DropdownMenuPortal>
              <DropdownMenuSubContent
                className={`min-w-72 cursor-pointer font-semibold ${compact ? '-translate-x-1/2' : ''}`}
              >
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
          {!compact && <Large className='select-none'>Produtos</Large>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='min-w-72 font-semibold'>
        {renderDropdownMenu(categories, 0)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
