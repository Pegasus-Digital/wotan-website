'use server'

import payload from 'payload'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'
import { Order } from '@/payload/payload-types'

interface DeleteOrderProps {
  orderId: string
}

type SafeOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>

interface DeleteOrderResponseData {}

export async function deleteOrder({
  orderId,
}: DeleteOrderProps): Promise<ActionResponse<DeleteOrderResponseData>> {
  try {
    const response = await payload.delete({
      collection: 'order',
      where: { id: { equals: orderId } },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao deletar o orçamento.',
      }
    }

    revalidatePath('/painel/contato')

    return {
      data: null,
      status: true,
      message: 'Orçamento deletado com sucesso.',
    }
  } catch (err) {
    // console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao deletar o orçamento.',
    }
  }
}

interface UpdateOrderProps {
  id: Order['id']
  order: SafeOrder
}

interface UpdateOrderResponseData {
  order: Order
}

export async function updateOrder({
  id,
  order,
}: UpdateOrderProps): Promise<ActionResponse<UpdateOrderResponseData>> {
  try {
    // console.log('foi', order)
    const response = await payload.update({
      collection: 'order',
      where: { id: { equals: id } },
      data: {
        ...order,
      },
    })

    revalidatePath('/painel/pedidos')

    return {
      data: { order: response.docs[0] },
      status: true,
      message: 'Pedido atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o pedido.',
    }
  }
}

export async function createOrder(
  order: SafeOrder,
): Promise<ActionResponse<UpdateOrderResponseData>> {
  try {
    // console.log('foi', order)
    const response = await payload.create({
      collection: 'order',
      data: {
        ...order,
      },
    })

    revalidatePath('/painel/pedidos')
    return {
      data: { order: response },
      status: true,
      message: 'Pedido criado com sucesso.',
    }
  } catch (err) {
    // console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao criar o pedido.',
    }
  }
}
