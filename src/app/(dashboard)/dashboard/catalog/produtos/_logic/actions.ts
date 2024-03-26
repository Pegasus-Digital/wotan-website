'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Product } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

interface CreateProductResponseData {
  product: Product | null
}

export async function createProduct(
  product: Omit<Product, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>,
): Promise<ActionResponse<CreateProductResponseData>> {
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
}

// interface UpdateActionResponseData {
//   product: Product | null
// }

// export async function updateProduct(
//   product: Product,
// ): Promise<ActionResponse<UpdateActionResponseData>> {
//   const response = await payload.update({
//     collection: 'products',
//     where: { id: { equals: product.id } },
//     data: product,
//   })

//   if (response.errors.length > 0) {
//     return {
//       data: null,
//       status: false,
//       message: `Não foi possível atualizar o produto.\n${JSON.stringify(response.errors)}`,
//     }
//   }

//   return {
//     data: {
//       product,
//     },
//     status: true,
//     message: 'Produto atualizado com sucesso.',
//   }
// }

interface DeleteProductResponseData {}

export async function deleteProduct(
  productId: string,
): Promise<ActionResponse<DeleteProductResponseData>> {
  const response = await payload.delete({
    collection: 'products',
    where: { id: { equals: productId } },
  })

  if (response.errors.length > 0) {
    return { data: null, status: false, message: 'Algo de errado ocorreu.' }
  }

  revalidatePath('/dashboard/catalog/produtos')
  return { data: null, status: true, message: 'Produto deletado com sucesso.' }
}
