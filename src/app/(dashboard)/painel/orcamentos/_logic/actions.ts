'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Budget } from '@/payload/payload-types'
import { ActionResponse } from '@/lib/actions'

interface DeleteBudgetProps {
  budgetId: string
}

interface DeleteBudgetResponseData {}

interface UpdateActionResponseData {
  budget: Budget | null
}

export async function deleteBudget({
  budgetId,
}: DeleteBudgetProps): Promise<ActionResponse<DeleteBudgetResponseData>> {
  try {
    const response = await payload.delete({
      collection: 'budget',
      where: { id: { equals: budgetId } },
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

type SafeBudget = Omit<Budget, 'createdAt' | 'updatedAt' | 'id'>

interface CreateBudgetResponseData {
  budget: Budget | null
}
export async function createBudget(
  budget: SafeBudget,
): Promise<ActionResponse<CreateBudgetResponseData>> {
  try {
    const response = await payload.create({
      collection: 'budget',
      data: { ...budget },
    })

    revalidatePath('/painel/orcamentos')

    // console.log(response)

    return {
      data: { budget: response },
      status: true,
      message: 'Orçamento criado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao criar orçamento.',
    }
  }
}

interface UpdateBudgetProps {
  budget: SafeBudget
  id: Budget['id']
}

export async function UpdateBudget({
  budget,
  id,
}: UpdateBudgetProps): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'budget',
      where: { id: { equals: id } },
      data: { ...budget },
    })

    revalidatePath('/painel/orcamentos')

    return {
      data: { budget: response.docs[0] },
      status: true,
      message: 'Orçamento atualizado com sucesso.',
    }
  } catch (err) {
    // console.error(err)

    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar o orçamento.',
    }
  }
}

interface UpdateBudgetStatusProps {
  id: string
  status: Budget['status']
}

export async function updateBudgetStatus({
  id,
  status,
}: UpdateBudgetStatusProps): Promise<ActionResponse<UpdateActionResponseData>> {
  try {
    const response = await payload.update({
      collection: 'budget',
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

    revalidatePath('/painel/orcamentos')

    return {
      data: { budget: response.docs[0] },
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
