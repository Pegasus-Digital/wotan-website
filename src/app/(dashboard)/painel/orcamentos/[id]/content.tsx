'use client'

import { Small } from '@/components/typography/texts'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Attribute, Budget, Client, Salesperson } from '@/payload/payload-types'
import { Heading } from '@/pegasus/heading'
import { formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Content, ContentHeader } from '@/components/content'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { getClients, getSalespeople } from '../_logic/queries'

interface SeeBudgetContentProps {
  budget: Budget
  edit: boolean
  salespeople: Salesperson[]
  clients: Client[]
}

const productSchema = z.object({
  productId: z.string(),
  amount: z.coerce.number().positive(),
  details: z.string(),
})

const formSchema = z.object({
  companyName: z.string(),
  representative: z.string(),
  client: z.string(),
  details: z.string(),
  products: z.array(productSchema),
})

export function SeeBudgetContent({
  budget,
  edit,
  salespeople,
  clients,
}: SeeBudgetContentProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  console.log(salespeople)
  // const params = useSearchParams()
  // const edit = params.has('edit')

  const [editMode, toggleEditMode] = useState<boolean>(!edit)

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {},
  // })

  function handleToggleEdit() {
    toggleEditMode(!editMode)
  }

  return (
    <Content>
      <ContentHeader
        title={`${edit ? 'Editar o' : 'O'}rçamento #${budget.incrementalId}`}
        description={`Criado em ${formatRelative(budget.createdAt, new Date(), { locale: ptBR })}`}
      />
      <Separator className='mb-4' />

      <Card className=''>
        <CardHeader className=''>
          <Heading variant='h3'>Cliente</Heading>
        </CardHeader>
        <CardContent className=''>
          <div className='grid grid-cols-[1fr_auto_1fr]  items-center gap-x-6 gap-y-2 px-3'>
            <div className='grid gap-1'>
              <div className='space-y-1'>
                <Label>Empresa</Label>
                <Input
                  disabled={editMode}
                  value={budget.contact.companyName}
                  className='disabled:cursor-text disabled:opacity-100'
                />
              </div>

              <div className='space-y-1'>
                <Label>Responsável</Label>
                <Input
                  disabled={editMode}
                  value={budget.contact.customerName}
                  className='disabled:cursor-text disabled:opacity-100'
                />
              </div>

              <div className='space-y-1'>
                <Label>Email</Label>
                <Input
                  disabled={editMode}
                  value={budget.contact.email}
                  className='disabled:cursor-text disabled:opacity-100'
                />
              </div>

              <div className='space-y-1'>
                <Label>Telefone</Label>
                <Input
                  disabled={editMode}
                  value={budget.contact.phone}
                  className='disabled:cursor-text disabled:opacity-100'
                />
              </div>
            </div>
            <div className='relative flex h-full flex-col items-center justify-center gap-2'>
              <div className='absolute left-1/2 z-10 h-full w-[1px] -translate-x-1/2 transform bg-primary/50 line-through' />
              <Label className='z-20 bg-background p-2'>ou</Label>
            </div>

            <div className='grid gap-1'>
              <div className='space-y-1'>
                <Label>Cliente</Label>

                <Select disabled={editMode}>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione um Cliente' />
                  </SelectTrigger>
                  <SelectContent side='bottom'>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value='client'>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-1'>
                <Label>Contato</Label>

                <Select disabled={editMode}>
                  <SelectTrigger />
                </Select>
              </div>
            </div>

            <div className='col-span-3'>
              <Label>Observações do cliente</Label>
              <Textarea
                disabled={editMode}
                value={budget.contact.details}
                className='min-h-24 disabled:cursor-text disabled:opacity-100'
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Separator className='my-1' />

      <div className='grid grid-cols-2'>
        <div className='space-y-1'>
          <Label>Vendedor</Label>
          <Select disabled={editMode}>
            <SelectTrigger>
              <SelectValue placeholder='Selecione um Vendedor' />
            </SelectTrigger>
            <SelectContent side='bottom'>
              <SelectGroup>
                <SelectLabel>Vendedor Interno</SelectLabel>
                {typeof salespeople === 'object' &&
                  salespeople
                    .filter((person) => person.roles === 'internal')
                    .map((person) => (
                      <SelectItem key={person.id} value={person.name}>
                        {person.name}
                      </SelectItem>
                    ))}
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Representante Externo</SelectLabel>
                {salespeople &&
                  salespeople
                    .filter((person) => person.roles === 'representative')
                    .map((person) => (
                      <SelectItem key={person.id} value='salesperson'>
                        {person.name}
                      </SelectItem>
                    ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='space-y-1'>
          <Label>Comissão</Label>
          <Checkbox disabled={editMode} />
        </div>
      </div>

      <div className=''>
        <Label>Condições</Label>
        <Textarea
          disabled={editMode}
          value={budget.conditions}
          className='min-h-24 disabled:cursor-text disabled:opacity-100'
        />
      </div>

      <Separator className='my-1' />

      <Heading variant='h3'>Produtos</Heading>
      {budget.items?.map((item) => (
        <Card key={item.id}>
          <CardContent className='items-start justify-between p-2 shadow-sm tablet:flex'>
            {typeof item.product === 'object' && (
              <div>
                <Heading variant='h4'>{item.product.title}</Heading>
                <Small>Quantidade: {item.quantity}</Small>
                <div className='flex items-center space-x-2 space-y-1'>
                  {item.attributes?.map((attribute: Attribute) => (
                    <div key={item.id + attribute.id} className='mx-auto'>
                      <Small>
                        {typeof attribute.type === 'object' &&
                          attribute.type.name}
                        {': '}
                      </Small>
                      <Badge className='w-fit border-2 border-accent bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground'>
                        {typeof attribute === 'object' && attribute.name}

                        {typeof attribute.type === 'object' &&
                          attribute.type.type === 'color' && (
                            <div
                              style={{
                                backgroundColor: attribute.value,
                              }}
                              className='ml-2 h-5 w-5 rounded-full border-2'
                            />
                          )}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              {/* <Image
            resource={
              typeof item.product === 'object' &&
              item.product.featuredImage
            }
            imgClassName='w-24 h-24 aspect-square rounded-md shadow-wotan-light border hidden tablet:block'
          /> */}
            </div>
          </CardContent>
        </Card>
      ))}
    </Content>
  )
}
