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

import { Large, List, Muted } from '../../../../components/typography/texts'

import { Separator } from '../../../../components/ui/separator'
import {
  SidebarCollapsible,
  SidebarNavigationItem,
} from '../../../../components/sidebar-navigation'
import WotanLogo from '../../../../components/logo-wotan'
import { Skeleton } from '../../../../components/ui/skeleton'
import { LoadingSpinner } from '../../../../components/spinner'
import { usePathname } from 'next/navigation'
import { useSalesAuth } from '@/components/sales-auth-provider'

export function Sidebar() {
  const { status } = useSalesAuth()
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
              href='/sistema'
              icon={LayoutDashboard}
              text='Dashboard'
            />

            <SidebarNavigationItem
              icon={Barcode}
              href='/sistema/catalogo/produtos'
              text='Produtos'
            />

            <SidebarNavigationItem
              icon={PackageOpen}
              href='/sistema/orcamentos'
              text='Orçamentos'
            />
            <SidebarNavigationItem
              icon={PackageCheck}
              href='/sistema/pedidos'
              text='Pedidos'
            />
            <SidebarNavigationItem
              icon={Users}
              href='/sistema/clientes'
              text='Meus clientes'
            />

            <SidebarNavigationItem
              icon={Mailbox}
              href='/sistema/contato'
              text='Mensagens'
            />

            <SidebarSeparator title='config' />

            <SidebarNavigationItem
              icon={Settings}
              href='/sistema/preferencias'
              text='Preferências'
            />
          </List>

          <div className='flex-1' />

          <div className='mb-2 space-y-1'>
            <SidebarNavigationItem
              icon={HelpCircle}
              href='/sistema/ajuda'
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
