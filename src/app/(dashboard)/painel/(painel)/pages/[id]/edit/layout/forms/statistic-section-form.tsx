import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { StatisticSection } from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Plus } from 'lucide-react'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form'
import { TitleDescription } from './parts/title-description'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const statisticSectionSchema = z.object({
  blockType: z.literal('statistic-section'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  statistics: z.array(
    z.object({
      title: z.string(),
      value: z.string(),
      description: z.string().optional(),
      id: z.string().optional(),
    }),
  ),
  id: z.string().optional(),
})

type StatisticSectionFormValues = z.infer<typeof statisticSectionSchema>

interface StatisticSectionFormProps {
  initialData?: StatisticSection
  onSubmit: (data: StatisticSectionFormValues) => void
  isSubmitting?: boolean
}

export function StatisticSectionForm({
  initialData,
  onSubmit,
  isSubmitting,
}: StatisticSectionFormProps) {
  const form = useForm<StatisticSectionFormValues>({
    resolver: zodResolver(statisticSectionSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      blockType: 'statistic-section',
      invertBackground: false,
      title: '',
      description: '',
      statistics: [
        {
          title: '',
          value: '',
          description: '',
        },
      ],
    },
  })

  function handleSubmit(data: StatisticSectionFormValues) {

    // // make sure the data has a id
    // if (!data.id) {
    //   data.id = initialData?.id
    // }

    console.log('Form submitted with data:', data)
    // console.log('initialData', initialData)
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      console.error('Validation errors:', errors)
      alert('Form has validation errors. Check console for details.')
    } else {
      onSubmit(data)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium">Estatísticas</h3>
        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={form.handleSubmit(handleSubmit)}
          className="min-w-[100px]"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            {Object.keys(form.formState.errors).length > 0 && (
              <div className='mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700'>
                <h3 className='font-bold'>Form Validation Errors:</h3>
                <ul className='list-disc pl-5'>
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>
                      {field}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <TitleDescription form={form} />
            <FormField
              control={form.control}
              name='statistics'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <FormLabel>Estatísticas</FormLabel>
                      <FormDescription>
                        Adicione estatísticas a serem exibidas na seção. Máximo de 3
                        estatísticas.
                      </FormDescription>
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='icon'
                      disabled={field.value?.length >= 3}
                      onClick={() => {
                        const currentStats = field.value || []
                        field.onChange([
                          ...currentStats,
                          {
                            title: '',
                            value: '',
                            description: '',
                          },
                        ])
                      }}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                  <div className='space-y-4'>
                    {field.value?.map((stat, statIndex) => (
                      <div
                        key={statIndex}
                        className='space-y-4 rounded-lg border p-4'
                      >
                        <FormField
                          control={form.control}
                          name={`statistics.${statIndex}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`statistics.${statIndex}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor</FormLabel>
                              <FormControl>
                                <input
                                  {...field}
                                  className='w-full rounded-md border border-input bg-background px-3 py-2'
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
