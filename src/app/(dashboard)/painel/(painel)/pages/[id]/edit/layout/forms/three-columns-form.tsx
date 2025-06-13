import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ThreeColumns } from '@/payload/payload-types'
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
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { TitleDescription } from './parts/title-description'

const threeColumnsSchema = z.object({
  blockType: z.literal('three-columns'),
  invertBackground: z.boolean().default(false),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  mission: z.object({
    title: z.string(),
    description: z.string(),
  }),
  vision: z.object({
    title: z.string(),
    description: z.string(),
  }),
  values: z.object({
    title: z.string(),
    description: z.string(),
  }),
  id: z.string().optional().nullable(),
})

type ThreeColumnsFormValues = z.infer<typeof threeColumnsSchema>

interface ThreeColumnsFormProps {
  initialData?: ThreeColumns
  onSubmit: (data: ThreeColumnsFormValues) => void
  isSubmitting?: boolean
}

export function ThreeColumnsForm({ initialData, onSubmit, isSubmitting }: ThreeColumnsFormProps) {
  const form = useForm<ThreeColumnsFormValues>({
    resolver: zodResolver(threeColumnsSchema),
    mode: 'onChange',
    defaultValues: initialData || {
      blockType: 'three-columns',
      invertBackground: false,
      title: '',
      description: '',
      mission: {
        title: '',
        description: '',
      },
      vision: {
        title: '',
        description: '',
      },
      values: {
        title: '',
        description: '',
      },
    },
  })

  function handleSubmit(data: ThreeColumnsFormValues) {
    const errors = form.formState.errors
    if (Object.keys(errors).length > 0) {
      alert('Form has validation errors. Check console for details.')
    } else {
      onSubmit(data)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-lg font-medium">Missão, Visão e Valores</h3>
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                <h3 className="font-bold">Form Validation Errors:</h3>
                <ul className="list-disc pl-5">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>
                      {field}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* <FormField
              control={form.control}
              name="invertBackground"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Inverter Fundo</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}
          
            <TitleDescription form={form} />
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Missão</h3>
                <FormField
                  control={form.control}
                  name="mission.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mission.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Visão</h3>
                <FormField
                  control={form.control}
                  name="vision.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vision.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Valores</h3>
                <FormField
                  control={form.control}
                  name="values.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="values.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 