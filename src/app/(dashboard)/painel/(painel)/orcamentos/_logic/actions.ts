'use server'

import { revalidatePath } from 'next/cache'

import { ActionResponse } from '@/lib/actions'

import payload from 'payload'
import { Budget } from '@/payload/payload-types'

interface EmailBudgetToCustomerProps {
  budget: Budget
  emailAddress: string
}

interface EmailBudgetToCustomerResponseData {}

export async function emailBudgetToCustomer({
  budget,
  emailAddress,
}: EmailBudgetToCustomerProps): Promise<
  ActionResponse<EmailBudgetToCustomerResponseData>
> {
  try {
    // Send budget to customer via email
    await payload.sendEmail({
      from: process.env.PLATFORM_EMAIL,
      to: emailAddress,
      subject: 'Orçamento - Wotan Brindes',
      html: `
      <h1>Olá cliente.</h1>
      <p>Temos atualizações sobre seu orçamento, clique <a href='${process.env.NEXT_PUBLIC_SERVER_URL}/cliente/orcamento/${budget.id}' target='_blank'>aqui</a> para visualizar.</p>`,
    })

    await payload.update({
      collection: 'budget',
      id: budget.id,
      data: {
        status: 'enviado',
      },
    })

    revalidatePath('/painel/orcamentos')
  } catch (err) {
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao enviar o email.',
    }
  }
}

interface DeleteBudgetProps {
  budgetId: string
}

interface DeleteBudgetResponseData {}

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

interface UpdateActionResponseData {
  budget: Budget | null
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
