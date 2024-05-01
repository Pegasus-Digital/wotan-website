'use client'

import { useMemo } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { Attribute, AttributeType, Page } from '@/payload/payload-types'

import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Button } from '@/pegasus/button'
import { Input } from '@/components/ui/input'

import { updatePage } from '../_logic/actions'
import { pageSchema } from '../_logic/validations'
import { Textarea } from '@/components/ui/textarea'

import { FAQ } from './faq-section'
import Statistics from './statistics-section'

const sectionEditTypes = {
  // 'product-carousel': ProductSlider,
  // 'featured-section': FeaturedGrid,
  'statistic-section': 'statisticSection',
  // 'content-section': ContentSection,
  // 'client-grid': ClientGrid,
  // 'content-media': ContentMedia,
  'faq-section': 'faqSection',
  // 'three-columns': ThreeColumns,
  // 'timeline-section': Timeline,
}

const sectionEdit = {
  // 'product-carousel': ProductSlider,
  // 'featured-section': FeaturedGrid,
  'statistic-section': Statistics,
  // 'content-section': ContentSection,
  // 'client-grid': ClientGrid,
  // 'content-media': ContentMedia,
  'faq-section': FAQ,
  // 'three-columns': ThreeColumns,
  // 'timeline-section': Timeline,
}

interface UpdatePageFormProps {
  currentPage: Page
}

export function UpdatePageForm({ currentPage }: UpdatePageFormProps) {
  const form = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      // id: currentPage.id,
      title: currentPage.title,
      // layout: currentPage.layout,
      description: currentPage.description,
      slug: currentPage.slug,
      _status: currentPage._status,
    },
  })

  const { isSubmitting, errors } = useFormState({ control: form.control })

  console.log(form.getValues())

  async function onSubmit(values: z.infer<typeof pageSchema>) {
    // const { id, title, description, layout } = values
    console.log('Trying to submit form.', values)
    console.log({ values })

    // const response = await updatePage({
    //   id: currentPage.id,
    //   title: values.title,
    //   slug: values.slug,
    //   // layout: values.layout,
    //   // ...currentPage,
    //   ...values,
    //   // layout: [],
    // })

    // if (response.status === true) {
    //   toast.success(response.message)
    // }

    // if (response.status === false) {
    //   toast.error(response.message)
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-2'>
          <FormField
            name='title'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-bold'>Título</FormLabel>

                <FormControl>
                  <Input type='text' placeholder='Nome da página' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* {slug === 'home' ? <div></div> : <Textarea value={currentdescription} />} */}

          {currentPage.layout.map((section, index) => {
            if (section.blockType && section.blockType in sectionEdit) {
              const Block = sectionEdit[section.blockType]
              // const props = sectionEditTypes[section.blockType]

              switch (section.blockType) {
                // case 'statistic-section':
                //   return (
                //     <Block key={index} form={form} statisticSection={section} />
                //   )

                case 'faq-section':
                  return <Block key={index} form={form} faqSection={section} />
                default:
                  return null
              }
            }
            return null
          })}
          <Button disabled={isSubmitting} type='submit'>
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  )
}
