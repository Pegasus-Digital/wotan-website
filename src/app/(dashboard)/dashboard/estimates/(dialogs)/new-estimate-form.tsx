'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

import { Large, Lead, P, Small } from '@/components/typography/texts'

import { PlusCircle, Trash, X } from 'lucide-react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { Product } from '@/payload/payload-types'

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
    console.log('Trying to submit form.', values)
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

  function handleAddProduct(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

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

    console.log(updatedProducts)

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
              onClick={handleAddProduct}
              variant='outline'
              size='sm'
              type='button'
            >
              <PlusCircle className='mr-2 h-5 w-5' />
              Adicionar produto
            </Button>
          </div>

          {products.length === 0 && (
            <Lead className='text-center text-sm'>
              Ainda não foi adicionado nenhum produto ao orçamento.
            </Lead>
          )}

          {products.map((product, index) => (
            <ProductCard key={index} removeProduct={handleRemoveProduct} />
          ))}
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

interface ProductCardProps {
  removeProduct: (id: string) => void
}

function ProductCard({ removeProduct }: ProductCardProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [id, setId] = useState<string>('')

  const products: Product[] = [
    {
      id: '728ed52f',
      title: 'Camisa X',
      createdAt: new Date().toString(),
      updatedAt: null,
      slug: 'camisa-x',
      sku: '22435',
      _status: 'draft',
    },
    {
      id: '331cz95a',
      title: 'Camisa Y',
      createdAt: new Date().toString(),
      updatedAt: null,
      slug: 'camisa-y',
      sku: '22436',
      _status: 'published',
    },
  ]

  const product = products.find((product) => product.id === id)

  return (
    <Card className='relative flex items-center'>
      <CardContent className='m-0 flex gap-4 p-2'>
        <div className='space-y-2'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                aria-expanded={open}
                className='w-full justify-between'
              >
                {id
                  ? products.find((product) => product.id === id).title
                  : 'Selecione um produto.'}
                <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
              </Button>
            </PopoverTrigger>

            <PopoverContent className='m-0 w-fit p-0'>
              <Command>
                <CommandInput placeholder='Procure por um produto...' />
                <CommandEmpty>Produto não encontrado.</CommandEmpty>
                <CommandGroup>
                  {products.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.title}
                      onSelect={(title) => {
                        // Ler esse codigo vai te colocar mais proximo de Deus
                        // Nao no bom sentido de ter mais conhecimento ou algo assim, mas sim de remover dias de vida
                        // Foi mal
                        setId(
                          products.find(
                            (product) => product.title.toLowerCase() === title,
                          ).id,
                        )
                        setOpen(false)
                      }}
                    >
                      {product.title}
                      <CheckIcon
                        className={cn(
                          'ml-auto h-4 w-4',
                          id === product.id ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Input placeholder='Selecione a quantidade' />

          <Textarea
            className='resize-none'
            maxLength={300}
            placeholder='Detalhes sobre o orçamento'
          />
        </div>

        <div>
          {id !== '' && (
            <div className='flex flex-col'>
              <Small>id: {product.id}</Small>
              <Small>title: {product.title}</Small>
              <Small>
                createdAt: {new Date(product.createdAt).toLocaleDateString()}
              </Small>
              <Small>sku: {product.sku}</Small>
              <Small>_status: {product._status}</Small>
            </div>
          )}
        </div>

        <Button
          variant='destructive'
          size='icon'
          type='button'
          className='absolute bottom-2 right-2'
        >
          <Trash onClick={() => removeProduct(id)} className='h-5 w-5' />
        </Button>
      </CardContent>
    </Card>
  )
}
