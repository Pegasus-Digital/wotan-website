'use client'

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
import { updateSettings } from '../_logic/actions'
import { toast } from 'sonner'

const socialsSettingsFormSchema = z.object({
  facebook: z.string().url(),
  instagram: z.string().url(),
  linkedin: z.string().url(),
})

interface CompanyProps {
  company: Company
}

export function SocialsSettingsForm({ company }: CompanyProps) {
  const form = useForm<z.infer<typeof socialsSettingsFormSchema>>({
    resolver: zodResolver(socialsSettingsFormSchema),
    defaultValues: {
      facebook: company.social.facebook ?? '',
      instagram: company.social.instagram ?? '',
      linkedin: company.social.linkedin ?? '',
    },
  })

  async function onSubmit(values: z.infer<typeof socialsSettingsFormSchema>) {
    const response = await updateSettings({
      ...company,

      social: {
        facebook: values.facebook,
        instagram: values.instagram,
        linkedin: values.linkedin,
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
          <H3>Redes sociais</H3>

          <FormField
            name='facebook'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input
                    className='ring-none outline-none'
                    type='text'
                    placeholder='https://facebook.com/...'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='instagram'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input
                    className='ring-none outline-none'
                    type='text'
                    placeholder='https://instagram.com/...'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name='linkedin'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    className='ring-none outline-none'
                    type='text'
                    placeholder='https://linkedin.com.br/company/...'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        <Button className='mt-4 w-fit self-end' type='submit'>
          Atualizar sociais
        </Button>
      </form>
    </Form>
  )
}
