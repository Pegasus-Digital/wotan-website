'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { H3 } from '@/components/typography/headings'
import { Company } from '@/payload/payload-types'
import { updateCompanySettings } from '../_logic/actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { BRAZIL_STATES } from '@/lib/brazil-states'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'

const addressSettingsFormSchema = z.object({
  street: z.string(),
  number: z.coerce.number().positive(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  cep: z.string(),

  maps: z.string().optional(),
})

interface CompanyProps {
  company: Company
}

export function AddressSettingsForm({ company }: CompanyProps) {
  const form = useForm<z.infer<typeof addressSettingsFormSchema>>({
    resolver: zodResolver(addressSettingsFormSchema),
    defaultValues: {
      street: company.adress.street,
      number: Number(company.adress.number),
      neighborhood: company.adress.neighborhood,
      city: company.adress.city,
      cep: company.adress.cep,
      state: company.adress.state,
      maps: company.googleMaps,
    },
  })

  async function onSubmit(values: z.infer<typeof addressSettingsFormSchema>) {
    const response = await updateCompanySettings({
      ...company,
      googleMaps: values.maps,
      adress: {
        ...values,
        // @ts-ignore
        state: values.state,
        number: String(values.number),
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
          <H3>Endereço</H3>

          <div className='flex gap-2'>
            <FormField
              name='street'
              control={form.control}
              render={({ field }) => (
                <FormItem className='min-w-16 flex-1'>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input
                      className='ring-none outline-none'
                      type='text'
                      placeholder='Nome da rua'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='number'
              control={form.control}
              render={({ field }) => (
                <FormItem className='w-fit min-w-min'>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input
                      className='ring-none outline-none'
                      type='number'
                      placeholder='1234'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name='neighborhood'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input
                    className='ring-none outline-none'
                    type='text'
                    placeholder='Nome do bairro'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-2'>
            <FormField
              name='city'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      className='ring-none outline-none'
                      type='text'
                      placeholder='Nome da cidade'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='state'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue
                          id='a'
                          placeholder={'Selecione o estado'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAZIL_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='cep'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      className='ring-none outline-none'
                      type='text'
                      placeholder='CEP'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name='maps'
            control={form.control}
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Google Maps Embed IFrame</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Google Maps embed URL'
                    className='ring-none outline-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <Button className='mt-4 w-fit self-end' type='submit'>
          Atualizar endereço
        </Button>
      </form>
    </Form>
  )
}
