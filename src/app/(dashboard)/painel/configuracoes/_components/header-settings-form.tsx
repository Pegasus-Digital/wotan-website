import { Header } from '@/payload/payload-types'
import { headerSchema } from '../_logic/schemas'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateHeaderSettings } from '../_logic/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

interface HeaderSettingsProps {
  header: Header
}

export default function HeaderSettingsForm({ header }: HeaderSettingsProps) {
  //form
  const form = useForm<z.infer<typeof headerSchema>>({
    resolver: zodResolver(headerSchema),
    defaultValues: {
      // logo: header.logo,
      navigation: {
        links: header.navigation.links,
        style: 'classic',
      },
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  async function onSubmit(values: z.infer<typeof headerSchema>) {
    // console.log('trying to submit form', values)
    const response = await updateHeaderSettings({
      ...header,
      navigation: {
        style: 'classic',
        links: values.navigation.links.map((link) => ({
          linkTo: {
            type: link.linkTo.type,
            newTab: link.linkTo.newTab,
            url: link.linkTo.url,
            label: link.linkTo.label,
          },
          onlyLink: true,
        })),
      },
    })

    if (response.status === true) {
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  }

  // const {
  //   fields: columnFields,
  //   append: appendColumn,
  //   remove: removeColumn,
  // } = useFieldArray({
  //   control: form.control,
  //   name: 'links',
  // })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className='w-full'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0'>
            <CardTitle>Altere as configurações do cabeçalho do site</CardTitle>
            <Button type='submit'>Salvar</Button>
          </CardHeader>
          <CardContent className='flex flex-col gap-4'>
            <Controller
              name={`navigation.links`}
              control={form.control}
              render={({ field: { value, onChange } }) => (
                <Accordion type='multiple'>
                  <div className='flex flex-row justify-between'>
                    <CardTitle>Links</CardTitle>
                    <Button
                      type='button'
                      onClick={() =>
                        onChange([
                          ...value,
                          {
                            linkTo: {
                              label: '',
                              url: '',
                              newTab: false,
                              type: 'custom',
                            },
                            onlyLink: true,
                          },
                        ])
                      }
                    >
                      + Link
                    </Button>
                  </div>

                  {value.map((link, linkIndex) => {
                    const currentLinkType = form.watch(
                      `navigation.links.${linkIndex}.linkTo.type`,
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
                              name={`navigation.links.${linkIndex}.linkTo.type`}
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
                              name={`navigation.links.${linkIndex}.linkTo.newTab`}
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
                                name={`navigation.links.${linkIndex}.linkTo.url`}
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
                                name={`navigation.links.${linkIndex}.linkTo.url`}
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
                              name={`navigation.links.${linkIndex}.linkTo.label`}
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
      </form>
    </Form>
  )
}
