import { z } from 'zod'

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/

export const clientSchema = z.object({
  name: z.string().nullable(),
  razaosocial: z.string().optional().nullable(),
  type: z.enum(['company', 'individual']),
  document: z.string().min(1, { message: 'Documento é obrigatório' }),
  contacts: z.array(
    z.object({
      name: z.string().optional().nullable(),
      email: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
      whatsapp: z.string().optional().nullable(),
    }),
  ),
  adress: z
    .object({
      street: z.string().nullable(),
      number: z.string().nullable(),
      neighborhood: z.string().nullable(),
      city: z.string().nullable(),
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
        .nullable(),
      cep: z.string().nullable(),
    })
    .nullable(),
  clientSince: z.date().optional().nullable(),
  observations: z.string().optional().nullable(),
  ramo: z.string().optional().nullable(),
  salesperson: z.string(),
  origin: z.enum([
    'ads',
    'indication',
    'fiergs-list',
    'telephone-list',
    'direct',
    'prospect',
    'website',
    'other',
  ]),
  status: z.enum(['active', 'inactive', 'prospect']),
})
