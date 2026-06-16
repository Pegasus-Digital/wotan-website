'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Client } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'
import { preserveClientContactIds, reconcileOrderContactReferences } from '@/lib/order-contact'

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

    revalidatePath('/sistema/clientes')

    return {
      data: { client: response },
      status: true,
      message: 'Cliente cadastrado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

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
    const existingClient = await payload.findByID({
      collection: 'clients',
      id,
    })

    const contacts = preserveClientContactIds(
      existingClient.contacts,
      client.contacts ?? [],
    )

    const updatedClient = await payload.update({
      id,
      collection: 'clients',
      data: { ...client, contacts },
    })

    if (!updatedClient) {
      // console.error(response.errors)

      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o cliente.',
      }
    }

    await reconcileOrderContactReferences(
      async () => {
        const orders = await payload.find({
          collection: 'order',
          where: { client: { equals: id } },
          limit: 1000,
        })
        return orders.docs
      },
      async (orderId, contactId) => {
        await payload.update({
          collection: 'order',
          id: orderId,
          data: { contact: contactId },
        })
      },
      contacts,
    )

    revalidatePath('/sistema/clientes')
    revalidatePath('/sistema/orcamentos')
    revalidatePath('/sistema/pedidos')

    return {
      data: { client: updatedClient },
      status: true,
      message: 'Cliente atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

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

interface DeleteActionResponseData { }

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

    revalidatePath('/sistema/clientes')

    return {
      data: null,
      status: true,
      message: 'Cliente deletado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

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

    revalidatePath('/sistema/clientes')

    return {
      data: { client: response.docs[0] },
      status: true,
      message: 'Vendedor atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o vendedor.',
    }
  }
}

interface UpdateClientStatusProps {
  id: string
  status: 'active' | 'inactive' | 'prospect'
}

export async function updateClientStatus({
  id,
  status,
}: UpdateClientStatusProps): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'clients',
      where: { id: { equals: id } },
      data: { status },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o vendedor.',
      }
    }

    revalidatePath('/sistema/clientes')

    return {
      data: { client: response.docs[0] },
      status: true,
      message: 'Vendedor atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o vendedor.',
    }
  }
}
