import Link from 'next/link'
import { ElementType } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible'
import { ChevronDown } from 'lucide-react'

interface SidebarNavItem {
  text: string
  href: string
  icon: ElementType
}

const activeRouteStyles =
  'bg-primary text-primary-foreground group-hover:text-primary-foreground group-hover:bg-accent'
const activeRouteIconStyle =
  'text-primary-foreground stroke-primary-foreground stroke-2'

export function SidebarNavigationItem({
  text,
  href,
  icon: Icon,
}: SidebarNavItem) {
  const pathname = usePathname()

  const isActiveRoute = pathname === href

  return (
    <Link
      aria-disabled={isActiveRoute}
      className={cn(
        `group mt-0 flex items-center justify-between rounded-sm border border-transparent px-1 py-2 font-medium text-muted-foreground transition-all hover:cursor-pointer hover:border-primary/10 hover:bg-secondary hover:text-primary-foreground`,
        isActiveRoute ? activeRouteStyles : null,
      )}
      href={href}
    >
      <div className='flex items-center gap-2'>
        <Icon
          className={cn(
            'h-5 w-5 stroke-2 text-muted-foreground group-hover:text-primary-foreground',
            isActiveRoute ? activeRouteIconStyle : null,
          )}
        />
        <span>{text}</span>
      </div>
    </Link>
  )
}

interface SidebarCollapsibleProps {
  text: string
  icon: ElementType
  navItems: SidebarNavItem[]
}

export function SidebarCollapsible({
  text,
  icon: Icon,
  navItems,
}: SidebarCollapsibleProps) {
  const pathname = usePathname()

  const isActive = pathname.includes('catalog')
  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <button
          type='button'
          className={cn(
            'group mt-0 flex w-full items-center justify-between rounded-sm border border-transparent px-1 py-2 font-medium text-muted-foreground transition-all hover:cursor-pointer hover:border-primary/10 hover:bg-secondary hover:text-foreground',
            isActive ? 'border-border' : null,
          )}
        >
          <div className='flex items-center gap-2 group-hover:text-primary-foreground'>
            <Icon className='h-5 w-5 stroke-2' />
            <span>{text}</span>
          </div>

          <ChevronDown className='h-5 w-5 stroke-1 transition group-hover:scale-125 group-hover:text-primary-foreground group-data-[state=open]:rotate-180' />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className='ml-2 mt-1 space-y-1 rounded-b-md border-l pl-2'>
        {navItems.map((item) => (
          <SidebarNavigationItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            href={item.href}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}
