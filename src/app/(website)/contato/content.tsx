'use client'

import Link from 'next/link'
import { useState } from 'react'

import { toast } from 'sonner'
import { formatCNPJ, formatPhoneNumber } from '@/lib/format'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { LowImpactHero } from '@/app/_sections/heros/lowImpact'

import { Button } from '@/pegasus/button'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { Small } from '@/components/typography/texts'
import { H3 } from '@/components/typography/headings'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

import { createMessage } from '@/app/(dashboard)/painel/contato/_logic/actions'

const formSchema = z.object({
  name: z
    .string({ required_error: 'É necessário fornecer um nome.' })
    .min(2, { message: 'Nome deve ter no mínimo 2 caracteres' }),
  phone: z
    .string({
      required_error: 'É necessário fornecer um número para contato.',
    })
    .min(14, { message: 'Escreva o número de telefone por completo.' }),
  email: z
    .string({ required_error: 'É necessário fornecer um e-mail.' })
    .min(6, { message: 'E-mail deve conter no mínimo 6 caracteres' })
    .email({ message: `Deve ser um e-mail válido.` }),
  message: z
    .string({ required_error: 'Deixe sua mensagem.' })
    .max(300, { message: 'Máximo de 300 caracteres' }),
  cnpj: z.string().optional(),
  allowNotifications: z.boolean(),
  acceptPrivacyPolicy: z.boolean(),
})

export function ContactContent({ address, contact }) {
  const [isPJ, setCNPJ] = useState<boolean>(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cnpj: '',
      allowNotifications: false,
      acceptPrivacyPolicy: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.acceptPrivacyPolicy) {
      toast.warning(
        'Para enviar a mensagem é necessário aceitar os termos da Política de Privacidade.',
      )
      return
    }

    const response = await createMessage({
      message: {
        acceptPrivacy: values.acceptPrivacyPolicy,
        email: values.email,
        cnpj: values.cnpj,
        message: values.message,
        fone: values.phone,
        name: values.name,
        acceptEmail: values.allowNotifications,
      },
    })

    if (response.status === true) {
      form.reset()
      return toast.success('Recebemos o contato com sucesso!')
    }

    if (response.status === false) {
      return toast.error('Ocorreu um erro ao receber sua mensagem.')
    }
  }

  function changeCNPJRadio(e: string) {
    e === 'pj' ? setCNPJ(true) : setCNPJ(false)
  }

  return (
    <section className='mb-6 flex w-full flex-col items-center  px-6 text-primary-foreground'>
      <LowImpactHero title='Contato' />

      <div className='container flex max-w-screen-desktop flex-col items-center rounded-lg bg-gift bg-cover bg-center p-4 text-center desktop:p-10'>
        <div className='flex w-full flex-col items-center justify-center gap-4 self-start tablet:flex-row tablet:items-start lg:gap-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full flex-col gap-3 tablet:w-1/2'
            >
              <RadioGroup
                defaultValue='pj'
                className='flex w-full items-center justify-center'
                onValueChange={(e) => changeCNPJRadio(e)}
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='pj' id='pj' />
                  <Label htmlFor='pj'>Pessoa Jurídica</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='pf' id='pf' />
                  <Label htmlFor='pf'>Pessoa Física</Label>
                </div>
              </RadioGroup>

              <FormField
                name='name'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className='ring-none outline-none'
                        type='text'
                        placeholder='Nome'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='animate-pulse text-primary-foreground' />
                  </FormItem>
                )}
              />

              <FormField
                name='email'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className='ring-none outline-none'
                        type='text'
                        placeholder='E-mail'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='animate-pulse text-primary-foreground' />
                  </FormItem>
                )}
              />

              <FormField
                name='phone'
                control={form.control}
                render={({ field: { onChange, ...props } }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className='ring-none outline-none'
                        type='text'
                        placeholder='Telefone'
                        maxLength={15}
                        onChange={(e) => {
                          const { value } = e.target
                          e.target.value = formatPhoneNumber(value)
                          onChange(e)
                        }}
                        {...props}
                      />
                    </FormControl>
                    <FormMessage className='animate-pulse text-primary-foreground' />
                  </FormItem>
                )}
              />

              {isPJ && (
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
                          disabled={!isPJ}
                          onChange={(e) => {
                            const { value } = e.target
                            e.target.value = formatCNPJ(value)
                            onChange(e)
                          }}
                          {...props}
                        />
                      </FormControl>
                      <FormMessage className='animate-pulse text-primary-foreground' />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                name='message'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className={` ${!isPJ ? 'h-44' : 'h-32'}  resize-none  text-foreground`}
                        placeholder='Mensagem'
                        maxLength={300}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='animate-pulse text-primary-foreground' />
                  </FormItem>
                )}
              />

              <FormField
                name='allowNotifications'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md px-4'>
                    <FormControl>
                      <Checkbox
                        className='bg-background data-[state=checked]:bg-background data-[state=checked]:text-foreground'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='cursor-pointer hover:underline'>
                        Aceito receber notificações por e-mail.
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                name='acceptPrivacyPolicy'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md px-4'>
                    <FormControl>
                      <Checkbox
                        className='bg-background data-[state=checked]:bg-background data-[state=checked]:text-foreground'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 text-start leading-none'>
                      <FormLabel className='peer cursor-pointer hover:underline hover:[&>a]:no-underline'>
                        Estou de acordo com o envio das informações solicitadas
                        e aceito os termos da{' '}
                      </FormLabel>
                      <Link
                        href='/politica-de-privacidade'
                        target='_blank'
                        className='text-sm font-medium text-sky-400 hover:text-sky-300 hover:underline'
                      >
                        Política de Privacidade
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                variant='expandIcon'
                Icon={Icons.ArrowRight}
                iconPlacement='right'
                className='font-medium shadow-wotan-light transition hover:brightness-125'
              >
                Enviar
              </Button>
            </form>
          </Form>

          {/* Informações */}
          <aside className='flex w-full flex-col justify-center tablet:w-1/2'>
            {/* Google Maps embed */}
            <section className='relative h-80 w-full rounded-lg border'>
              <iframe
                className='absolute left-0 top-0 h-full w-full rounded-lg'
                src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13815.33916480707!2d-51.2008476!3d-30.0415972!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95197847fbaf1e1f%3A0x7ce237903c469d87!2sWotan%20Brindes!5e0!3m2!1spt-BR!2sbr!4v1710781766668!5m2!1spt-BR!2sbr'
                loading='lazy'
                allowFullScreen={true}
                tabIndex={0}
              />
            </section>

            <section className='mt-6 flex flex-col items-center justify-center space-y-4 text-center'>
              <H3>Informações</H3>

              {/* Address information */}
              <div className='flex items-center gap-2'>
                <Icons.Pin className='mr-2 h-5 w-5 shrink-0' />
                <Small className='flex items-center leading-snug'>
                  {`${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}`}
                </Small>
              </div>

              {/* Contact information */}
              <div className='flex flex-col items-center justify-center gap-4'>
                <Link
                  href={`tel:${contact.phone}`}
                  className='flex items-center'
                  target='_blank'
                >
                  <Icons.Phone className='mr-2 h-5 w-5' />
                  <Small className='whitespace-nowrap'>{contact.phone}</Small>
                </Link>

                <Link
                  href={`mailto:${contact.email}`}
                  className='flex items-center'
                  target='_blank'
                >
                  <Icons.Mail className='mr-2 h-5 w-5' />
                  <Small className='whitespace-nowrap'>{contact.email}</Small>
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </section>
  )
}
