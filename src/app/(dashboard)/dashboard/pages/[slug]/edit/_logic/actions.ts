'use server'

import { revalidatePath } from 'next/cache'

import payload from 'payload'
import { Page } from '@/payload/payload-types'

import { ActionResponse } from '@/lib/actions'

type SafePage = Omit<
  Page,
  'createdAt' | 'updatedAt' | 'publishedAt' | 'carousel'
>

interface UpdatePageResponseData {
  page: Page
}

export async function updatePage(
  page: SafePage,
): Promise<ActionResponse<UpdatePageResponseData>> {
  try {
    const response = await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        ...page,
      },
    })

    // console.log({ response })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao atualizar a página.',
      }
    }

    const revalidateSlug = `/dashboard/pages/${page.slug}/edit`
    revalidatePath(revalidateSlug)

    return {
      data: { page: response },
      status: true,
      message: 'Página atualizada com sucesso.',
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
