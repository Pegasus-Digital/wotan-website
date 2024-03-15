import React, { ElementType, Fragment, Ref } from 'react'
import type { StaticImageData } from 'next/image'

import type { Media as MediaType } from '../../payload/payload-types'

import { Image } from './image'

export interface Props {
  src?: StaticImageData // for static media
  alt?: string
  resource?: string | MediaType // for Payload media
  size?: string // for next/image only
  priority?: boolean // for next/image only
  fill?: boolean // for next/image only
  className?: string
  imgClassName?: string
  htmlElement?: ElementType | null
  onClick?: () => void
  onLoad?: () => void
  ref?: Ref<null | HTMLImageElement>
}

export function Media({ className, htmlElement = 'div', ...props }: Props) {
  const Tag = (htmlElement as ElementType) || Fragment

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      <Image {...props} />
    </Tag>
  )
}
