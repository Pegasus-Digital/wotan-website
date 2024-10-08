'use client'

import { useRouter } from 'next/navigation'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner'
import { formatPhoneNumber } from '@/lib/format'

import { Button } from '@/pegasus/button'
import { Icons } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Lead, P, Small } from '@/components/typography/texts'

import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form'

import { useCartStore } from '@/components/cart-store-provider'

const cartSchema = z.array(
  z.object({
    id: z.string().uuid(),
    productId: z.string(),
    productName: z.string(),
    amount: z.coerce.number().min(1),
    attributes: z.array(z.any()),
  }),
)

const formSchema = z.object({
  companyName: z
    .string({
      required_error: 'Preencha com o nome da sua empresa.',
    })
    .min(3, 'Este campo deve conter no mínimo 3 caracteres.'),
  customerName: z
    .string({
      required_error: 'Preencha com o nome do responsável.',
    })
    .min(3, 'Este campo deve conter no mínimo 3 caracteres.'),

  email: z.string().email({ message: 'Insira um e-mail válido.' }),
  phone: z.string().min(14, { message: 'Insira um telefone válido.' }),

  details: z.string(),
})

export function FinishEstimateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
      email: '',
      companyName: '',
      customerName: '',
      details: '',
    },
  })

  const { cart, flushToilet } = useCartStore((state) => state)
  const router = useRouter()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const cartData = cartSchema.parse(cart)

      if (cartData.length === 0) {
        toast.warning('Orçamento não enviado. O carrinho parece estar vazio.')
        return
      }

      const response = await fetch('/api/finalizar', {
        method: 'POST',
        body: JSON.stringify({
          items: cartData,
          contact: { ...values, origin: 'website' },
        }),
      })

      if (response.ok) {
        toast.success(
          'O orçamento enviado com sucesso. Você será redirecionado.',
        )

        window.scrollTo({ top: 0, behavior: 'smooth' })

        flushToilet() // Limpar carrinho

        setTimeout(() => {
          router.push('/')
        }, 4000)
      }
    } catch (error) {
      console.error(error)

      toast.warning('Houve um erro ao enviar o orçamento.')
      return
    }
  }

  return (
    <Form {...form}>
      <form
        className='my-4 flex h-full w-full flex-col items-center'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className='flex w-full max-w-3xl flex-col space-y-2 bg-card/85 text-foreground'>
          <CardHeader>
            <CardTitle className='text-primary'>Orçamento</CardTitle>
            <CardDescription>{cart.length} itens no carrinho</CardDescription>
            {!cart && <Small>Carregando carrinho...</Small>}
            {cart.map((item) => (
              <div
                key={item.id}
                className='w-full space-y-1 rounded-md border px-3 py-2'
              >
                <Lead className='font-semibold text-foreground'>
                  {item.productName}
                </Lead>
                <P className='inline-block font-medium'>
                  Quantidade: {item.amount}
                </P>
                <div className='block items-center gap-2 tablet:flex'>
                  {item.attributes.map((attr) => (
                    <Badge
                      key={attr.id}
                      className='mr-2 w-min whitespace-nowrap bg-black/55 hover:bg-black/90'
                    >
                      {typeof attr.type === 'object' && attr.type.name}:{' '}
                      {attr.value}
                    </Badge>
                  ))}
                </div>
                <Small></Small>
              </div>
            ))}
          </CardHeader>

          <CardContent>
            <CardTitle className='mb-2 text-primary'>
              Informações necessárias
            </CardTitle>

            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da empresa</FormLabel>
                  <FormControl>
                    <Input
                      className='ring-none outline-none'
                      placeholder='Nome da empresa'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='customerName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do responsável</FormLabel>
                  <FormControl>
                    <Input
                      className='ring-none outline-none'
                      placeholder='Nome do responsável'
                      type='text'
                      {...field}
                    />
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
                  <FormLabel>Email de contato</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete={'email'}
                      className='ring-none outline-none'
                      placeholder='Email'
                      type='text'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phone'
              render={({ field: { onChange, ...props } }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete={'tel'}
                      className='ring-none outline-none'
                      placeholder='Telefone'
                      maxLength={15}
                      type='text'
                      onChange={(e) => {
                        const { value } = e.target
                        e.target.value = formatPhoneNumber(value)
                        onChange(e)
                      }}
                      {...props}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='details'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      className='ring-none outline-none'
                      placeholder='Se houver outras informações relevantes, informe neste campo.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className='flex justify-end'>
            <Button
              className='self-end transition-colors hover:brightness-125'
              variant='expandIcon'
              Icon={Icons.Message}
              iconPlacement='right'
              size='lg'
            >
              Finalizar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
