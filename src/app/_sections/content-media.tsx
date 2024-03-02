import type { StaticImageData } from 'next/image'

import React from 'react'

import type { Page } from '../../payload/payload-types'

import { Media } from '../../components/media'
import RichText from '../../components/rickText'
import { H1 } from '@/components/typography/headings'
import { Lead } from '@/components/typography/texts'
import { Heading } from '@/pegasus/heading'

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
          <Heading variant='h2'>{title}</Heading>
          <Lead>{description}</Lead>
        </div>
        <div
          className={[
            'relative flex w-full max-w-screen-desktop flex-col items-center justify-center gap-4 tablet:flex-row desktop:gap-8',
            mediaPosition === 'left' &&
              'flex-col-reverse tablet:flex-row-reverse',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className='max-w-screen-tablet'>
            <RichText content={richText} />
          </div>
          <div className='m-2 rounded-md object-cover shadow-wotan-light '>
            <Media
              resource={media}
              // sizes='(max-width: 768px) 100vw, 30vw'
              src={staticImage}
              className='min-w-72 max-w-96 desktop:min-w-80'
            />
          </div>
        </div>
      </div>
    </section>
  )
}
