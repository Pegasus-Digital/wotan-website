'use client'

import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { H1, H3 } from '@/components/typography/headings'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { LinkIcon, Small } from '@/components/typography/texts'
import { FacebookIcon, Mail, MapPin, Phone } from 'lucide-react'
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'

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
  message: z.string({ required_error: 'Deixe sua mensagem.' }),
  cnpj: z.string().optional(),
  allowNotifications: z.boolean(),
  acceptPrivacyPolicy: z.boolean(),
})

export function ContactContent() {
  const [isPJ, toggleCNPJ] = useState<boolean>(false)

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    if (!values.acceptPrivacyPolicy) {
      toast.warning(
        'Formulário não enviado, é necessário aceitar os termos da Política de Privacidade.',
      )
    }

    toast.success('Formulário enviado com sucesso!')
  }

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

  function formatPhoneNumber(value: string) {
    const phoneNumber = value // <-- nº de celular não formatado

    const formattedPhoneNumber = phoneNumber
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d)(\d{4})$/, '$1-$2')

    return formattedPhoneNumber
  }

  return (
    <section className='mb-12 mt-6 min-h-screen w-full px-6 text-primary-foreground'>
      <div className='container flex flex-col items-center rounded-lg bg-opacity-75 bg-wotan p-4 text-center'>
        <H1>Contato</H1>

        <div className='mt-6 flex w-full flex-col items-center justify-center gap-4 self-start tablet:flex-row tablet:items-start lg:gap-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full max-w-[450px] flex-col gap-3'
            >
              <FormField
                control={form.control}
                name='name'
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
                    <FormMessage className='text-primary-foreground' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
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
                    <FormMessage className='text-primary-foreground' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='phone'
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
                    <FormMessage className='text-primary-foreground' />
                  </FormItem>
                )}
              />
              <div className='flex items-center'>
                <Checkbox
                  checked={isPJ}
                  onCheckedChange={() => {
                    form.setValue('cnpj', '')
                    toggleCNPJ(!isPJ)
                  }}
                  id='PJ'
                  className='mr-2 bg-background'
                />
                <div className='space-y-1'>
                  <FormLabel
                    htmlFor='PJ'
                    className='cursor-pointer text-sm hover:underline'
                  >
                    Represento uma Pessoa Jurídica
                  </FormLabel>
                </div>
              </div>
              {isPJ && (
                <FormField
                  control={form.control}
                  name='cnpj'
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
                      <FormMessage className='text-primary-foreground' />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='message'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        className='h-40 resize-none text-foreground'
                        placeholder='Mensagem'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-primary-foreground' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='allowNotifications'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md px-4'>
                    <FormControl>
                      <Checkbox
                        className='bg-background'
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
                control={form.control}
                name='acceptPrivacyPolicy'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md px-4'>
                    <FormControl>
                      <Checkbox
                        className='bg-background'
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
                        className='text-sm font-medium text-sky-400 hover:text-sky-500 hover:underline'
                      >
                        Política de Privacidade
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                variant='outline'
                className='bg-transparent font-medium text-primary-foreground'
                type='submit'
              >
                Enviar
              </Button>
            </form>
          </Form>
          {/* Informações */}
          <div className='mt-6 flex grow flex-col justify-center tablet:mt-0'>
            <iframe
              className='aspect-video rounded-lg border'
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d863.4584891761309!2d-51.201612430354096!3d-30.041621137489308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95197847fb10d883%3A0xc6a59a1606974ae2!2sR.%20Jo%C3%A3o%20Guimar%C3%A3es%2C%20301%20-%20Santa%20Cec%C3%ADlia%2C%20Porto%20Alegre%20-%20RS%2C%2090630-170!5e0!3m2!1spt-BR!2sbr!4v1709142619554!5m2!1spt-BR!2sbr'
              loading='lazy'
            />
            <div className='mt-6 flex flex-col items-center justify-center space-y-4 text-center'>
              <H3>Informações</H3>
              <div className='flex items-center'>
                <MapPin className='h-4 w-4' />
                <Small>
                  Rua João Guimarães, 301 - Santa Cecília, Porto Alegre - RS,
                  45245-245
                </Small>
              </div>
              <div className='flex flex-wrap items-center justify-center gap-4'>
                <div className='flex items-center'>
                  <Phone className='mr-2 h-4 w-4' />
                  <Small className='whitespace-nowrap'>(51) 3124-2424</Small>
                </div>
                <div className='flex items-center'>
                  <Mail className='mr-2 h-4 w-4' />
                  <Small className='whitespace-nowrap'>
                    wotan@wotanbrindes.com.br
                  </Small>
                </div>
              </div>

              <div className='flex items-center'>
                <Small className='mr-5 whitespace-nowrap'>Redes sociais</Small>

                <div className='flex space-x-2'>
                  <LinkIcon href='/' Icon={InstagramLogoIcon} />
                  <LinkIcon href='/' Icon={LinkedInLogoIcon} />
                  <LinkIcon href='/' Icon={TwitterLogoIcon} />
                  <LinkIcon href='/' Icon={FacebookIcon} />
                </div>
              </div>

              {/* TODO: Organizar icones */}
              {/* <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                <img
                  alt='Wotan Logo'
                  src='https://wotan-site.medialinesistemas.com.br/storage/company/footer/10051620230522646b688c4118c.png'
                  className='max-h-[200px] w-full'
                />

                {companyInfo.showAddress === true && (
                  <Small>
                    <MapPin className='mr-2 inline h-5 w-5' />
                    {adress.adress.street}, {adress.adress.number} -{' '}
                    {adress.adress.neighborhood}, {adress.adress.city} -{' '}
                    {adress.adress.state}, {adress.adress.cep}
                  </Small>
                )}

                <div className='flex flex-col items-center gap-4 tablet:flex-row'>
                  {companyInfo.showPhone === true && (
                    <Small className='flex items-center whitespace-nowrap'>
                      <Phone className='mr-2 h-5 w-5' />
                      {contact.phone}
                    </Small>
                  )}

                  {companyInfo.showEmail === true && (
                    <Small className='flex items-center whitespace-nowrap'>
                      <Mail className='mr-2 h-5 w-5' />
                      {contact.email}
                    </Small>
                  )}
                </div>

                <div className='flex items-center'>
                  <Small className='mr-5 whitespace-nowrap'>
                    Redes sociais
                  </Small>
                  <div className='flex space-x-2'>
                    <LinkIcon href='/' Icon={InstagramLogoIcon} />
                    <LinkIcon href='/' Icon={LinkedInLogoIcon} />
                    <LinkIcon href='/' Icon={TwitterLogoIcon} />
                    <LinkIcon href='/' Icon={FacebookIcon} />
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
