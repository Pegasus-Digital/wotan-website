'use client'

import React from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Footer } from '@/payload/payload-types'
import { updateFooterSettings } from '../_logic/actions'
import { toast } from 'sonner'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { H3, H4 } from '@/components/typography/headings'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/pegasus/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AccordionContent } from '@radix-ui/react-accordion'
import { footerSchema } from '../_logic/schemas'

interface FooterProps {
  footer: Footer
}

export default function FooterSettingsForm({ footer }: FooterProps) {
  const form = useForm<z.infer<typeof footerSchema>>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      // logo: footer.logo,
      companyInfo: footer.companyInfo,
      columns: footer.columns,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  async function onSubmit(values: z.infer<typeof footerSchema>) {
    const response = await updateFooterSettings({
      ...footer,

      companyInfo: {
        showAddress: values.companyInfo.showAddress,
        showPhone: values.companyInfo.showPhone,
        showEmail: values.companyInfo.showEmail,
        showSocial: values.companyInfo.showSocial,
      },
      columns: values.columns.map((column) => ({
        title: column.title,
        links: column.links.map((link) => ({
          link: {
            type: link.link.type,
            newTab: link.link.newTab,
            // reference: {
            //   relationTo: link.link.reference?.relationTo,
            //   value: link.link.reference?.value,
            // },
            url: link.link.url,
            label: link.link.label,
          },
        })),
      })),
    })

    if (response.status === true) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  const {
    fields: columnFields,
    append: appendColumn,
    remove: removeColumn,
  } = useFieldArray({
    control: form.control,
    name: 'columns',
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className='w-full'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <CardTitle>Altere as configurações do rodapé do site</CardTitle>
            <Button type='submit'>Salvar</Button>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <section className='flex flex-col gap-2'>
              <H3>Informações da empresa</H3>
              <div className='grid grid-cols-2 gap-2'>
                <FormField
                  name='companyInfo.showAddress'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center  gap-x-1.5 space-y-0 rounded-md  px-4 '>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer hover:underline'>
                        Mostrar Endereço
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  name='companyInfo.showPhone'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center  gap-x-1.5 space-y-0 rounded-md  px-4 '>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer hover:underline'>
                        Mostrar Telefone
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  name='companyInfo.showEmail'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center  gap-x-1.5 space-y-0 rounded-md  px-4 '>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer hover:underline'>
                        Mostrar E-mail
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  name='companyInfo.showSocial'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center  gap-x-1.5 space-y-0 rounded-md  px-4 '>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='cursor-pointer hover:underline'>
                        Mostrar Redes Sociais
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <section className='flex flex-col gap-2'>
              <div className='flex  flex-row justify-between'>
                <H3>Colunas</H3>
                {columnFields.length < 2 && (
                  <Button
                    type='button'
                    onClick={() => appendColumn({ title: '', links: [] })}
                  >
                    Adicionar Coluna
                  </Button>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {columnFields.map((column, columnIndex) => (
                  <Card key={columnIndex}>
                    <CardHeader className='flex flex-row justify-between'>
                      <CardTitle>Nro {columnIndex + 1}</CardTitle>
                      {columnIndex > 0 && (
                        <Button
                          type='button'
                          onClick={() => removeColumn(columnIndex)}
                        >
                          Deletar Coluna
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className='flex flex-col gap-4'>
                      <FormField
                        name={`columns.${columnIndex}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                              <Input
                                className='ring-noneoutline-none'
                                type='text'
                                placeholder='Título da coluna'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Controller
                        name={`columns.${columnIndex}.links`}
                        control={form.control}
                        render={({ field: { value, onChange } }) => (
                          <Accordion type='multiple'>
                            <div className='flex flex-row justify-between'>
                              <CardTitle>Links</CardTitle>{' '}
                              <Button
                                type='button'
                                onClick={() =>
                                  onChange([
                                    ...value,
                                    {
                                      link: {
                                        label: '',
                                        url: '',
                                        newTab: false,
                                        type: 'custom',
                                      },
                                    },
                                  ])
                                }
                              >
                                + Link
                              </Button>
                            </div>

                            {value.map((link, linkIndex) => {
                              const currentLinkType = form.watch(
                                `columns.${columnIndex}.links.${linkIndex}.link.type`,
                              )
                              return (
                                <AccordionItem
                                  key={link.id}
                                  title={`Link ${linkIndex + 1}`}
                                  value={`Link ${linkIndex + 1}`}
                                >
                                  <AccordionTrigger>
                                    {`Link ${linkIndex + 1}`}
                                  </AccordionTrigger>
                                  <AccordionContent className='flex flex-col gap-4'>
                                    <div className='flex w-full gap-2'>
                                      <FormField
                                        control={form.control}
                                        name={`columns.${columnIndex}.links.${linkIndex}.link.type`}
                                        render={({ field }) => (
                                          <FormItem className='space-y-3'>
                                            <FormControl>
                                              <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className='flex flex-row items-center space-y-1'
                                              >
                                                <FormLabel className='font-normal'>
                                                  Tipo:
                                                </FormLabel>
                                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                                  <FormControl>
                                                    <RadioGroupItem value='reference' />
                                                  </FormControl>
                                                  <FormLabel className='font-normal'>
                                                    Link Interno
                                                  </FormLabel>
                                                </FormItem>
                                                <FormItem className='flex items-center space-x-3 space-y-0'>
                                                  <FormControl>
                                                    <RadioGroupItem value='custom' />
                                                  </FormControl>
                                                  <FormLabel className='font-normal'>
                                                    URL Customizada
                                                  </FormLabel>
                                                </FormItem>
                                              </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        name={`columns.${linkIndex}.links.${linkIndex}.link.newTab`}
                                        control={form.control}
                                        render={({ field }) => (
                                          <FormItem className='flex flex-row items-center  gap-x-1.5 space-y-0 rounded-md  px-4 '>
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                              />
                                            </FormControl>
                                            <FormLabel className='cursor-pointer hover:underline'>
                                              Abrir em uma nova guia
                                            </FormLabel>
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <div className='flex w-full gap-2'>
                                      {currentLinkType === 'custom' ? (
                                        <FormField
                                          name={`columns.${linkIndex}.links.${linkIndex}.link.url`}
                                          control={form.control}
                                          render={({ field }) => (
                                            <FormItem className='w-1/2'>
                                              <FormLabel>URL</FormLabel>
                                              <FormControl>
                                                <Input
                                                  className='ring-none  outline-none'
                                                  type='text'
                                                  placeholder='URL'
                                                  {...field}
                                                />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                      ) : (
                                        <FormField
                                          name={`columns.${linkIndex}.links.${linkIndex}.link.url`}
                                          control={form.control}
                                          render={({ field }) => (
                                            <FormItem className='w-1/2'>
                                              <FormLabel>Referência</FormLabel>
                                              <FormControl>
                                                <Input
                                                  className='ring-none  outline-none'
                                                  type='text'
                                                  placeholder='Reference'
                                                  {...field}
                                                />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                      )}

                                      <FormField
                                        name={`columns.${linkIndex}.links.${linkIndex}.link.label`}
                                        control={form.control}
                                        render={({ field }) => (
                                          <FormItem className='w-1/2'>
                                            <FormLabel>Rótulo</FormLabel>
                                            <FormControl>
                                              <Input
                                                className='ring-noneoutline-none'
                                                type='text'
                                                placeholder='Título da coluna'
                                                {...field}
                                              />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    <Button
                                      type='button'
                                      onClick={() => {
                                        const newLinks = [...value]
                                        newLinks.splice(linkIndex, 1)
                                        onChange(newLinks)
                                      }}
                                    >
                                      Remover Link
                                    </Button>
                                  </AccordionContent>
                                </AccordionItem>
                              )
                            })}
                          </Accordion>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
