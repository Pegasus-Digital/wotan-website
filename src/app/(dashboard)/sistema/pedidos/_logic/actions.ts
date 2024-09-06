'use server'

import payload from 'payload'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'

interface DeleteEstimateProps {
  estimateId: string
}

interface DeleteEstimateResponseData {}

export async function deleteEstimate({
  estimateId,
}: DeleteEstimateProps): Promise<ActionResponse<DeleteEstimateResponseData>> {
  try {
    const response = await payload.delete({
      collection: 'budget',
      where: { id: { equals: estimateId } },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao deletar o orçamento.',
      }
    }

    revalidatePath('/sistema/contato')

    return {
      data: null,
      status: true,
      message: 'Orçamento deletado com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao deletar o orçamento.',
    }
  }
}
