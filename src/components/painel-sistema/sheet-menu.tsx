import Link from 'next/link'
import { MenuIcon, PanelsTopLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Menu } from './menu'
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import WotanLogo from '../logo-wotan'

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className='lg:hidden' asChild>
        <Button className='h-8' variant='outline' size='icon'>
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex h-full flex-col px-3 sm:w-72' side='left'>
        <SheetHeader>
          {/* <Button
            className='flex items-center justify-center pb-2 pt-1'
            variant='link'
            asChild
          > */}
          {/* <Link href='/dashboard' className='flex items-center gap-2'> */}
          <WotanLogo className='mr-1 h-8 w-8' />

          <SheetTitle className='text-lg font-bold text-wotanRed-500'>
            Wotan Brindes
          </SheetTitle>
          {/* </Link> */}
          {/* </Button> */}
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  )
}
