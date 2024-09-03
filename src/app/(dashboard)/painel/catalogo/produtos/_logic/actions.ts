'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Product } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

// The user should not be able to directly modify the omitted fields
type SafeProduct = Omit<Product, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>

export type ProductInfo = Pick<Product, 'sku' | 'id'>

type ProductThings = Pick<Product, 'categories'>

interface CreateProductResponseData {
  product: Product | null
}

export async function createProduct(
  product: SafeProduct,
): Promise<ActionResponse<CreateProductResponseData>> {
  try {
    const productsWithSameSku = await payload.find({
      collection: 'products',
      where: { sku: { equals: product.sku } },
      limit: 1,
    })

    if (productsWithSameSku.docs.length > 0) {
      return {
        data: null,
        status: false,
        message: 'Não é possível criar o produto. SKU já está em uso.',
      }
    }

    const response = await payload.create({
      collection: 'products',
      data: { ...product, _status: 'published' },
    })

    revalidatePath('/painel/catalogo/produtos')

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
      message: '[500] Ocorreu um erro ao criar o produto.',
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
    const productsWithSameSku = await payload.find({
      collection: 'products',
      where: {
        and: [{ sku: { equals: product.sku } }, { id: { not_equals: id } }],
      },
      limit: 1,
    })

    if (productsWithSameSku.docs.length > 0) {
      return {
        data: null,
        status: false,
        message: 'Não é possível criar o produto. SKU já está em uso.',
      }
    }

    delete product.images

    const response = await payload.update({
      id,
      collection: 'products',
      data: { ...product },
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o produto.',
      }
    }

    revalidatePath('/painel/catalogo/produtos')

    return {
      data: { product: response },
      status: true,
      message: 'Produto atualizado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o produto.',
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
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao deletar o produto.',
      }
    }

    revalidatePath('/painel/catalogo/produtos')

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
      message: '[500] Ocorreu um erro ao deletar o produto.',
    }
  }
}

interface CreateMediaResponseData {}

// export async function createMedia(): Promise<
//   ActionResponse<CreateMediaResponseData>
// > {
//   try {
//     const response = await payload.create({
//       collection: 'media',
//       data: {
//         alt: '',
//       },
//       file: {

//       }
//     })
//   } catch (err) {
//     console.error(err)

//     return {
//       data: null,
//       status: false,
//       message: '[500] Ocorreu um erro ao enviar a imagem para o servidor.',
//     }
//   }
// }

interface BulkUpdateActionResponseData {
  products: Product[] | null
}

export async function bulkUpdateProductCategories(
  products: ProductInfo[],
  productThings: ProductThings,
): Promise<ActionResponse<BulkUpdateActionResponseData>> {
  // console.log(products)
  try {
    for (const product of products) {
      const { sku, id } = product
      try {
        const { categories } = productThings

        const response = await payload.update({
          collection: 'products',
          where: { id: { equals: id } },
          data: { categories },
        })

        if (response.errors.length > 0) {
          // console.error(response.errors)
          return {
            data: null,
            status: false,
            message: `[400] Ocorreu um erro ao atualizar o produto. SKU: ${sku}`,
          }
        }
      } catch (err) {
        // console.error(err)

        return {
          data: null,
          status: false,
          message: `[500] Ocorreu um erro ao atualizar o produto. SKU: ${sku}`,
        }
      }
    }
    revalidatePath('/painel/catalogo/produtos')
    return {
      data: null,
      status: true,
      message: 'Produtos atualizados com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar os produtos.',
    }
  }
}
