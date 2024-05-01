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
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const companyFormSchema = z.object({
  name: z.string().min(3),
  cnpj: z.string().length(18, 'Insira um CNPJ válido.'),
})

export function CompanyForm() {
  const form = useForm({
    resolver: zodResolver(companyFormSchema),
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

  async function onSubmit() {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          name='cnpj'
          control={form.control}
          render={({ field: { onChange, ...props } }) => (
            <FormItem>
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
              <FormMessage className='animate-pulse' />
            </FormItem>
          )}
        />

        <Button type='submit'>Update profile</Button>
      </form>
    </Form>
  )
}
