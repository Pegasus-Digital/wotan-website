'use client'

import { usePathname } from 'next/navigation'

import { useAdminAuth } from './admin-auth-provider'

import {
  Tags,
  Users,
  FileUp,
  UserCog,
  Mailbox,
  Barcode,
  Bookmark,
  Settings,
  AppWindow,
  HelpCircle,
  PackageOpen,
  PackageCheck,
  LayoutDashboard,
} from 'lucide-react'

import WotanLogo from './logo-wotan'

import { Icons } from './icons'
import { Skeleton } from './ui/skeleton'
import { Separator } from './ui/separator'
import { LoadingSpinner } from './spinner'
import { SidebarCollapsible, SidebarNavigationItem } from './sidebar-navigation'

import { Large, List, Muted } from './typography/texts'

export function Sidebar() {
  const { status } = useAdminAuth()
  const path = usePathname()

  return (
    <>
      {status === 'loggedIn' ? (
        <aside className='sticky top-4 flex h-full max-h-[calc(100vh-96px)]  flex-col rounded-sm border px-4 py-1'>
          <div className='mt-2 flex items-center gap-4'>
            <WotanLogo className='h-8 w-8' />
            <Large className='text-2xl text-wotanRed-500'>Wotan Brindes</Large>
          </div>
          <List className='ml-0 flex list-none flex-col gap-0.5 space-y-1 font-semibold'>
            <SidebarSeparator title='menu' />

            <SidebarNavigationItem
              href='/painel'
              icon={LayoutDashboard}
              text='Dashboard'
            />

            <SidebarCollapsible
              text='Catálogo'
              icon={Icons.Cart}
              navItems={[
                {
                  text: 'Produtos',
                  icon: Barcode,
                  href: '/painel/catalogo/produtos',
                },
                {
                  text: 'Categorias',
                  icon: Tags,
                  href: '/painel/catalogo/categorias',
                },
                {
                  text: 'Atributos',
                  icon: Bookmark,
                  href: '/painel/catalogo/atributos',
                },
              ]}
            />

            <SidebarNavigationItem
              icon={PackageOpen}
              href='/painel/orcamentos'
              text='Orçamentos'
            />
            <SidebarNavigationItem
              icon={PackageCheck}
              href='/painel/pedidos'
              text='Pedidos'
            />
            <SidebarNavigationItem
              icon={Users}
              href='/painel/clientes'
              text='Clientes'
            />
            <SidebarNavigationItem
              icon={Users}
              href='/painel/vendedores'
              text='Vendedores'
            />
            <SidebarNavigationItem
              icon={Mailbox}
              href='/painel/contato'
              text='Contato'
            />

            <SidebarSeparator title='admin' />

            <SidebarNavigationItem
              icon={AppWindow}
              href='/painel/pages'
              text='Páginas'
            />
            <SidebarNavigationItem
              icon={UserCog}
              href='/painel/usuarios'
              text='Usuários'
            />
            <SidebarNavigationItem
              icon={FileUp}
              href='/painel/arquivos'
              text='Arquivos'
            />
            <SidebarNavigationItem
              icon={Settings}
              href='/painel/configuracoes'
              text='Configurações'
            />
          </List>

          <div className='flex-1' />

          <div className='mb-2 space-y-1'>
            <SidebarNavigationItem
              icon={HelpCircle}
              href='/painel/ajuda'
              text='Ajuda'
            />
          </div>
        </aside>
      ) : path.includes('/login') ? null : (
        <Skeleton className='sticky top-4 flex h-full max-h-[calc(100vh-96px)] flex-col items-center  justify-center rounded-sm border px-4 py-1'>
          <LoadingSpinner />
        </Skeleton>
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
