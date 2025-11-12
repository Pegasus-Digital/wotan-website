import { z } from 'zod'
import { productSchema } from '../../orcamentos/_logic/validation'

export const layoutSchema = z.object({
  id: z.string().optional().nullable(),
  printing: z
    .object({
      type: z.string().optional().nullable(),
      colors: z.string().optional().nullable(),
      supplyer: z.string().optional().nullable(),
      quantity: z.coerce.number().optional().nullable(),
      price: z.coerce.number().optional().nullable(),
    })
    .optional(),
  printing2: z
    .object({
      type: z.string().optional().nullable(),
      colors: z.string().optional().nullable(),
      supplyer: z.string().optional().nullable(),
      quantity: z.coerce.number().optional().nullable(),
      price: z.coerce.number().optional().nullable(),
    })
    .optional(),
  supplyer: z
    .array(
      z.object({
        material: z.string().optional().nullable(),
        quantidade_material: z.coerce.number().optional().nullable(),
        fornecedor_material: z.string().optional().nullable(),
        custo_material: z.coerce.number().optional().nullable(),
        id: z.string().optional().nullable(),
      }),
    )
    .optional()
    .nullable(),
  additionalCosts: z
    .object({
      obs: z.string().optional().nullable(),
      cost: z.coerce.number().optional().nullable(),
    })
    .optional(),
  additionalCosts2: z
    .object({
      obs: z.string().optional().nullable(),
      cost: z.coerce.number().optional().nullable(),
    })
    .optional(),
  delivery: z
    .object({
      company: z.string().optional().nullable(),
      cost: z.coerce.number().optional().nullable(),
    })
    .optional(),
  delivery2: z
    .object({
      company: z.string().optional().nullable(),
      cost: z.coerce.number().optional().nullable(),
    })
    .optional(),
  commisions: z
    .object({
      agency: z
        .object({
          name: z.string().optional().nullable(),
          value: z.coerce
            .number()
            .max(100, 'Porcentagem inválida.')
            .optional()
            .nullable(),
        })
        .optional(),
      salesperson: z
        .object({
          name: z.string().optional().nullable(),
          value: z.coerce
            .number()
            .max(100, 'Porcentagem inválida.')
            .optional()
            .nullable(),
        })
        .optional(),
    })
    .optional(),
  layout: z
    .object({
      sent: z.boolean().optional().nullable(),
      approved: z.boolean().optional().nullable(),
      sameAsPrevious: z.boolean().optional().nullable(),
      reSent: z.boolean().optional().nullable(),
      fotolitus: z.boolean().optional().nullable(),
      obs: z.string().optional().nullable(),
    })
    .optional(),
  sample: z
    .object({
      with: z.boolean().optional().nullable(),
      approved: z.boolean().optional().nullable(),
      new: z.boolean().optional().nullable(),
    })
    .optional(),
  prazoentrega: z.string().optional().nullable(),
  transp: z.string().optional().nullable(),
  shipmentType: z.union([z.literal('cif'), z.literal('fob')]).optional(),
  shipmentCost: z.string().optional().nullable(),
  quote: z.string().optional().nullable(),
  volumeNumber: z.string().optional().nullable(),
  shipmentDate: z.string().optional().nullable(),
  paymentType: z
    .union([z.literal('boleto'), z.literal('pix'), z.literal('deposito')])
    .optional(),
  invoice: z
    .object({
      number: z.string().optional().nullable(),
      due: z.string().optional().nullable(),
      value: z.coerce.number().optional().nullable(),
    })
    .optional(),
  invoice2: z
    .object({
      number: z.string().optional().nullable(),
      due: z.string().optional().nullable(),
      value: z.coerce.number().optional().nullable(),
    })
    .optional(),
  invoice3: z
    .object({
      number: z.string().optional().nullable(),
      due: z.string().optional().nullable(),
      value: z.coerce.number().optional().nullable(),
    })
    .optional(),
  ncm: z.string().optional().nullable(),
  obs_final: z.string().optional().nullable(),
})

export const orderSchema = z.object({
  client: z
    .string({ required_error: 'Cliente é obrigatório' })
    .min(1, 'Cliente é obrigatório'),
  contact: z
    .string({ required_error: 'Contato é obrigatório' })
    .min(1, 'Contato é obrigatório'),
  salesperson: z
    .string({ required_error: 'Vendedor é obrigatório' })
    .min(1, 'Vendedor é obrigatório'),
  commission: z.coerce
    .number({ required_error: 'Insira um número válido.' })
    .nonnegative({ message: 'Comissão não pode ser negativa.' })
    .max(100, 'A comissão máxima é de 100%'),

  shippingTime: z.string().optional(),
  shippingCompany: z.string().optional(),
  shippingType: z.enum(['cif', 'fob']).optional(),
  paymentConditions: z.string().optional(),
  paymentType: z.enum(['boleto', 'pix', 'deposito']).optional(),

  alternativeContact: z
    .object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      whatsapp: z.string().optional(),
    })
    .optional(),

  adress: z
    .object({
      street: z.string().optional(),
      number: z.string().optional(),
      neighborhood: z.string().optional(),
      zipCode: z.string().optional(),
      city: z.string().optional(),
      state: z
        .enum([
          'AC',
          'AL',
          'AP',
          'AM',
          'BA',
          'CE',
          'DF',
          'ES',
          'GO',
          'MA',
          'MS',
          'MT',
          'MG',
          'PA',
          'PB',
          'PR',
          'PE',
          'PI',
          'RJ',
          'RN',
          'RS',
          'RO',
          'RR',
          'SC',
          'SP',
          'SE',
          'TO',
        ])
        .nullable()
        .optional(),
    })
    .optional(),
  itens: z
    .array(
      z.object({
        layout: z.union([z.string(), layoutSchema]).optional(),
        product: z.union([z.string(), productSchema]),
        description: z.string().optional(),
        quantity: z.coerce.number().positive().optional(),
        price: z.coerce
          .number()
          .positive({ message: 'Preço deve ser positivo' }),
        attributes: z.array(z.string()).optional(),
        print: z.string().optional(),
        sample: z.boolean().optional(),
        layoutSent: z.boolean().optional(),
        layoutApproved: z.boolean().optional(),
      }),
    )
    .optional(),
  agency: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
})
