import Link from 'next/link'
import { StaticImageData } from 'next/image'

import { Company, Footer as FooterType } from '@/payload/payload-types'

import { getHref } from './link'

import { Lead, LinkIcon, Small } from './typography/texts'

import { Icons } from './icons'
import { Image } from './media/image'
import { PegasusStamp } from '@/pegasus/pegasus-stamp'
import { Button, buttonVariants } from '@/pegasus/button'

import { FacebookIcon } from 'lucide-react'
import { LinkedInLogoIcon, InstagramLogoIcon } from '@radix-ui/react-icons'

type FooterProps = FooterType & {
  staticImage?: StaticImageData
  id?: string
} & Pick<Company, 'adress' | 'contact' | 'social'>

export function Footer({
  logo,
  companyInfo,
  columns,
  staticImage,
  id,
  adress,
  contact,
  social,
  facebookEmbed,
}: FooterProps) {
  return (
    <footer className=' mt-auto w-full  bg-wotanRed-500 bg-footer	 text-primary-foreground backdrop-blur desktop:min-h-96'>
      {/* Container */}
      <div className='container flex w-full max-w-screen-desktop flex-col items-center justify-center gap-4 py-6 tablet:flex-row desktop:gap-8 '>
        {/* Logo and Company Info */}
        <div className='flex w-full justify-center  tablet:w-2/5 desktop:w-1/4'>
          <div className='flex min-w-80 shrink flex-col items-center gap-4 text-start tablet:items-start'>
            <Image
              resource={logo}
              imgClassName='max-h-[200px] w-full max-w-80 px-4 contrast-200 bg-transparent'
              className='bg-transparent'
            />

            {companyInfo.showAddress === true && adress && (
              <Small className='flex items-center whitespace-nowrap leading-snug'>
                <Icons.Pin className='mr-2 h-5 w-5' />

                {`${adress.street}, ${adress.number} - ${adress.neighborhood}`}
                <br />
                {`${adress.city} - ${adress.state}, ${adress.cep}`}
              </Small>
            )}

            {companyInfo.showPhone === true && (
              <Link
                className='flex items-center'
                target='_blank'
                href={`tel:${contact.phone}`}
              >
                <Icons.Phone className='h-5 w-5' />
                <Small className={buttonVariants({ variant: 'linkHover2' })}>
                  {contact.phone}
                </Small>
              </Link>
            )}

            {companyInfo.showEmail === true && (
              <Link
                className='flex items-center'
                target='_blank'
                href={`mailto:${contact.email}`}
              >
                <Icons.Mail className='h-5 w-5' />
                <Small className={buttonVariants({ variant: 'linkHover2' })}>
                  {contact.email}
                </Small>
              </Link>
            )}

            {companyInfo.showSocial && (
              <section className='flex items-center'>
                <Small className='mr-5 whitespace-nowrap'>Redes sociais</Small>
                <div className='flex space-x-2'>
                  {social.instagram && (
                    <LinkIcon
                      target='_blank'
                      href={social.instagram}
                      Icon={InstagramLogoIcon}
                    />
                  )}

                  {social.linkedin && (
                    <LinkIcon
                      target='_blank'
                      href={social.linkedin}
                      Icon={LinkedInLogoIcon}
                    />
                  )}

                  {social.facebook && (
                    <LinkIcon
                      target='_blank'
                      href={social.facebook}
                      Icon={FacebookIcon}
                    />
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Columns */}
        <div className='flex w-4/5 flex-col gap-4 text-start tablet:w-3/5 tablet:flex-row desktop:w-3/4'>
          {columns.map((column, index) => (
            <div
              className='flex w-full justify-center tablet:w-1/2 desktop:w-1/3 '
              key={index}
            >
              <FooterColumn {...column} />
            </div>
          ))}
          {facebookEmbed && (
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
              />
            </div>
          )}
        </div>
      </div>
      <PegasusStamp />
    </footer>
  )
}

type FooterColumnProps = Pick<FooterProps['columns'][0], 'title' | 'links'>

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <nav className='flex shrink flex-col justify-center space-y-1 text-center tablet:justify-start tablet:text-start'>
      <Lead className='my-3 whitespace-nowrap text-base font-bold text-primary-foreground tablet:text-xl'>
        {title}
      </Lead>

      {links.map((child, index) => (
        <Button
          variant='linkHover2'
          key={index}
          asChild
          className='self-center text-center tablet:self-start tablet:text-start'
        >
          <Link href={getHref({ ...child.link })}>{child.link.label}</Link>
        </Button>
      ))}
    </nav>
  )
}
