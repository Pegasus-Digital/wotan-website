import Link from 'next/link'
import { ElementType } from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

import { ChevronDown } from 'lucide-react'

interface SidebarNavItem {
  text: string
  href: string
  icon: ElementType
}

const activeRouteStyles =
  'bg-primary dark:bg-secondary text-primary-foreground dark:text-primary group-hover:text-foreground hover:bg-primary-foreground hover:dark:brightness-150'
const activeRouteIconStyle = 'text-primary-foreground stroke-2'

export function SidebarNavigationItem({
  text,
  href,
  icon: Icon,
}: SidebarNavItem) {
  const pathname = usePathname()

  const isActiveRoute = pathname === href

  return (
    <Link
      className={cn(
        `group mt-0 flex items-center justify-between rounded-sm border border-transparent px-1 py-2 font-medium text-muted-foreground transition-all hover:cursor-pointer hover:border-primary/10 hover:bg-secondary hover:text-foreground`,
        isActiveRoute ? activeRouteStyles : null,
      )}
      href={href}
    >
      <div className='flex items-center gap-2'>
        <Icon
          className={cn(
            'h-5 w-5 stroke-2 text-muted-foreground group-hover:text-foreground',
            isActiveRoute ? activeRouteIconStyle : null,
          )}
        />
        <span>{text}</span>
      </div>
      <ChevronDown
        className={cn(
          'h-5 w-5 stroke-1 text-muted-foreground transition group-hover:scale-125 group-hover:text-foreground',
          isActiveRoute ? activeRouteIconStyle : null,
        )}
      />
    </Link>
  )
}
