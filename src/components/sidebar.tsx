'use client'

import {
  Box,
  LayoutDashboard,
  ListOrdered,
  MessageCircleMore,
  Package,
  PackageCheck,
  PackageOpen,
  ScanBarcode,
  Settings,
  Users,
} from 'lucide-react'
import { Large, List, Muted } from './typography/texts'
import { Separator } from './ui/separator'
import { SidebarNavigationItem } from './sidebar-navigation-item'
import { PegasusIcon } from '@/pegasus/pegasus-stamp'

export function Sidebar() {
  return (
    <aside className='flex h-full max-h-[calc(100vh-32px)] min-h-[calc(100vh-32px)] flex-col rounded-sm border px-4 py-1'>
      <div className='mt-2 flex items-center gap-4'>
        <PegasusIcon className='h-8 w-8' />
        <Large className='text-2xl'>Wotan Brindes</Large>
      </div>
      <List className='ml-0 flex list-none flex-col gap-0.5 space-y-1 font-semibold'>
        <div className='flex select-none items-center justify-between'>
          <Muted className='text-sm font-semibold uppercase text-muted-foreground'>
            Menu
          </Muted>

          <Separator className='w-4/5' />
        </div>
        <SidebarNavigationItem
          href='/dashboard'
          icon={LayoutDashboard}
          text='Dashboard'
        />
        <SidebarNavigationItem
          icon={ScanBarcode}
          href='/dashboard/catalog'
          text='Catálogo'
        />
        <SidebarNavigationItem
          icon={PackageOpen}
          href='/dashboard/estimates'
          text='Orçamentos'
        />
        <SidebarNavigationItem
          icon={PackageCheck}
          href='/dashboard/orders'
          text='Pedidos'
        />
        <SidebarNavigationItem
          icon={Users}
          href='/dashboard/customers'
          text='Clientes'
        />
      </List>

      <div className='flex-1' />

      <div className='mb-2 space-y-1'>
        <SidebarNavigationItem
          icon={MessageCircleMore}
          href='/dashboard/feedback'
          text='Feedback'
        />
        <SidebarNavigationItem
          icon={Settings}
          href='/dashboard/settings'
          text='Configurações'
        />
      </div>
    </aside>
  )
}
