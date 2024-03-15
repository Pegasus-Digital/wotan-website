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
import { Header } from '@/payload/payload-types'
import { getHref } from './link'

type HeaderNavigationProps = Pick<Header['navigation'], 'links' | 'style'>

type LinkProps = Pick<
  HeaderNavigationProps['links'][0],
  'linkTo' | 'onlyLink' | 'columns' | 'subLinks'
>

function MegaMenu({ linkTo, columns }: LinkProps) {
  return (
    <NavigationMenuItem>
      <Link href={getHref({ ...linkTo })} legacyBehavior passHref>
        <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
          {linkTo.label}
        </NavigationMenuTrigger>
      </Link>
      <NavigationMenuContent className='shadow-wotan-light'>
        <ul
          className={`grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-${columns.length} grid-flow-col	 `}
        >
          {columns.map((column, index) => {
            if (column.type === 'card') {
              return (
                <li key={index} className={``}>
                  <MegaMenuCard
                    title={column.content.title}
                    description={column.content.description}
                  />
                </li>
              )
            } else if (column.type === 'linkCol') {
              return (
                <div className='grid grid-flow-row' key={index}>
                  {column.linkColumn.map((child, index) => (
                    <ListItem
                      key={index}
                      title={child.link.label}
                      href={getHref({ ...child.link })}
                    >
                      {child.description}
                    </ListItem>
                  ))}
                </div>
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
        className='flex h-full w-full select-none flex-col justify-end rounded-md bg-wotan p-6 text-center text-primary-foreground no-underline outline-none focus:shadow-md'
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
        <Lead className='text-sm leading-tight text-primary-foreground'>
          {description}
        </Lead>
      </a>
    </NavigationMenuLink>
  )
}

function Dropdown({ linkTo, subLinks }: LinkProps) {
  return (
    <NavigationMenuItem>
      <Link href={getHref({ ...linkTo })} legacyBehavior passHref>
        <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
          {linkTo.label}
        </NavigationMenuTrigger>
      </Link>
      <NavigationMenuContent>
        <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
          {subLinks.map((child, index) => (
            <ListItem
              key={index}
              title={child.link.label}
              href={getHref({ ...child.link })}
            ></ListItem>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}

function Classic({ linkTo }: LinkProps) {
  return (
    <NavigationMenuItem>
      <Link href={getHref({ ...linkTo })} legacyBehavior passHref>
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          {linkTo.label}
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
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          {children && (
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
              {children}
            </p>
          )}
        </a>
      </NavigationMenuLink>
    </li>
  )
})

ListItem.displayName = 'ListItem'
