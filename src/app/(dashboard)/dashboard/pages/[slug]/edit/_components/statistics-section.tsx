'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { StatisticSection } from '@/payload/payload-types'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const statisticSectionSchema = z.object({
  title: z.string().optional(),
  description: z
    .string()
    .max(300, 'Uma descrição pode ter no máximo 300 caracteres.')
    .optional(),
  statistics: z
    .array(
      z.object({
        title: z.string(),
        value: z.string(),
      }),
    )
    .min(2, 'Pelo menos 2 estatísticas devem ser definidas.')
    .max(4, 'No maximo 4 estatísticas.'),
  invertBackground: z.boolean().optional(),
})

export default function Statistics({ data }: { data: StatisticSection }) {
  // const form = useForm<z.infer<typeof statisticsEdit>>({
  //   resolver: zodResolver(statisticsEdit),
  //   defaultValues: {
  //     title: data.title,
  //     description: data.description,
  //     statistics: data.statistics,
  //     invertBackground: data.invertBackground,
  //   },
  // })

  console.log(data)
  return (
    <section>
      <Input value={data.title} className='font-bold' />
      <Textarea value={data.description} />
      <div className='grid grid-cols-4 gap-4'>
        {data.statistics.map((stat, index) => {
          return (
            <div key={index}>
              <Input value={stat.title} />
              <Input value={stat.value} />
            </div>
          )
        })}
      </div>
    </section>
  )
}
