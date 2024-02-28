import React from 'react'

import serialize from './serialize'

type RichTextProps = {
  className?: string
  content: any
}

export default function RichText({ className, content }: RichTextProps) {
  if (!content) {
    return null
  }

  return (
    <div
      className={['first:mt-0 last:mb-0', className].filter(Boolean).join(' ')}
    >
      {serialize(content)}
    </div>
  )
}
