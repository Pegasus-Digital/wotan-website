import { FacebookIcon, MapPin } from 'lucide-react'
import { Large, Small } from './typography/texts'
import {
  LinkedInLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className='bg-wotan text-primary-foreground w-full py-6'>
      {/* Container */}
      <div className='tablet:flex-row container flex w-full flex-col justify-between'>
        {/* Logo and address */}
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <img
            alt='Wotan Logo'
            src='https://wotan-site.medialinesistemas.com.br/storage/company/footer/10051620230522646b688c4118c.png'
            className='max-h-[200px] w-full'
          />

          <Small>
            <MapPin className='mr-2 inline h-5 w-5' />
            João Guimarães, 301 • Santa Cecília, Porto Alegre - RS, 90630-170
          </Small>

          <div className='flex gap-4'>
            <Small className='flex items-center whitespace-nowrap'>
              <MapPin className='mr-2 h-5 w-5' />
              (51) 3321-1996
            </Small>
            <Small className='flex items-center whitespace-nowrap'>
              <MapPin className='mr-2 h-5 w-5' />
              wotan@wotanbrindes.com.br
            </Small>
          </div>

          <div className='flex items-center'>
            <Small className='mr-5'>Redes sociais</Small>
            <div className='flex space-x-4'>
              <InstagramLogoIcon className='h-5 w-5' />
              <LinkedInLogoIcon className='h-5 w-5' />
              <TwitterLogoIcon className='h-5 w-5' />
              <FacebookIcon className='h-5 w-5' />
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className='mt-6 flex flex-col space-y-4'>
          <Large className='mb-2.5'>Sobre nós</Large>

          <Link href='/'>Item 1</Link>
          <Link href='/'>Item 2</Link>
          <Link href='/'>Item 3</Link>
          <Link href='/'>Item 4</Link>
        </div>
        <div className='mt-6 flex flex-col space-y-4'>
          <Large className='mb-2.5'>Suporte</Large>

          <Link href='/'>Item 1</Link>
          <Link href='/'>Item 2</Link>
          <Link href='/'>Item 3</Link>
          <Link href='/'>Item 4</Link>
        </div>
        <div className='mt-6 flex flex-col space-y-4'>
          <Large className='mb-2.5'>Título da coluna</Large>

          <Link href='/'>Item 1</Link>
          <Link href='/'>Item 2</Link>
          <Link href='/'>Item 3</Link>
          <Link href='/'>Item 4</Link>
        </div>
      </div>
    </footer>
  )
}
