'use server'

import payload from 'payload'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'
import { Company } from '@/payload/payload-types'

interface UpdateSettingsResponseData {}

export async function updateSettings(
  company: Company,
): Promise<ActionResponse<UpdateSettingsResponseData>> {
  try {
    const response = await payload.updateGlobal({
      slug: 'settings',
      data: { company },
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar as configurações.',
      }
    }

    revalidatePath('/')
    revalidatePath('/painel/configuracoes')

    return {
      data: null,
      status: true,
      message: 'Configurações atualizadas com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar as configurações.',
    }
  }
}
