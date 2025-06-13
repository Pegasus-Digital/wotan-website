import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ContentSection } from '@/payload/payload-types'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { TitleDescription } from './parts/title-description'
import { Icons } from '@/components/icons'
import { RichText } from '@/components/rich-text'
import { Card, CardHeader, CardContent } from '@/components/ui/card'

const contentSectionSchema = z.object({
  blockType: z.literal('content-section'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  columns: z.array(
    z.object({
      size: z.enum(['half', 'full']),
      text: z.array(z.any()),
    }),
  ),
  id: z.string().optional(),
})

type ContentSectionFormValues = z.infer<typeof contentSectionSchema>

interface ContentSectionFormProps {
  initialData?: ContentSection
  onSubmit: (data: ContentSectionFormValues) => void
  isSubmitting?: boolean
}

export function ContentSectionForm({
  initialData,
  onSubmit,
  isSubmitting,
}: ContentSectionFormProps) {
  const form = useForm<ContentSectionFormValues>({
    resolver: zodResolver(contentSectionSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      blockType: 'content-section',
      invertBackground: false,
      title: '',
      description: '',
      columns: [
        {
          size: 'half',
          text: [],
        },
      ],
    },
  })

  function handleSubmit(data: ContentSectionFormValues) {
    console.log('Form submitted with data:', data)
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
        <h3 className="text-lg font-medium">Conteúdo</h3>
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
              name='columns'
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Colunas</FormLabel>
                    <Button
                      type='button'
                      variant='outline'
                      size="icon"
                      onClick={() => {
                        const currentColumns = field.value || []
                        field.onChange([
                          ...currentColumns,
                          {
                            size: 'half',
                            text: [],
                          },
                        ])
                      }}
                      disabled={field.value?.length >= 2}
                    >
                      <Icons.Add className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className='space-y-4 mt-4'>
                    {field.value?.map((column, columnIndex) => (
                      <div
                        key={columnIndex}
                        className='space-y-4 rounded-lg border p-4'
                      >
                        <FormField
                          control={form.control}
                          name={`columns.${columnIndex}.size`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tamanho da Coluna</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="half" id={`half-${columnIndex}`} />
                                    <label
                                      htmlFor={`half-${columnIndex}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Metade
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="full" id={`full-${columnIndex}`} />
                                    <label
                                      htmlFor={`full-${columnIndex}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Completo
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`columns.${columnIndex}.text`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Conteúdo</FormLabel>
                              <FormDescription>
                                Escreva o conteúdo da coluna aqui.
                              </FormDescription>
                              <FormControl>
                                <RichText
                                  value={field.value}
                                  onChange={field.onChange}
                                  className="min-h-[200px]"
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
            <FormField
              control={form.control}
              name='invertBackground'
              render={({ field }) => (
                <FormItem className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                  <FormLabel>Inverter Cores de Fundo</FormLabel>
                  <FormDescription>
                    Se ativado, o fundo do carrossel será invertido, fazendo com que
                    o texto seja branco e o fundo seja colorido.
                  </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
