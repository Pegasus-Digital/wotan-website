import { H1 } from '@/components/typography/headings'
import { Lead, P } from '@/components/typography/texts'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import type { FAQ as FAQProps } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'

export function FAQ({ title, description, questions }: FAQProps) {
  return (
    <section className='w-full '>
      <div className='container flex max-w-screen-desktop flex-col items-center text-center'>
        {title && (
          <div className='mb-3 flex flex-col gap-2 text-center'>
            <Heading variant='h2'>{title}</Heading>
            {description && <Lead>{description}</Lead>}
          </div>
        )}
        <div className=' flex w-full items-center justify-center'>
          <Accordion
            type='single'
            collapsible
            className='flex w-full flex-col gap-4'
          >
            {questions.map((item, i) => {
              return (
                <AccordionItem
                  className='border-b-0'
                  key={`item-${i}`}
                  value={`item-${i}`}
                >
                  <AccordionTrigger className='rounded-sm border bg-wotan px-4 text-primary-foreground'>
                    <Lead className='text-primary-foreground'>
                      {item.question}
                    </Lead>
                  </AccordionTrigger>
                  <AccordionContent className='mx-2 mb-2 rounded-b-sm border border-t-0 bg-background p-4 text-left'>
                    <P className='text-lg font-medium'>{item.answer}</P>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
