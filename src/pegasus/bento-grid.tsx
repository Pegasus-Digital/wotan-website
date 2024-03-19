import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { Link as LinkType } from '@/payload/payload-types'
import { getHref } from '@/components/link'

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        'mx-auto grid w-full auto-rows-[18rem] grid-cols-1  gap-4 bg-transparent tablet:grid-cols-4  ',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  image,
  linkTo,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  image?: React.ReactNode
  linkTo: string
}) => {
  return (
    <Link
      href={linkTo}
      className={cn(
        'group/bento relative row-span-1 flex flex-col justify-between overflow-hidden rounded-md  shadow-wotan-light  transition duration-200',
        className,
      )}
    >
      {image}
      <div className='absolute h-full w-full bg-gradient-to-b from-white/0 via-white/15 to-wotanRed-500/50 text-background '>
        <div className='absolute bottom-0 left-0'>
          <div className=' mb-2 ml-4 mt-2 text-xl font-bold transition group-hover/bento:translate-x-4'>
            {title}
          </div>
          {description && (
            <div className=' mb-2 ml-4 text-base font-semibold transition group-hover/bento:translate-x-6'>
              {description}
            </div>
          )}
        </div>{' '}
      </div>
    </Link>
  )
}
