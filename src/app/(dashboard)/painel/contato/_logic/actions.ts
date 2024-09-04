'use server'

import payload from 'payload'
import { ContactMessage } from '@/payload/payload-types'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/lib/actions'

interface CreateMessageProps {
  message: SafeContactMessage
}

type SafeContactMessage = Omit<
  ContactMessage,
  'createdAt' | 'updatedAt' | 'id' | 'sizes'
>

interface CreateMessageResponse {}

export async function createMessage({
  message,
}: CreateMessageProps): Promise<ActionResponse<CreateMessageResponse>> {
  try {
    const response = await payload.create({
      collection: 'contact-messages',
      data: {
        ...message,
        archived: false,
      },
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao criar a mensagem.',
      }
    }

    revalidatePath('/painel/contato')

    return {
      data: null,
      status: true,
      message: 'A mensagem foi arquivada.',
    }
  } catch (error) {}
}

interface ArchiveMessageProps {
  message: ContactMessage
}

interface ArchiveMessageResponse {}

export async function archiveMessage({
  message,
}: ArchiveMessageProps): Promise<ActionResponse<ArchiveMessageResponse>> {
  try {
    const response = await payload.update({
      id: message.id,
      collection: 'contact-messages',
      data: {
        ...message,
        archived: true,
      },
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao arquivar a mensagem.',
      }
    }

    revalidatePath('/painel/contato')

    return {
      data: null,
      status: true,
      message: 'A mensagem foi arquivada.',
    }
  } catch (error) {
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao arquivar a mensagem.',
    }
  }
}

interface ReadMessageProps {
  message: ContactMessage
}

interface ReadMessageResponseData {}

export async function readMessage({
  message,
}: ReadMessageProps): Promise<ActionResponse<ReadMessageResponseData>> {
  try {
    const response = await payload.update({
      id: message.id,
      collection: 'contact-messages',
      data: {
        ...message,
        read: true,
      },
    })

    if (!response) {
      return {
        data: null,
        status: false,
        message: '[400] Ocorreu um erro ao ler a mensagem.',
      }
    }

    revalidatePath('/painel/contato')

    return {
      data: null,
      status: true,
      message: 'Mensagem marcada como lida.',
    }
  } catch (err) {
    // console.error(err)
    return {
      data: null,
      status: false,
      message: '[500] Ocorreu um erro ao ler a mensagem.',
    }
  }
}
