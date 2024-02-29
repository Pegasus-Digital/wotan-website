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
import { Setting } from '@/payload/payload-types'

type HeaderNavigationProps = Pick<
  Setting['header']['navigation'],
  'links' | 'style'
>

type LinkProps = Pick<
  HeaderNavigationProps['links'][0],
  'href' | 'title' | 'onlyLink' | 'columns' | 'subLinks'
>

function MegaMenu({ title, href, columns }: LinkProps) {
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
          {title}
        </NavigationMenuTrigger>
      </Link>
      <NavigationMenuContent className='shadow-wotan-light'>
        <ul className='grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
          {columns.map((column, index) => {
            if (column.type === 'card') {
              return (
                <li key={index} className='row-span-3'>
                  <MegaMenuCard
                    title={column.content.title}
                    description={column.content.description}
                  />
                </li>
              )
            } else if (column.type === 'linkCol') {
              return (
                <React.Fragment key={index}>
                  {column.linkColumn.map((link, index) => (
                    <ListItem
                      key={link.title}
                      title={link.title}
                      href={link.href}
                    >
                      {link.description}
                    </ListItem>
                  ))}
                </React.Fragment>
              )
            }
          })}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

function MegaMenuCard({
  title,
  description,
}: LinkProps['columns'][0]['content']) {
  return (
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
        <div className='mb-2 mt-4 text-lg font-medium'>{title}</div>
        <Lead className='text-primary-foreground text-sm leading-tight'>
          {description}
        </Lead>
      </a>
    </NavigationMenuLink>
  )
}

function Dropdown({ title, href, subLinks }: LinkProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
          {subLinks.map((link) => (
            <ListItem
              key={link.title}
              title={link.title}
              href={link.href}
            ></ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

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

const menuTypes = {
  classic: Classic,
  dropdown: Dropdown,
  megaMenu: MegaMenu,
}

export function HeaderNavigation({ links, style }: HeaderNavigationProps) {
  const Menu = menuTypes[style || 'classic']

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* links.map if style == classic => <Classic /> if style == megamenu => <MegaMenu /> if style == dropdown => <Dropdown />  */}
        {/* link.onlyLink == true => <Classic /> else => style */}
        {links.map((link, index) => {
          if (link.onlyLink === false) {
            return <Menu key={index} {...link} />
          }
          return <Classic key={index} {...link} />
        })}
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
          {children && (
            <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = 'ListItem'
