'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Client } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

type SafeClient = Omit<Client, 'createdAt' | 'sizes' | 'updatedAt' | 'id'>

interface CreateClientResponseData {
  client: Client | null
}

export async function createClient(
  client: SafeClient,
): Promise<ActionResponse<CreateClientResponseData>> {
  try {
    const response = await payload.create({
      collection: 'clients',
      data: { ...client },
    })

    revalidatePath('/painel/clientes')

    return {
      data: { client: response },
      status: true,
      message: 'Cliente cadastrado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao cadastrar o cliente.',
    }
  }
}

interface UpdateActionResponseData {
  client: Client | null
}

export async function updateClient(
  client: SafeClient,
  id: string,
): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'clients',
      where: { id: { equals: id } },
      data: { ...client, id },
    })

    if (response.errors.length > 0) {
      // console.error(response.errors)

      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o cliente.',
      }
    }

    revalidatePath('/painel/catalogo/produtos')

    return {
      data: { client: response.docs[0] },
      status: true,
      message: 'Cliente atualizado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o cliente.',
    }
  }
}
