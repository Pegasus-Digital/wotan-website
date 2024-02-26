'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Lead } from './typography/texts'

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Pegasus',
    href: '/pegasus',
    description:
      'A Pegasus Digital Solutions é a parceira que irá impulsionar o sucesso digital da sua empresa.',
  },
  {
    title: 'Digital',
    href: '/pegasus',
    description:
      'A Pegasus Digital Solutions é a parceira que irá impulsionar o sucesso digital da sua empresa.',
  },
  {
    title: 'Solutions',
    href: '/pegasus',
    description:
      'A Pegasus Digital Solutions é a parceira que irá impulsionar o sucesso digital da sua empresa.',
  },
  {
    title: 'A',
    href: '/pegasus',
    description:
      'A Pegasus Digital Solutions é a parceira que irá impulsionar o sucesso digital da sua empresa.',
  },
  {
    title: 'Software',
    href: '/pegasus',
    description:
      'A Pegasus Digital Solutions é a parceira que irá impulsionar o sucesso digital da sua empresa.',
  },
  {
    title: 'Company',
    href: '/pegasus',
    description:
      'A Pegasus Digital Solutions é a parceira que irá impulsionar o sucesso digital da sua empresa.',
  },
]

interface LinkProps {
  title: string
  href: string
  description: string
}

function MegaMenu() {}

function Dropdown() {}

function Classic({ title, href }: LinkProps) {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {title}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  )
}

// <NavigationMenuItem>
//   <NavigationMenuTrigger>Home</NavigationMenuTrigger>
//   <NavigationMenuContent></NavigationMenuContent>
//   </NavigationMenuList>
// </NavigationMenuItem>

export function HeaderNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Se link.onlyLink === true => return <Classic {...link} /> */}
        {/* links.map((link) => link.type === 'megamenu' return <MegaMenu {...link} /> )*/}
        <NavigationMenuItem>
          <NavigationMenuTrigger>Home</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
              {/* Main card */}
              <li className='row-span-3'>
                <NavigationMenuLink asChild>
                  <a
                    className='bg-wotan text-primary-foreground flex h-full w-full select-none flex-col justify-end rounded-md p-6 text-center no-underline outline-none focus:shadow-md'
                    href='/quem-somos'
                  >
                    <img
                      className='h-fit w-full'
                      src={
                        'https://wotan-site.medialinesistemas.com.br/storage/company/footer/10051620230522646b688c4118c.png'
                      }
                    />
                    {/* <Image alt='' src='/' width={156} height={54} /> */}
                    <div className='mb-2 mt-4 text-lg font-medium'>
                      Quem somos
                    </div>
                    <Lead className='text-primary-foreground text-sm leading-tight'>
                      Na Wotan, somos apaixonados por conectar pessoas com
                      lembranças autênticas.
                    </Lead>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href='/cases' title='Cases'>
                Em cada produto, criamos e contamos uma nova história.
              </ListItem>
              <ListItem href='/clientes' title='Clientes'>
                Nossa inspiração é ajudar a celebrar suas experiências
              </ListItem>
              <ListItem href='/faq' title='FAQ'>
                Respostas para suas perguntas mais usuais
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Sobre nós</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href='/docs' legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Fale conosco
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            className,
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
