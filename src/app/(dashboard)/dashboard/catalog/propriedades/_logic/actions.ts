'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Attribute, Category } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

type SafeCategory = Omit<Category, 'id' | 'sizes' | 'createdAt' | 'updatedAt'>

interface CreateCategoryResponseData {
  category: Category | null
}

export async function createCategory(
  category: SafeCategory,
): Promise<ActionResponse<CreateCategoryResponseData>> {
  try {
    const response = await payload.create({
      collection: 'categories',
      data: { ...category },
    })

    revalidatePath('/dashboard/catalog/propriedades')

    return {
      data: { category: response },
      status: true,
      message: 'Categoria criada com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao criar a categoria.',
    }
  }
}

interface UpdateCategoryResponseData {
  category: Category
}

export async function updateCategory(
  category: Category,
): Promise<ActionResponse<UpdateCategoryResponseData>> {
  try {
    const response = await payload.update({
      collection: 'categories',
      where: {
        id: { equals: category.id },
      },
      data: {
        ...category,
      },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar a categoria.',
      }
    }

    revalidatePath('/dashboard/catalog/propriedades')

    return {
      data: { category: response.docs[0] },
      status: true,
      message: 'Categoria atualizada com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar a categoria.',
    }
  }
}

interface DeleteCategoryResponseData {}

export async function deleteCategory(
  categoryId: string,
): Promise<ActionResponse<DeleteCategoryResponseData>> {
  try {
    const productsWithCategory = await payload.find({
      collection: 'products',
      where: {
        categories: { contains: categoryId },
      },
      pagination: false,
    })

    // Se existe um produto com a categoria ou atributo, deve avisar pra que o admin remova antes de deletar a propriedade
    if (productsWithCategory.totalDocs > 0) {
      return {
        data: null,
        status: false,
        message: `[400] Não foi possível remover a categoria, é necessário remover esta categoria de todos os produtos existentes.`,
      }
    }

    const response = await payload.delete({
      collection: 'categories',
      where: {
        id: { equals: categoryId },
      },
    })

    if (response.errors.length > 0) {
      return {
        data: null,
        status: false,
        message: `[400] Ocorreu um erro ao deletar a categoria. ${JSON.stringify(response.errors.map((error) => error.message))}`,
      }
    }

    revalidatePath('/dashboard/catalog/propriedades')

    return {
      data: null,
      status: true,
      message: 'Categoria deletada com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao deletar a categoria.',
    }
  }
}

type SafeAttribute = Omit<Attribute, 'id' | 'createdAt' | 'updatedAt'>

interface CreateAttributeResponseData {
  attribute: Attribute | null
}

export async function createAttribute(
  attribute: SafeAttribute,
): Promise<ActionResponse<CreateAttributeResponseData>> {
  try {
    const response = await payload.create({
      collection: 'attributes',
      data: {
        ...attribute,
      },
    })

    revalidatePath('/dashboard/catalog/propriedades')

    return {
      data: { attribute: response },
      status: true,
      message: 'Atributo criado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao criar o atributo.',
    }
  }
}

interface DeleteAttributeResponseData {}

export async function deleteAttribute(
  attributeId: string,
): Promise<ActionResponse<DeleteAttributeResponseData>> {
  try {
    const productsWithAttribute = await payload.find({
      collection: 'products',
      where: {
        attributes: { contains: attributeId },
      },
      pagination: false,
    })

    // Se existe um produto com a categoria ou atributo, deve avisar pra que o admin remova antes de deletar a propriedade
    if (productsWithAttribute.totalDocs > 0) {
      return {
        data: null,
        status: false,
        message: `[400] Não foi possível remover o atributo, é necessário remover o atributo de todos os produtos existentes.`,
      }
    }

    const response = await payload.delete({
      collection: 'attributes',
      where: {
        id: { equals: attributeId },
      },
    })

    if (response.errors.length > 0) {
      return {
        data: null,
        status: false,
        message: `[400] Ocorreu um erro ao deletar o atributo. ${JSON.stringify(response.errors.map((error) => error.message))}`,
      }
    }

    revalidatePath('/dashboard/catalog/propriedades')

    return {
      data: null,
      status: true,
      message: 'Atributo deletado com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao deletar o atributo.',
    }
  }
}

export async function updateAttribute() {}
