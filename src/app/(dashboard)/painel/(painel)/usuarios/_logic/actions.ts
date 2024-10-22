'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { User } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

// The user should not be able to directly modify the omitted fields
type SafeUser = Omit<User, 'createdAt' | 'id' | 'sizes' | 'updatedAt'>

interface CreateUserResponseData {
  user: User | null
}

export async function createUser(
  user: SafeUser,
): Promise<ActionResponse<CreateUserResponseData>> {
  try {
    const response = await payload.create({
      collection: 'users',
      data: { ...user },
    })

    revalidatePath('/painel/usuarios')

    return {
      data: { user: response },
      status: true,
      message: 'Usuário criado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao criar o usuário.',
    }
  }
}

interface UpdateActionResponseData {
  user: User | null
}

export async function updateUser(
  id: string,
  user: SafeUser,
): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'users',
      where: { id: { equals: id } },
      data: { ...user, id },
    })

    if (response.errors.length > 0) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar o usuário.',
      }
    }

    revalidatePath('/painel/usuarios')

    return {
      data: { user: response.docs[0] },
      status: true,
      message: 'Usuário atualizado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o usuário.',
    }
  }
}

interface DeleteUserResponseData {}

export async function deleteUser(
  id: string,
): Promise<ActionResponse<DeleteUserResponseData>> {
  try {
    const response = await payload.delete({
      collection: 'users',
      where: { id: { equals: id } },
    })

    if (response.errors.length > 0) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao deletar o usuário.',
      }
    }

    revalidatePath('/painel/usuarios')

    return {
      data: null,
      status: true,
      message: 'Usuário deletado com sucesso.',
    }
  } catch (err) {
    console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao deletar o usuário.',
    }
  }
}
