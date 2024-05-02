'use client'

import Link from 'next/link'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { H3 } from '@/components/typography/headings'
import { Company } from '@/payload/payload-types'
import { toast } from 'sonner'
import { updateSettings } from '../_logic/actions'

const generalSettingsFormSchema = z.object({
  name: z.string().min(3),
  cnpj: z.string().length(18, 'Insira um CNPJ válido.'),
})

interface CompanyProps {
  company: Company
}

export function GeneralSettingsForm({ company }: CompanyProps) {
  const form = useForm<z.infer<typeof generalSettingsFormSchema>>({
    resolver: zodResolver(generalSettingsFormSchema),
    defaultValues: {
      name: company.name,
      cnpj: company.cnpj,
    },
  })

  function formatCNPJ(value: string) {
    const unformattedCNPJ = value

    const formattedCNPJ = unformattedCNPJ
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')

    return formattedCNPJ
  }

  async function onSubmit(values: z.infer<typeof generalSettingsFormSchema>) {
    const response = await updateSettings({
      ...company,

      name: values.name,
      cnpj: values.cnpj,
    })

    if (response.status === true) {
      toast.success(response.message)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  return (
    <Form {...form}>
      <form
        className='flex flex-col justify-between px-2.5 py-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className='space-y-2'>
          <H3>Dados da empresa</H3>
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da empresa</FormLabel>
                <FormControl>
                  <Input
                    className='ring-none outline-none'
                    type='text'
                    placeholder='Nome da empresa'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name='cnpj'
            control={form.control}
            render={({ field: { onChange, ...props } }) => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input
                    className='ring-none outline-none'
                    type='text'
                    placeholder='CNPJ'
                    onChange={(e) => {
                      const { value } = e.target
                      e.target.value = formatCNPJ(value)
                      onChange(e)
                    }}
                    {...props}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        <Button className='mt-4 w-fit self-end' type='submit'>
          Atualizar dados
        </Button>
      </form>
    </Form>
  )
}
