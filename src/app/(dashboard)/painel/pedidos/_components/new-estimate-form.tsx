'use client'

import { useState } from 'react'

import { Product } from '@/payload/payload-types'

import { cn } from '@/lib/utils'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
  FormDescription,
} from '@/components/ui/form'

import { Large, Lead } from '@/components/typography/texts'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

const productSchema = z.object({
  productId: z.string(),
  amount: z.coerce.number().positive(),
  details: z.string(),
})

type ProductProps = z.infer<typeof productSchema>

const formSchema = z.object({
  id: z.string(),
  representative: z.string(),
  client: z.string(),
  details: z.string(),
  products: z.array(productSchema),
})

export function NewEstimateForm() {
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log('Trying to submit form.', values)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  const clients = [
    { label: 'John', id: '1' },
    { label: 'Luke', id: '2' },
    { label: 'Maria', id: '3' },
    { label: 'Jonas', id: '4' },
    { label: 'Cleber', id: '5' },
    { label: 'Sergio', id: '6' },
    { label: 'Cristiano', id: '7' },
    { label: 'Claudio', id: '8' },
    { label: 'Marcos', id: '9' },
  ] as const

  const [products, setProducts] = useState<ProductProps[]>([])
  const [selected, setSelected] = useState<string>('')

  function handleNewProduct(productId: string) {
    if (productId === '') return

    const newProduct: ProductProps = {
      productId: '',
      amount: 50,
      details: '',
    }

    setProducts([...products, newProduct])
  }

  function handleRemoveProduct(idToRemove: string) {
    const updatedProducts = products.filter(
      (product) => product.productId !== idToRemove,
    )

    setProducts([...updatedProducts])
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4 '
      >
        {/* Form fields */}
        <section className='space-y-2 px-2'>
          <FormField
            control={form.control}
            name='id'
            render={({ field }) => (
              <FormItem className='w-fit'>
                <FormLabel>ID do orçamento</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    type='text'
                    placeholder='ID gerado automaticamente'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center gap-6'>
            <FormField
              name='representative'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Representante</FormLabel>

                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          className='font-bold'
                          placeholder='Selecione o representante'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Iterar clientes */}
                      <SelectItem value={'Vitor'}>Vitor</SelectItem>
                      <SelectItem value={'Cleber'}>Cleber</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    O representante ao qual o orçamento será vinculado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='client'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Cliente</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className='justify-between'
                        >
                          {field.value
                            ? clients.find(
                                (client) => client.id === field.value,
                              )?.label
                            : 'Selecione o cliente'}
                          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='p-0'>
                      <Command>
                        <CommandInput
                          placeholder='Procurar cliente...'
                          className='h-9'
                        />
                        <CommandEmpty>Cliente não encontrado.</CommandEmpty>
                        <CommandGroup>
                          {clients.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.label}
                              onSelect={() => {
                                form.setValue('client', client.id)
                              }}
                            >
                              {client.label}
                              <CheckIcon
                                className={cn(
                                  'ml-auto h-4 w-4',
                                  client.id === field.value
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    O cliente ao qual o orçamento será vinculado.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>
        <section className='space-y-2 px-2'>
          <div className='flex items-center justify-between'>
            <Large className='text-lg font-semibold leading-none tracking-tight'>
              Produtos
            </Large>

            <Button
              onClick={() => handleNewProduct(selected)}
              variant='outline'
              size='sm'
              type='button'
            >
              <Icons.Add className='mr-2 h-5 w-5' />
              Adicionar produto
            </Button>
          </div>

          {products.length === 0 && (
            <Lead className='text-center text-sm'>
              Ainda não foi adicionado nenhum produto ao orçamento.
            </Lead>
          )}

          {/* {products.map((product, index) => (
            <NewProduct key={index} removeProduct={handleRemoveProduct} />
          ))} */}
        </section>

        <Separator />

        <FormSubmitRow text='Criar' />
      </form>
    </Form>
  )
}

interface FormSubmitRowProps {
  text: string
}

// Alterar para cada tipo de formulário
function FormSubmitRow({ text }: FormSubmitRowProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex-1' />

      <Button className='w-1/3 self-end text-base font-bold' type='submit'>
        {text}
      </Button>
    </div>
  )
}

interface NewProductProps {
  data: Product
  removeProduct: (id: string) => void
}
