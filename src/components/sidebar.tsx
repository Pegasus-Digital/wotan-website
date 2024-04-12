'use client'

import {
  Users,
  Settings,
  PackageOpen,
  PackageCheck,
  LayoutDashboard,
  HelpCircle,
  FileUp,
  UserCog,
  Mailbox,
  ShoppingCart,
  Barcode,
  Tags,
  Bookmark,
  AppWindow,
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
              icon={ShoppingCart}
              navItems={[
                {
                  text: 'Produtos',
                  icon: Barcode,
                  href: '/dashboard/catalogo/produtos',
                },
                {
                  text: 'Categorias',
                  icon: Tags,
                  href: '/dashboard/catalogo/categorias',
                },
                {
                  text: 'Atributos',
                  icon: Bookmark,
                  href: '/dashboard/catalogo/atributos',
                },
              ]}
            />

            <SidebarNavigationItem
              icon={PackageOpen}
              href='/dashboard/orcamentos'
              text='Orçamentos'
            />
            <SidebarNavigationItem
              icon={PackageCheck}
              href='/dashboard/pedidos'
              text='Pedidos'
            />
            <SidebarNavigationItem
              icon={Users}
              href='/dashboard/clientes'
              text='Clientes'
            />
            <SidebarNavigationItem
              icon={Mailbox}
              href='/dashboard/contato'
              text='Contato'
            />

            <SidebarSeparator title='admin' />

            <SidebarNavigationItem
              icon={AppWindow}
              href='/dashboard/pages'
              text='Páginas'
            />
            <SidebarNavigationItem
              icon={UserCog}
              href='/dashboard/usuarios'
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
              icon={HelpCircle}
              href='/dashboard/ajuda'
              text='Ajuda'
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
