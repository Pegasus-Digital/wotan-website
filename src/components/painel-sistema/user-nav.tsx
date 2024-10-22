'use client'

import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useAdminAuth } from '../admin-auth-provider'
import { useRouter } from 'next/navigation'

export function UserNav() {
  const { user, logout, status } = useAdminAuth()
  const route = useRouter()

  return (
    <>
      {status === 'loggedIn' ? (
        <DropdownMenu>
          <TooltipProvider disableHoverableContent>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='relative h-8 w-8 rounded-full'
                  >
                    <Avatar className='h-8 w-8'>
                      <AvatarImage src='#' alt='Avatar' />
                      <AvatarFallback className='bg-transparent'>
                        {user.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Perfil</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent className='w-56' align='end' forceMount>
            <DropdownMenuLabel className='font-normal'>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium leading-none'>{user.name}</p>
                <p className='text-xs leading-none text-muted-foreground'>
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                className='text-muted-foreground hover:cursor-pointer hover:text-white'
                asChild
              >
                <Link
                  href={`/painel/configuracoes/preferencias`}
                  className='flex items-center'
                >
                  <Settings className='mr-3 h-4 w-4  ' />
                  Preferencias
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='text-muted-foreground hover:cursor-pointer hover:text-white'
                asChild
              >
                <Link
                  href={`/painel/usuarios/${user.id}`}
                  className='flex items-center'
                >
                  <User className='mr-3 h-4 w-4 ' />
                  Conta
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-muted-foreground hover:cursor-pointer hover:text-white'
              onClick={async () => {
                await logout()
                route.push('/')
              }}
            >
              <LogOut className='mr-3 h-4 w-4 ' />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                className='relative h-8 w-8 rounded-full'
              >
                <Avatar className='h-8 w-8'>
                  <AvatarImage src='#' alt='Avatar' />
                  <AvatarFallback className='bg-transparent'>JD</AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>Perfil</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  )
}
