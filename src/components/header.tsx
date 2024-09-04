import Link from 'next/link'
import { StaticImageData } from 'next/image'

import { Company, Header as HeaderType } from '@/payload/payload-types'

import { Media } from './media'
import { HeaderNavigation } from './header-navigation'
import { Icons } from './icons'

type Props = HeaderType & {
  staticImage?: StaticImageData
  id?: string
} & Pick<Company['contact'], 'phone'>

export function Header({ logo, navigation, staticImage, id, phone }: Props) {
  return (
    <header className='h-20 w-full bg-background'>
      <div className='container flex h-full items-center gap-4'>
        <div className='flex-1 justify-start'>
          <Link
            href='/'
            className='flex h-16 w-48 items-center overflow-hidden desktop:h-20 desktop:w-60'
          >
            <Media priority resource={logo} src={staticImage} />
          </Link>
        </div>

        <div className='hidden tablet:block'>
          <HeaderNavigation {...navigation} />
        </div>

        <div className='hidden h-full flex-1 justify-end tablet:block'>
          <div className='flex h-full w-full items-center justify-end font-semibold'>
            {phone && (
              <Link
                href={`tel: ${phone}`}
                className='flex items-center gap-2 whitespace-nowrap text-sm leading-tight desktop:text-base'
              >
                <Icons.Phone className='h-6 w-6' />
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
