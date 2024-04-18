import React from 'react'
import Link from 'next/link'

import { Link as CMSLinkType } from '../payload/payload-types'

export default function CMSLink({
  label,
  url,
  newTab,
  reference,
  type,
}: CMSLinkType) {
  const href =
    type === 'reference' &&
    typeof reference?.value === 'object' &&
    reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const newTabProps = newTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  if (href || url) {
    return (
      <Link {...newTabProps} href={href || url}>
        {label}
      </Link>
    )
  }
}

export function getHref({ type, url, reference }: CMSLinkType) {
  if (
    type === 'reference' &&
    reference &&
    typeof reference.value === 'object' &&
    reference.value.slug
  ) {
    return `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
      reference.value.slug
    }`
  }
  return url
}
