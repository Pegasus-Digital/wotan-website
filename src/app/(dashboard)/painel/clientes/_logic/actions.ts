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
    // Check if a client with the same document already exists
    const existingClient = await payload.find({
      collection: 'clients',
      where: {
        document: {
          equals: client.document,
        },
      },
    })

    // If a client with the same document exists, return a response indicating this
    if (existingClient.docs.length > 0) {
      return {
        data: null,
        status: false,
        message: 'Cliente com este documento já existe.',
      }
    }

    // If no client with the same document exists, proceed to create the client
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

interface DeleteClientProps {
  clientId: string
}

interface DeleteActionResponseData {}

export async function deleteClient({
  clientId,
}: DeleteClientProps): Promise<ActionResponse<DeleteActionResponseData>> {
  try {
    const response = await payload.delete({
      collection: 'clients',
      where: { id: { equals: clientId } },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao deletar o cliente.',
      }
    }

    revalidatePath('/painel/clientes')

    return {
      data: null,
      status: true,
      message: 'Cliente deletado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao deletar o cliente.',
    }
  }
}

interface updateClientSalespersonProps {
  id: string
  salespersonId: string
}

interface UpdateSalespersonActionResponseData {
  client: Client | null
}

export async function updateClientSalesperson({
  id,
  salespersonId,
}: updateClientSalespersonProps): Promise<
  ActionResponse<UpdateSalespersonActionResponseData>
> {
  try {
    const response = await payload.update({
      collection: 'clients',
      where: { id: { equals: id } },
      data: { salesperson: salespersonId }, // Update only the salespersonId
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o vendedor.',
      }
    }

    revalidatePath('/painel/clientes')

    return {
      data: { client: response.docs[0] },
      status: true,
      message: 'Vendedor atualizado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o vendedor.',
    }
  }
}
