'use server'

import payload from 'payload'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'


interface DeleteOrderProps {
  orderId: string
}

interface DeleteOrderResponseData { }

export async function deleteOrder(
  data: DeleteOrderProps,
): Promise<ActionResponse<DeleteOrderResponseData>> {
  try {
    const response = await payload.delete({
      id: data.orderId,
      collection: 'old-order',
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao deletar o pedido.',
      }
    }

    revalidatePath('/painel/pedidos')

    return {
      data: null,
      status: true,
      message: 'Pedido deletado com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: `[500] Ocorreu um erro ao deletar o pedido.`,
    }
  }
}