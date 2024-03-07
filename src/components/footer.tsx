import { FacebookIcon, Mail, MapPin, Phone } from 'lucide-react'
import {
  LinkedInLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons'

import { Lead, LinkIcon, NavLink, Small } from './typography/texts'
import { Company, Setting } from '@/payload/payload-types'
import { StaticImageData } from 'next/image'
import { Button } from '@/pegasus/button'
import Link from 'next/link'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'

// interface FooterProps {
//   logo?: string
//   address?: string
//   email?: string | null
//   phone?: string
// }

type FooterProps = Pick<
  Setting['footer'],
  'logo' | 'companyInfo' | 'columns'
> & {
  staticImage?: StaticImageData
  id?: string
} & Pick<Company, 'adress' | 'contact'>

export function Footer({
  logo,
  companyInfo,
  columns,
  staticImage,
  id,
  adress,
  contact,
}: FooterProps) {
  return (
    <footer className='bg-footer w-full bg-wotanRed-500  text-primary-foreground backdrop-blur	 desktop:min-h-96'>
      {/* Container */}
      <div className='container flex w-full max-w-screen-desktop flex-col items-center justify-center gap-4 py-6 tablet:flex-row desktop:gap-8 '>
        {/* Logo and Company Info */}
        <div className='flex w-full justify-center  tablet:w-2/5 desktop:w-1/4'>
          <div className='flex min-w-80 shrink flex-col gap-4 text-start'>
            <img
              alt='Wotan Logo'
              src='https://wotan-site.medialinesistemas.com.br/storage/company/footer/10051620230522646b688c4118c.png'
              className='max-h-[200px] w-full max-w-80 px-4'
            />

            {companyInfo.showAddress === true && (
              <Small className='flex items-center whitespace-nowrap'>
                <MapPin className='mr-2 h-5 w-5' />
                {adress.adress.street}
                {', '}
                {adress.adress.number}
                {' - '}
                {adress.adress.neighborhood}
                {/* {', '} */}
                <br />
                {adress.adress.city}
                {' - '}
                {adress.adress.state}
                {', '}
                {adress.adress.cep}
              </Small>
            )}

            {companyInfo.showPhone === true && (
              <Small className='flex items-center whitespace-nowrap'>
                <Phone className='mr-2 h-5 w-5' />
                {contact.phone}
              </Small>
            )}

            {companyInfo.showEmail === true && (
              <Small className='flex items-center whitespace-nowrap'>
                <Mail className='mr-2 h-5 w-5' />
                {contact.email}
              </Small>
            )}

            <div className='flex items-center'>
              <Small className='mr-5 whitespace-nowrap'>Redes sociais</Small>
              <div className='flex space-x-2'>
                <LinkIcon href='/' Icon={InstagramLogoIcon} />
                <LinkIcon href='/' Icon={LinkedInLogoIcon} />
                <LinkIcon href='/' Icon={TwitterLogoIcon} />
                <LinkIcon href='/' Icon={FacebookIcon} />
              </div>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className='flex w-4/5 flex-col gap-4 text-start tablet:w-3/5 tablet:flex-row desktop:w-3/4'>
          {columns.map((column) => (
            <div
              className='flex w-full justify-center tablet:w-1/2 desktop:w-1/3 '
              key={column.title}
            >
              <FooterColumn title={column.title} links={column.links} />
            </div>
          ))}
          <div className='hidden w-1/3 flex-col space-y-1 text-center desktop:flex desktop:text-start'>
            <Lead className='my-2.5 whitespace-nowrap text-base font-bold text-primary-foreground tablet:text-xl'>
              {'Facebook'}
            </Lead>

            <iframe
              src='https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fwotanbrindes%2F&tabs=timeline&width=340&height=271&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1385369231684652'
              // style='border:none;overflow:hidden'
              scrolling='no'
              // frameborder='0'
              // allowfullscreen='true'
              width={340}
              height={271}
              allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
              className='h-full w-full'
            ></iframe>
          </div>
        </div>
      </div>
      <PegasusStamp />
    </footer>
  )
}

interface FooterColumnProps {
  title: string
  links: { title?: string; href?: string; id?: string }[]
}

// type FooterColumnProps = Pick<FooterProps, 'title' | 'links'>

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <nav className='flex shrink flex-col space-y-1 text-start'>
      <Lead className='my-3 whitespace-nowrap text-base font-bold text-primary-foreground tablet:text-xl'>
        {title}
      </Lead>

      {links.map((link) => (
        <Button
          variant='linkHover2'
          key={link.title}
          asChild
          className='self-start'
        >
          <Link href={link.href}>{link.title}</Link>
        </Button>
      ))}
    </nav>
  )
}
