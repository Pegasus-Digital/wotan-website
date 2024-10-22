'use client'
import { Menu } from './menu'
import { SidebarToggle } from './sidebar-toggle'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/hooks/use-sidebar'
import { useStore } from '@/hooks/use-store'
import { cn } from '@/lib/utils'
import { PanelsTopLeft } from 'lucide-react'
import Link from 'next/link'
import WotanLogo from '../logo-wotan'

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x)
  if (!sidebar) return null
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
        !getOpenState() ? 'w-[90px]' : 'w-72',
        settings.disabled && 'hidden',
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className='relative flex h-full flex-col overflow-y-auto overflow-x-hidden px-3 py-4 shadow-md '
      >
        <div
          className={cn(
            'flex items-center justify-center transition-colors',
            'mb-1 transition-transform duration-300 ease-in-out',
          )}
        >
          <div className='flex items-center gap-2'>
            <WotanLogo className={cn('h-8 w-8', getOpenState() && 'mr-1')} />

            <h1
              className={cn(
                'whitespace-nowrap text-xl font-bold  text-wotanRed-500 transition-[transform,opacity,display] duration-300 ease-in-out',
                !getOpenState()
                  ? 'hidden -translate-x-96 opacity-0'
                  : 'translate-x-0 opacity-100',
              )}
            >
              Wotan Brindes
            </h1>
          </div>
        </div>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  )
}
