'use server'

import payload from 'payload'
import { ContactMessage } from '@/payload/payload-types'
import { revalidatePath } from 'next/cache'

interface ReadTaskProps {
  message: ContactMessage
}

export async function readTask({ message }: ReadTaskProps) {
  try {
    await payload.update({
      collection: 'contact-messages',
      where: { id: { equals: message.id } },
      data: {
        ...message,
        read: true,
      },
    })

    revalidatePath('/dashboard/contact')
  } catch (err) {
    console.log(err)
    return {
      data: null,
      message: 'Não foi possível marcar a mensagem como lida.',
    }
  }
}
