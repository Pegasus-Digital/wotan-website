import { H1 } from '@/components/typography/headings'
import { Lead, P } from '@/components/typography/texts'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { FAQ as FAQProps } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'
import { faqSchema } from '../_logic/validations'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type EditFAQProps = {
  form: ReturnType<typeof useForm>
  faqSection: FAQProps
}

export function FAQ({ faqSection, form }: EditFAQProps) {
  // const form = useForm<z.infer<typeof faqSchema>>({
  //   resolver: zodResolver(faqSchema),
  //   defaultValues: {
  //     title,
  //     description,
  //     questions,
  //   },
  // })

  return (
    <section className='w-full '>
      <div className='container flex max-w-screen-desktop flex-col items-center text-center'>
        <FormField
          name='faqSection.title'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-bold'>Título</FormLabel>

              <FormControl>
                <Input type='text' placeholder='Título' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className=' flex w-full items-center justify-center'>
          {faqSection.questions.map((question, index) => {
            return (
              <div key={index} className='flex flex-col gap-2'>
                <FormField
                  name={`faqSection.questions.${index}.question`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-bold'>Título</FormLabel>

                      <FormControl>
                        <Input type='text' placeholder='Título' {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`questions.${index}.answer`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='font-bold'>Valor</FormLabel>

                      <FormControl>
                        <Input type='text' placeholder='Valor' {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
