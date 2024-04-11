'use client'

import {
  Tag,
  Boxes,
  Users,
  Settings,
  PackageOpen,
  ScanBarcode,
  PackageCheck,
  LayoutDashboard,
  MessageCircleMore,
  FileUp,
  UserCog,
  LayoutTemplate,
  MessageSquareText,
} from 'lucide-react'

import { Large, List, Muted } from './typography/texts'

import { Separator } from './ui/separator'
import { SidebarCollapsible, SidebarNavigationItem } from './sidebar-navigation'
import WotanLogo from './logo-wotan'
import { useAdminAuth } from './admin-auth-provider'

export function Sidebar() {
  const { status } = useAdminAuth()
  return (
    <>
      {status === 'loggedIn' && (
        <aside className='sticky top-4 flex h-full max-h-[calc(100vh-96px)]  flex-col rounded-sm border px-4 py-1'>
          <div className='mt-2 flex items-center gap-4'>
            <WotanLogo className='h-8 w-8' />
            <Large className='text-2xl text-wotanRed-500'>Wotan Brindes</Large>
          </div>
          <List className='ml-0 flex list-none flex-col gap-0.5 space-y-1 font-semibold'>
            <SidebarSeparator title='menu' />

            <SidebarNavigationItem
              href='/dashboard'
              icon={LayoutDashboard}
              text='Dashboard'
            />

            <SidebarCollapsible
              text='Catálogo'
              icon={ScanBarcode}
              navItems={[
                {
                  text: 'Produtos',
                  icon: Boxes,
                  href: '/dashboard/catalog/produtos',
                },
                {
                  text: 'Propriedades',
                  icon: Tag,
                  href: '/dashboard/catalog/propriedades',
                },
              ]}
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

            <SidebarSeparator title='admin' />

            <SidebarNavigationItem
              icon={LayoutTemplate}
              href='/dashboard/pages'
              text='Páginas'
            />
            <SidebarNavigationItem
              icon={UserCog}
              href='/dashboard/users'
              text='Usuários'
            />
            <SidebarNavigationItem
              icon={FileUp}
              href='/dashboard/files'
              text='Arquivos'
            />
            <SidebarNavigationItem
              icon={Settings}
              href='/dashboard/settings'
              text='Configurações'
            />
          </List>

          <div className='flex-1' />

          <div className='mb-2 space-y-1'>
            <SidebarNavigationItem
              icon={MessageCircleMore}
              href='/dashboard/feedback'
              text='Feedback'
            />
          </div>
        </aside>
      )}
    </>
  )
}

interface SidebarSeparatorProps {
  title: string
}

function SidebarSeparator({ title }: SidebarSeparatorProps) {
  return (
    <div className='flex select-none items-center justify-between'>
      <Muted className='text-sm font-semibold uppercase text-muted-foreground'>
        {title}
      </Muted>

      <Separator className='w-3/5' />
    </div>
  )
}
