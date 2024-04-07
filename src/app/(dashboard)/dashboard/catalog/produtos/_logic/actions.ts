'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Product } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

// The user should not be able to directly modify the omitted fields
type SafeProduct = Omit<Product, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>

interface CreateProductResponseData {
  product: Product | null
}

export async function createProduct(
  product: SafeProduct,
): Promise<ActionResponse<CreateProductResponseData>> {
  try {
    // await payload.find({ collection: 'media' })

    const response = await payload.create({
      collection: 'products',
      data: { ...product, _status: 'published' },
    })

    revalidatePath('/dashboard/catalog/produtos')

    return {
      data: { product: response },
      status: true,
      message: 'Produto criado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: 'Ocorreu um erro ao criar o produto.',
    }
  }
}

interface UpdateActionResponseData {
  product: Product | null
}

export async function updateProduct(
  id: string,
  product: SafeProduct,
): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'products',
      where: { id: { equals: id } },
      data: { ...product, id },
    })

    if (response.errors.length > 0) {
      return {
        data: null,
        status: false,
        message: `Não foi possível atualizar o produto.\n${JSON.stringify(response.errors)}`,
      }
    }

    revalidatePath('/dashboard/catalog/produtos')

    return {
      data: { product: response.docs[0] },
      status: true,
      message: 'Produto atualizado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: 'Ocorreu um erro ao atualizar o produto.',
    }
  }
}

interface DeleteProductResponseData {}

export async function deleteProduct(
  id: string,
): Promise<ActionResponse<DeleteProductResponseData>> {
  try {
    const response = await payload.delete({
      collection: 'products',
      where: { id: { equals: id } },
    })

    if (response.errors.length > 0) {
      return { data: null, status: false, message: 'Algo de errado ocorreu.' }
    }

    revalidatePath('/dashboard/catalog/produtos')

    return {
      data: null,
      status: true,
      message: 'Produto deletado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: 'Ocorreu um erro ao deletar o produto.',
    }
  }
}
