'use client'

import { useMemo } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormState } from 'react-hook-form'

import { AttributeType } from '@/payload/payload-types'

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Button } from '@/pegasus/button'
import { Input } from '@/components/ui/input'

import { createAttribute } from '../_logic/actions'

const createAttributeSchema = z.object({
  name: z.string().min(3, 'Campo deve conter no mínimo 3 caracteres.'),
  value: z.string().min(1, 'Campo deve conter no mínimo 1 caracter.'),
  attributeTypeId: z.string({
    required_error: 'Escolha um tipo.',
  }),
})

interface CreateAttributeFormProps {
  types: AttributeType[]
  setOpen: (state: boolean) => void
}

export function CreateAttributeForm({
  types,
  setOpen,
}: CreateAttributeFormProps) {
  const form = useForm<z.infer<typeof createAttributeSchema>>({
    resolver: zodResolver(createAttributeSchema),
    defaultValues: {
      name: '',
      value: '',
    },
  })

  const { isSubmitting } = useFormState({ control: form.control })

  const colorAttributeType = useMemo(() => {
    return types.find((type) => type.type === 'color')
  }, [types])

  const hexRegex = /^#[0-9A-Fa-f]{6}$/

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
