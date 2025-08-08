'use server'

import payload from 'payload'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'
import { Layout, Order } from '@/payload/payload-types'

type SafeOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
type SafeLayout = Omit<Layout, 'id' | 'createdAt' | 'updatedAt'>

interface DeleteOrderProps {
  orderId: string
}

interface DeleteOrderResponseData {}

interface UpdateOrderStatusProps {
  orderId: string
  status: Order['status']
}

interface UpdateOrderStatusResponseData {
  order: Order
}

export async function deleteOrder(
  data: DeleteOrderProps,
): Promise<ActionResponse<DeleteOrderResponseData>> {
  try {
    const response = await payload.delete({
      id: data.orderId,
      collection: 'order',
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

interface UpdateOrderProps {
  orderId: string
  order: SafeOrder
}

interface UpdateOrderResponseData {
  order: Order
}

export async function updateOrder(
  data: UpdateOrderProps,
): Promise<ActionResponse<UpdateOrderResponseData>> {
  try {
    // console.log('foi', order)
    const response = await payload.update({
      id: data.orderId,
      collection: 'order',
      data: {
        ...data.order,
      },
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: 'Ocorreu um erro ao atualizar o pedido.',
      }
    }

    revalidatePath('/painel/pedidos')

    return {
      data: { order: response },
      status: true,
      message: 'Pedido atualizado com sucesso.',
    }
  } catch (err) {
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o pedido.',
    }
  }
}

interface CreateOrderProps {
  order: SafeOrder
}

interface CreateOrderResponseData {
  order: Order
}

export async function createOrder(
  data: CreateOrderProps,
): Promise<ActionResponse<CreateOrderResponseData>> {
  try {
    const response = await payload.create({
      collection: 'order',
      data: {
        ...data.order,
        status: 'pending',
      },
    })

    revalidatePath('/painel/pedidos')

    return {
      data: { order: response },
      status: true,
      message: 'Pedido criado com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao criar o pedido. ',
    }
  }
}

interface UpdateLayoutProps {
  layoutId: string
  layout: SafeLayout
}

interface UpdateLayoutResponseData {
  layout: Layout
}

export async function updateLayout({
  layout,
  layoutId,
}: UpdateLayoutProps): Promise<ActionResponse<UpdateLayoutResponseData>> {
  try {
    const response = await payload.update({
      id: layoutId,
      collection: 'layouts',
      data: {
        ...layout,
      },
    })

    revalidatePath('/painel/pedidos')

    return {
      data: { layout: response },
      status: true,
      message: 'Layout atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o layout.',
    }
  }
}


export async function updateOrderStatus({
  orderId,
  status,
}: UpdateOrderStatusProps): Promise<ActionResponse<UpdateOrderStatusResponseData>> {
  try {
    const response = await payload.update({
      id: orderId,
      collection: 'order',
      data: { status },
    })

    revalidatePath('/painel/pedidos')

    return {
      data: { order: response },
      status: true,
      message: 'Status do pedido atualizado com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o status do pedido.',
    }
  }
}