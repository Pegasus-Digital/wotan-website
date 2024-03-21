import { Lead } from '@/components/typography/texts'
import { Heading } from '@/pegasus/heading'
import React from 'react'
import type { TimelineSection as TimelineSectionProps } from '@/payload/payload-types'

export default function Timeline({
  title,
  description,
  cards,
}: TimelineSectionProps) {
  return (
    <section className='w-full overflow-x-hidden overflow-y-clip'>
      <div className='container mx-auto  flex flex-col items-start  desktop:flex-row'>
        <TimelineDescription title={title} description={description} />
        <TimelineTimeline cards={cards} />
      </div>
    </section>
  )
}

function TimelineDescription({ title, description }) {
  return (
    <div className='sticky mt-2 flex w-full flex-col items-center px-8 desktop:top-36 desktop:mt-12 desktop:w-1/3 desktop:items-start'>
      <Heading variant='h2'>{title}</Heading>
      <Lead>{description}</Lead>
    </div>
  )
}

function TimelineTimeline({ cards }) {
  return (
    <div className='dektop:ml-6 ml-0 w-full desktop:mt-12 desktop:w-2/3'>
      <div className=' h-full w-full'>
        <div className='wrap relative h-full overflow-hidden p-10'>
          <div className='absolute h-full border  border-wotanRed-500 tablet:right-1/2'></div>
          <div className='absolute  h-full border  border-wotanRed-500 tablet:left-1/2'></div>
          {cards.map((card, index) => (
            <TimelineTimelineItem
              key={index}
              date={card.date}
              title={card.title}
              description={card.description}
              side={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function TimelineTimelineItem({ date, title, description, side = 'left' }) {
  const { month, year } = getMonthAndYear(date)
  return (
    <div
      className={`left-timeline mb-8 flex w-full items-center justify-between  ${side === 'left' ? 'tablet:flex-row-reverse' : ''}`}
    >
      <div className='order-1 w-1/12 tablet:w-5/12'></div>
      <div
        className={`order-1 w-11/12 tablet:w-5/12  ${side === 'left' ? 'tablet:text-right' : 'text-left'} rounded-lg bg-background px-6 py-4 shadow-wotan-light`}
      >
        <Lead className='mb-2 font-semibold text-wotanRed-500'>
          {month}/{year}
        </Lead>
        <Heading variant='h4' className='mb-2 !text-foreground'>
          {title}
        </Heading>
        <Lead>{description}</Lead>
      </div>
    </div>
  )
}

function getMonthAndYear(datetimeString: string): {
  month: number
  year: number
} {
  const date = new Date(datetimeString)
  const month = date.getMonth() + 1 // Adding 1 because getMonth() returns 0-based index
  const year = date.getFullYear()
  return { month, year }
}
