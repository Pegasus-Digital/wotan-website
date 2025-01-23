'use client'

import WotanLogo from '@/components/logo-wotan'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef } from 'react'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { useSalesAuth } from '@/components/sales-auth-provider'

const formLogin = z.object({
  email: z
    .string({ required_error: 'É necessário fornecer um e-mail.' })
    .email({ message: `E-mail inválido.` }),
  password: z
    .string({ required_error: 'É necessário fornecer uma senha.' })
    .min(4, { message: 'Senha deve conter no mínimo 4 caracteres' }),
})

export function LoginContent() {
  const searchParams = useSearchParams()
  const redirect = useRef(searchParams.get('redirect'))
  const { user, login } = useSalesAuth()
  const router = useRouter()

  const form = useForm<z.infer<typeof formLogin>>({
    resolver: zodResolver(formLogin),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (data: z.infer<typeof formLogin>) => {
      try {
        const response = await login(data)
        console.log(response)
        // if (redirect?.current)
        //   router.push(
        //     `${redirect.current as string}&success=${encodeURIComponent('Login realizado com sucesso.')}`,
        //   )
        // else
        router.push(
          `/sistema/inicio?success=${encodeURIComponent(
            'Login realizado com sucesso.',
          )}`,
        )
      } catch (err) {
        console.error(err)
        toast.error('Credenciais inválidas. Por favor, tente novamente.')
      }
    },
    [login, router],
  )

  return (
    <>
      {!user && (
        <div className='col-span-2 flex h-full w-full items-center justify-center'>
          <Card className='w-full max-w-sm'>
            <CardHeader>
              <div className='flex items-center space-x-2'>
                <WotanLogo className='h-8 w-8' />
                <CardTitle className='text-2xl'>Login</CardTitle>
              </div>
              <CardDescription>
                Entre seu e-mail abaixo para fazer login no sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='grid gap-4'
                >
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>E-mail</Label>
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className='ring-none outline-none'
                              type='text'
                              placeholder='usuario@wotanbrindes.com.br'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='password'>Senha</Label>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className='ring-none outline-none'
                              type='password'
                              placeholder='••••••••'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button className='w-full' type='submit'>
                    Entrar
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
