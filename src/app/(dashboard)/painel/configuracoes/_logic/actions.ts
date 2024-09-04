'use server'

import payload from 'payload'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'
import { Company, Footer, Header } from '@/payload/payload-types'

interface UpdateSettingsResponseData {}

export async function updateCompanySettings(
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
    // console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar as configurações.',
    }
  }
}

export async function updateFooterSettings(
  footer: Footer,
): Promise<ActionResponse<UpdateSettingsResponseData>> {
  try {
    delete footer.logo
    const response = await payload.updateGlobal({
      slug: 'settings',
      data: {
        footer,
      },
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

    // console.log({ response })

    return {
      data: null,
      status: true,
      message: 'Configurações atualizadas com sucesso.',
    }
  } catch (err) {
    // console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar as configurações.',
    }
  }
}

export async function updateHeaderSettings(
  header: Header,
): Promise<ActionResponse<UpdateSettingsResponseData>> {
  try {
    delete header.logo

    const response = await payload.updateGlobal({
      slug: 'settings',
      data: {
        header,
      },
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

    // console.log({ response })

    return {
      data: null,
      status: true,
      message: 'Configurações atualizadas com sucesso.',
    }
  } catch (err) {
    // console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao atualizar as configurações.',
    }
  }
}
