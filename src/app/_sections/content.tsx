import RichText from '@/components/rickText'
import { H1 } from '@/components/typography/headings'
import { Lead } from '@/components/typography/texts'
import type { Page } from '@/payload/payload-types'

type ContentProps = Extract<
  Page['layout'][0],
  { blockType: 'content-section' }
> & {
  id?: string
}

export function ContentSection({ columns, title, description }: ContentProps) {
  return (
    <section className='w-full'>
      <div className='container'>
        <div className='mb-3 flex flex-col gap-2 text-center'>
          <H1 className='text-wotanRed-500'>{title}</H1>
          <Lead>{description}</Lead>
        </div>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { text, size } = col

            return (
              <div key={index} className={['', ''].join(' ')}>
                <RichText content={text} />
              </div>
            )
          })}
      </div>
    </section>
  )
}
