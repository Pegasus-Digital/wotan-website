'use client'

import { Company } from '@/payload/payload-types'

import { toast } from 'sonner'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { H3 } from '@/components/typography/headings'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

import { updateCompanySettings } from '../_logic/actions'

const contactSettingsSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(14, { message: 'Insira um telefone válido.' }),
  whatsapp: z.string().min(14, { message: 'Insira um WhatsApp válido.' }),
})

interface CompanyProps {
  company: Company
}

export function ContactSettingsForm({ company }: CompanyProps) {
  const form = useForm<z.infer<typeof contactSettingsSchema>>({
    resolver: zodResolver(contactSettingsSchema),
    defaultValues: {
      email: company.contact.email,
      phone: company.contact.phone,
      whatsapp: company.contact.whatsapp,
    },
  })

  function formatPhoneNumber(value: string) {
    const phoneNumber = value // <-- nº de celular não formatado

    const formattedPhoneNumber = phoneNumber
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')

    return formattedPhoneNumber
  }

  async function onSubmit(values: z.infer<typeof contactSettingsSchema>) {
    const response = await updateCompanySettings({
      ...company,
      contact: {
        email: values.email,
        phone: values.phone,
        whatsapp: values.whatsapp,
      },
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
          <H3>Contato</H3>

          <FormField
            name='email'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de contato</FormLabel>
                <FormControl>
                  <Input
                    className='ring-none outline-none'
                    type='text'
                    placeholder='Email da empresa'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phone'
            render={({ field: { onChange, ...props } }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    autoComplete={'tel'}
                    className='ring-none outline-none'
                    placeholder='Telefone'
                    maxLength={15}
                    type='text'
                    onChange={(e) => {
                      const { value } = e.target
                      e.target.value = formatPhoneNumber(value)
                      onChange(e)
                    }}
                    {...props}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='whatsapp'
            render={({ field: { onChange, ...props } }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    autoComplete={'tel'}
                    className='ring-none outline-none'
                    placeholder='WhatsApp'
                    maxLength={15}
                    type='text'
                    onChange={(e) => {
                      const { value } = e.target
                      e.target.value = formatPhoneNumber(value)
                      onChange(e)
                    }}
                    {...props}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Button className='mt-4 w-fit self-end' type='submit'>
          Atualizar contato
        </Button>
      </form>
    </Form>
  )
}
