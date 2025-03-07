import { UserNavAdmin, UserNavSales } from './user-nav'
import { SheetMenu } from './sheet-menu'

interface NavbarProps {
  title: string
  children?: React.ReactNode
}

export function NavbarAdmin({ title, children }: NavbarProps) {
  return (
    <header className='sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 '>
      <div className='mx-4 flex h-14 items-center sm:mx-8'>
        <div className='flex items-center space-x-4 lg:space-x-0'>
          <SheetMenu />
          <h1 className='text-xl font-bold text-wotanRed-500'>{title}</h1>
        </div>
        <div className='flex flex-1 items-center justify-end px-4'>
          {children}
        </div>
        <div className='flex items-center '>
          <UserNavAdmin />
        </div>
      </div>
    </header>
  )
}

export function NavbarSales({ title, children }: NavbarProps) {
  return (
    <header className='sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 '>
      <div className='mx-4 flex h-14 items-center sm:mx-8'>
        <div className='flex items-center space-x-4 lg:space-x-0'>
          <SheetMenu />
          <h1 className='text-xl font-bold text-wotanRed-500'>{title}</h1>
        </div>
        <div className='flex flex-1 items-center justify-end px-4'>
          {children}
        </div>
        <div className='flex items-center '>
          <UserNavSales />
        </div>
      </div>
    </header>
  )
}

