import Link from 'next/link'
import { Media } from './media'
import { Company, Setting } from '@/payload/payload-types'
import { StaticImageData } from 'next/image'
import Phone from './icons/phone'
import { HeaderNavigation } from './header-navigation'

type Props = Pick<
  Setting['header']['navigation'],
  'links' | 'logo' | 'style'
> & {
  staticImage?: StaticImageData
  id?: string
} & Pick<Company['contact'], 'phone'>

export function Header({ logo, links, style, staticImage, id, phone }: Props) {
  return (
    <header className='h-20 w-full'>
      <div className='container flex h-full items-center gap-4'>
        <div className='flex-1 justify-start '>
          <Link
            href='/'
            className='flex h-20 w-60 items-center overflow-hidden'
          >
            <Media resource={logo} src={staticImage} />
          </Link>
        </div>

        <div className='tablet:block hidden'>
          <HeaderNavigation links={links} style={style} />
        </div>

        <div className='tablet:block hidden  h-full flex-1 justify-end'>
          <div className='flex h-full w-full items-center justify-end font-semibold'>
            {phone && (
              <Link
                href='tel: (51) 1234-5678'
                className='flex items-center gap-2 whitespace-nowrap'
              >
                <Phone className='mr-2 inline h-6 w-6' />
                Precisa de ajuda?
                <br />
                {phone}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
