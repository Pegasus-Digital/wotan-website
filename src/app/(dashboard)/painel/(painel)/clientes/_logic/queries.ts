import 'server-only'

import payload from 'payload'

import { z } from 'zod'
import { clientParamsSchema } from '@/lib/validations'

import { unstable_noStore as noStore } from 'next/cache'

function formatDocument(input: string): {
  cpf: string;
  cnpj: string;
} {
  // Remove all non-numeric characters
  const cleaned = input.replace(/[^0-9]/g, '');

  // Ensure length is between 3 and 14
  if (cleaned.length < 3 || cleaned.length > 14) {
    throw new Error('Input must contain between 3 and 14 characters.');
  }

  // Pad with zeros to ensure 11 digits for CPF and 14 for CNPJ
  const paddedForCPF = cleaned.padEnd(11, '0').slice(0, 11);
  const paddedForCNPJ = cleaned.padEnd(14, '0').slice(0, 14);

  // Format as CPF
  const cpfFull = `${paddedForCPF.slice(0, 3)}.${paddedForCPF.slice(3, 6)}.${paddedForCPF.slice(6, 9)}-${paddedForCPF.slice(9, 11)}`;
  const cpf = cpfFull.slice(0, cleaned.length);

  // Format as CNPJ
  const cnpjFull = `${paddedForCNPJ.slice(0, 2)}.${paddedForCNPJ.slice(2, 5)}.${paddedForCNPJ.slice(5, 8)}/${paddedForCNPJ.slice(8, 12)}-${paddedForCNPJ.slice(12, 14)}`;
  const cnpj = cnpjFull.slice(0, cleaned.length);

  return { cpf, cnpj };
}

export async function getClients(
  searchParams: z.infer<typeof clientParamsSchema>,
) {
  noStore()

  try {
    const { page, per_page, sort, document } = searchParams

    // console.log('doc:', document)

    const cleanDoc = document ? document.replace(/[^0-9]/g, '') : undefined
    // console.log('clean: ', cleanDoc)
    const { cnpj: tryCNPJ, cpf: tryCPF } = formatDocument(cleanDoc)

    console.log('cpf:', tryCPF)
    console.log('cnpj:', tryCNPJ)


    const whereQuery = (cleanDoc !== undefined && cleanDoc.length > 3) ? {
      // document: { contains: cleanDoc ? cleanDoc : '' },
      or: [
        {
          document: {
            contains: cleanDoc ? cleanDoc : ''
          },
        },
        {
          document: {
            contains: tryCPF ? tryCPF : '',
          },
        },
        {
          document: {
            contains: tryCNPJ ? tryCNPJ : '',
          },
        },
      ],
    } : undefined

    // console.log('where: ', whereQuery)

    const response = await payload.find({
      collection: 'clients',
      page,
      limit: per_page,
      where: whereQuery,
      sort,
    })

    console.log('data:', response.docs)

    return {
      data: response.docs,
      pageCount: response.totalPages,
    }
  } catch (err) {
    return { data: [], pageCount: 0 }
  }
}

export async function getClientByDocument(document: string) {
  noStore()

  try {
    const response = await payload.find({
      collection: 'clients',
      where: {
        document: { equals: document },
      },
      limit: 1,
    })
    // console.log(response)
    return { data: response.docs[0] }
  } catch (err) {
    return { data: null }
  }
}
export async function getClientById(document: string) {
  noStore()

  try {
    const response = await payload.findByID({
      collection: 'clients',
      id: document,
    })
    // console.log(response)
    return { data: response }
  } catch (err) {
    return { data: null }
  }
}
