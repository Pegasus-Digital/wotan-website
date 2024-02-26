import { FacebookIcon, Mail, MapPin, Phone } from 'lucide-react'
import {
  LinkedInLogoIcon,
  TwitterLogoIcon,
  InstagramLogoIcon,
} from '@radix-ui/react-icons'

import { Lead, LinkIcon, NavLink, Small } from './typography/texts'
import { Company, Setting } from '@/payload/payload-types'
import { StaticImageData } from 'next/image'

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
    <footer className='bg-wotan text-primary-foreground w-full py-6'>
      {/* Container */}
      <div className='tablet:flex-row container flex w-full flex-col justify-between gap-6'>
        {/* Logo and Company Info */}
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <img
            alt='Wotan Logo'
            src='https://wotan-site.medialinesistemas.com.br/storage/company/footer/10051620230522646b688c4118c.png'
            className='max-h-[200px] w-full'
          />

          {companyInfo.showAddress === true && (
            <Small>
              <MapPin className='mr-2 inline h-5 w-5' />
              {adress.adress.street}, {adress.adress.number} -{' '}
              {adress.adress.neighborhood}, {adress.adress.city} -{' '}
              {adress.adress.state}, {adress.adress.cep}
            </Small>
          )}

          <div className='tablet:flex-row flex flex-col items-center gap-4'>
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
          </div>

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

        {/* Columns */}
        <div className='tablet:mt-8 flex w-full justify-evenly gap-3'>
          {columns.map((column) => (
            <FooterColumn
              key={column.title}
              title={column.title}
              links={column.links}
            />
          ))}

          <FooterColumn title={'Sobre nós'} links={[]} />
          {/* <iframe
            src='https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fwotanbrindes%2F&tabs=timeline&width=340&height=271&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1385369231684652'
            width='340'
            height='271'
            // style='border:none;overflow:hidden'
            scrolling='no'
            // frameborder='0'
            // allowfullscreen='true'
            allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
          ></iframe> */}
        </div>
      </div>
    </footer>
  )
}

interface FooterColumnProps {
  title: string
  links: { title?: string; href?: string; id?: string }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <nav className='tablet:text-start space-y-1 text-center'>
      <Lead className='text-primary-foreground tablet:text-xl mb-2.5 whitespace-nowrap text-base font-bold'>
        {title}
      </Lead>

      {links.map((link) => (
        <NavLink className='block py-1' key={link.title} href={link.href}>
          {link.title}
        </NavLink>
      ))}
    </nav>
  )
}
