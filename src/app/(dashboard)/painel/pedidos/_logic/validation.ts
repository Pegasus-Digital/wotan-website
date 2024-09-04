import { z } from 'zod'
import { productSchema } from '../../orcamentos/_logic/validation'

export const orderSchema = z.object({
  client: z.string().nonempty({ message: 'Cliente é obrigatório' }),
  contact: z.string().nonempty({ message: 'Contato é obrigatório' }),
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
  salesperson: z.string(),
  itens: z
    .array(
      z.object({
        product: z.union([z.string(), productSchema]),
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
  shippingTime: z.string().optional(),
  shippingCompany: z.string().optional(),
  shippingType: z.enum(['cif', 'fob']).optional(),
  paymentConditions: z.string().optional(),
  paymentType: z.enum(['boleto', 'pix', 'deposito']).optional(),
  agency: z.string().optional(),
  commission: z.coerce.number().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
})
