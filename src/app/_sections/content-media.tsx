import type { StaticImageData } from 'next/image'

import React from 'react'

import type { Page } from '../../payload/payload-types'

import { Media } from '../../components/media'
import RichText from '../../components/rickText'
import { H1 } from '@/components/typography/headings'
import { Lead } from '@/components/typography/texts'

type ContentMediaProps = Extract<
  Page['layout'][0],
  { blockType: 'content-media' }
> & {
  id?: string
  staticImage?: StaticImageData
}

export default function ContentMedia({
  media,
  mediaPosition = 'left',
  richText,
  staticImage,
  title,
  description,
}: ContentMediaProps) {
  return (
    <section className='w-full'>
      <div className='container flex flex-col items-center justify-center'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <H1 className='text-wotanRed-500'>{title}</H1>
          <Lead>{description}</Lead>
        </div>
        <div
          className={[
            'tablet:flex-row max-w-screen-desktop desktop:gap-8 relative flex w-full flex-col items-center justify-center gap-4',
            mediaPosition === 'left' &&
              'tablet:flex-row-reverse flex-col-reverse',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className='max-w-screen-tablet'>
            <RichText content={richText} />
          </div>
          <div className='shadow-wotan-light m-2 rounded-md object-cover '>
            <Media
              resource={media}
              // sizes='(max-width: 768px) 100vw, 30vw'
              src={staticImage}
              className='desktop:min-w-80 min-w-72 max-w-96'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
