'use client'

import { useMemo } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { AttributeType } from '@/payload/payload-types'

import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { createAttribute } from '../_logic/actions'
import { createAttributeSchema, hexRegex } from '../_logic/validations'

interface CreateAttributeFormProps {
  types: AttributeType[]
  setOpen: (state: boolean) => void
}

export function CreateAttributeForm({
  types,
  setOpen,
}: CreateAttributeFormProps) {
  const colorAttributeType = useMemo(() => {
    return types.find((type) => type.type === 'color')
  }, [types])

  const form = useForm<z.infer<typeof createAttributeSchema>>({
    resolver: zodResolver(createAttributeSchema),
    defaultValues: {
      name: '',
      value: '',
    },
  })

  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: z.infer<typeof createAttributeSchema>) {
    const { name, value, attributeTypeId } = values

    if (attributeTypeId === colorAttributeType.id) {
      const isValidHex = hexRegex.test(value)

      if (!isValidHex) {
        return toast.warning(
          `Para o agrupamento 'Cor', o campo valor deve ser formatado da seguinte maneira: '#FF00FF'`,
        )
      }
    }

    const response = await createAttribute({
      name,
      value,
      type: attributeTypeId,
    })

    if (response.status === true) {
      toast.success(response.message)
      setOpen(false)
    }

    if (response.status === false) {
      toast.error(response.message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <section className='grid h-full grid-cols-1 space-y-2.5'>
          <FormField
            name='name'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>

                <FormControl>
                  <Input
                    type='text'
                    placeholder='Nome do atributo'
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Nome que será mostrado na loja para o atributo
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='attributeTypeId'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo do atributo</FormLabel>

                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecione o grupo do atributo' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side='bottom'>
                    {types.map((type) => {
                      return (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>

                <FormDescription>
                  Ao criar um orçamento, apenas um atributo poderá ser escolhido
                  por grupo
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name='value'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>

                <FormControl>
                  <Input
                    type='text'
                    placeholder='Valor do atributo'
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Valor do atributo para o sistema. Se o atributo for uma cor,
                  deve ser um hexadecimal
                  <br /> ex: #FF00FF
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isSubmitting} type='submit' className='mt-4'>
            Criar atributo
          </Button>
        </section>
      </form>
    </Form>
  )
}
