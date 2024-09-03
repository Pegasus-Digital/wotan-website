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
      state: z.string().optional(),
    })
    .optional(),
  salesperson: z.string(),
  itens: z
    .array(
      z.object({
        product: z.union([z.string(), productSchema]),
        quantity: z.number().positive().optional(),
        price: z.number().positive({ message: 'Preço deve ser positivo' }),
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
  paymentType: z.enum(['boleto', 'cheque', 'deposito']).optional(),
  agency: z.string().optional(),
  commission: z.number().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
})
