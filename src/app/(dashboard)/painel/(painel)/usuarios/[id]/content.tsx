'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller, useFormState } from 'react-hook-form'

import { ptBR } from 'date-fns/locale'
import { formatRelative } from 'date-fns'

import { Icons } from '@/components/icons'
import { Heading } from '@/pegasus/heading'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ContentLayout } from '@/components/painel-sistema/content-layout'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { updateUser } from '../_logic/actions'
import { userSchema } from '../_logic/validations'
import { User } from '@/payload/payload-types'

interface SeeUserContentProps {
  edit: boolean
  user: User
}

type UserProps = z.infer<typeof userSchema>

export function UserContent({ user, edit }: SeeUserContentProps) {
  const [editMode, toggleEditMode] = useState<boolean>(!edit)
  const router = useRouter()

  const form = useForm<UserProps>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      roles: user.roles,
      password: user.password,
    },
  })

  const { control, handleSubmit } = form
  const { isSubmitting } = useFormState({ control: form.control })

  async function onSubmit(values: UserProps) {
    const { name, email, roles, password } = values

    const response = await updateUser(user.id, {
      name,
      email,
      roles,
      password,
    })

    if (response.status === true) {
      toast.success(response.message)
      router.push('/painel/usuarios')
    }

    if (response.status === false) {
      toast.error(response.message)
    }
    return
  }

  return (
    <ContentLayout
      title={`${edit ? 'Editar u' : 'U'}suário`}
      navbarButtons={
        <Button
          type='submit'
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
          variant='default'
        >
          <Icons.Save className='mr-2 h-5 w-5' /> Salvar
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4 px-2 pt-4'
        >
          <div className='grid grid-cols-1 gap-2 tablet:grid-cols-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='roles'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange([value])}
                      disabled={editMode}
                      value={field.value[0]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione a função' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='user'>Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input {...field} type='password' disabled={editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </ContentLayout>
  )
}
