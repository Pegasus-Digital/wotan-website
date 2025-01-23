'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Attribute } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

type SafeAttribute = Omit<Attribute, 'id' | 'createdAt' | 'updatedAt' | 'sizes'>

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

    revalidatePath('/sistema/catalogo/atributos')

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

interface DeleteAttributeResponseData { }

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
        message: `Não foi possível concluir a ação. Para remover um atributo é necessário que este não esteja contido em nenhum produto.`,
      }
    }

    const response = await payload.delete({
      id: attributeId,
      collection: 'attributes',
    })

    // @ts-ignore
    if (response.errors.length > 0) {
      // @ts-ignore
      // console.log(JSON.stringify(response.errors.map((error) => error.message)))
      return {
        data: null,
        status: false,
        message: `[400] Ocorreu um erro ao deletar o atributo.`,
      }
    }

    revalidatePath('/sistema/catalogo/atributos')

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

interface UpdateAttributeResponseData {
  attribute: Attribute
}

export async function updateAttribute(
  attribute: Attribute,
): Promise<ActionResponse<UpdateAttributeResponseData>> {
  try {
    const response = await payload.update({
      id: attribute.id,
      collection: 'attributes',
      data: {
        ...attribute,
      },
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o atributo.',
      }
    }

    revalidatePath('/sistema/catalogo/atributos')

    return {
      data: { attribute: response },
      status: true,
      message: 'Atributo atualizado com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o atributo.',
    }
  }
}
