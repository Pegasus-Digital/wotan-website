'use client'

import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  DEFAULT_PRINTING_TYPES,
  PrintingTypeOption,
} from '@/lib/printing-types'
import { invalidatePrintingTypesCache } from '@/hooks/use-printing-types'

import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { H3 } from '@/components/typography/headings'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { updateProductionSettings } from '../_logic/actions'
import { printingTypesSettingsSchema } from '../_logic/schemas'

type ProductionSettingsFormValues = z.infer<typeof printingTypesSettingsSchema>

interface ProductionSettingsFormProps {
  printingTypes: PrintingTypeOption[]
}

export function ProductionSettingsForm({
  printingTypes,
}: ProductionSettingsFormProps) {
  const form = useForm<ProductionSettingsFormValues>({
    resolver: zodResolver(printingTypesSettingsSchema),
    defaultValues: {
      printingTypes:
        printingTypes.length > 0 ? printingTypes : DEFAULT_PRINTING_TYPES,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'printingTypes',
  })

  async function onSubmit(values: ProductionSettingsFormValues) {
    const response = await updateProductionSettings(values.printingTypes)

    if (response.status === true) {
      invalidatePrintingTypesCache()
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col gap-6 px-2.5 py-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className='space-y-2'>
          <H3>Tipos de impressão</H3>
          <p className='text-sm text-muted-foreground'>
            Opções exibidas na planilha de produção (formulário e PDF). O
            identificador é o valor salvo no banco — use apenas letras
            minúsculas, números, hífen ou underscore.
          </p>
        </section>

        <div className='space-y-3'>
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className='grid gap-4 pt-6 tablet:grid-cols-[1fr_1fr_auto] tablet:items-start'>
                <FormField
                  control={form.control}
                  name={`printingTypes.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Identificador</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='ex.: tampografia'
                          onChange={(e) => {
                            field.onChange(
                              e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, '_'),
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`printingTypes.${index}.label`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome exibido</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder='ex.: Tampografia' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  className='mt-8 shrink-0'
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                  aria-label='Remover tipo'
                >
                  <Icons.Trash className='h-4 w-4' />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type='button'
          variant='outline'
          className='w-fit'
          onClick={() =>
            append({
              value: '',
              label: '',
            })
          }
        >
          <Icons.Add className='mr-2 h-4 w-4' />
          Adicionar tipo
        </Button>

        <Button className='w-fit self-end' type='submit'>
          Salvar tipos de impressão
        </Button>
      </form>
    </Form>
  )
}
