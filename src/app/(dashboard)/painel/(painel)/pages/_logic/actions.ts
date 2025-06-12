'use server'

import { revalidatePath } from 'next/cache'
import { Page } from '@/payload/payload-types'
import { getPayloadClient } from '@/lib/get-payload'

export async function updatePage(pageId: string, data: Partial<Page>) {
  try {
    const payload = await getPayloadClient()
    const updatedPage = await payload.update({
      collection: 'pages',
      id: pageId,
      data,
    })

    revalidatePath('/painel/pages')
    return updatedPage
  } catch (error) {
    throw error
  }
} 