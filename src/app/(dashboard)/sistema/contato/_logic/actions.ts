'use server'

import payload from 'payload'
import { ContactMessage } from '@/payload/payload-types'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'

export async function archiveMessage(messageId: string) {}

interface ReadMessageProps {
  message: ContactMessage
}

interface ReadMessageResponseData {}

export async function readMessage({
  message,
}: ReadMessageProps): Promise<ActionResponse<ReadMessageResponseData>> {
  try {
    const response = await payload.update({
      collection: 'contact-messages',
      where: { id: { equals: message.id } },
      data: {
        ...message,
        read: true,
      },
    })

    if (!response.docs[0]) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao ler a mensagem.',
      }
    }

    revalidatePath('/sistema/contato')

    return {
      data: null,
      status: true,
      message: 'Mensagem lida com sucesso.',
    }
  } catch (err) {
    console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Houve um erro ao ler a mensagem.',
    }
  }
}
