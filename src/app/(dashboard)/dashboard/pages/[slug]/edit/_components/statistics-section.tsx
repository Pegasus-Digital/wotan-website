'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { StatisticSection } from '@/payload/payload-types'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from '@/components/ui/form'
import { statisticSectionSchema } from '../_logic/validations'

type EditStatisticsProps = {
  form: ReturnType<typeof useForm>
  statisticSection: StatisticSection
}

export default function Statistics({
  statisticSection,
  form,
}: EditStatisticsProps) {
  console.log({ statisticSection })

  // const form = useForm<z.infer<typeof statisticSectionSchema>>({
  //   resolver: zodResolver(statisticSectionSchema),
  // })

  return (
    <section className='flex w-full flex-col gap-2'>
      <h3 className='font-bold'>Estatísticas</h3>
      <FormField
        name='statisticSection.title'
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
      {/* <Textarea value={description} onChange={() => {}} /> */}
      <div className='flex flex-row gap-4'>
        {statisticSection.statistics.map((stat, index) => {
          return (
            <div key={index} className='flex flex-col gap-2'>
              <FormField
                name={`statistics.${index}.title`}
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
                name={`statisticSection.statistics.${index}.value`}
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
    </section>
  )
}
