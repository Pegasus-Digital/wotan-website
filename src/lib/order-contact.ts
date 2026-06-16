import { Client, Order } from '@/payload/payload-types'

type ClientContact = NonNullable<Client['contacts']>[number]

/**
 * Preserves Payload array-item IDs when updating client contacts.
 * Without IDs, Payload treats contacts as new entries and regenerates IDs,
 * breaking order.contact references.
 */
export function preserveClientContactIds(
  existingContacts: Client['contacts'] | null | undefined,
  submittedContacts: ClientContact[],
): ClientContact[] {
  if (!existingContacts?.length) return submittedContacts

  return submittedContacts.map((contact, index) => {
    if (contact.id) return contact

    const existingAtIndex = existingContacts[index]
    if (
      existingAtIndex?.id &&
      (existingAtIndex.email === contact.email ||
        existingAtIndex.name === contact.name)
    ) {
      return { ...contact, id: existingAtIndex.id }
    }

    const byEmail = contact.email
      ? existingContacts.find((c) => c.email === contact.email)
      : undefined
    if (byEmail?.id) return { ...contact, id: byEmail.id }

    const byName = contact.name
      ? existingContacts.find((c) => c.name === contact.name)
      : undefined
    if (byName?.id) return { ...contact, id: byName.id }

    return contact
  })
}

export function resolveOrderContact(
  order: Pick<Order, 'contact' | 'alternativeContact'>,
  client: Client | null,
): ClientContact | null {
  if (!client?.contacts?.length) {
    if (order.alternativeContact?.name || order.alternativeContact?.email) {
      return {
        name: order.alternativeContact.name,
        email: order.alternativeContact.email,
        phone: order.alternativeContact.phone,
        whatsapp: order.alternativeContact.whatsapp,
      }
    }
    return null
  }

  const byId = client.contacts.find((c) => c.id === order.contact)
  if (byId) return byId

  if (order.alternativeContact?.email) {
    const byAltEmail = client.contacts.find(
      (c) => c.email === order.alternativeContact?.email,
    )
    if (byAltEmail) return byAltEmail
  }

  if (order.alternativeContact?.name || order.alternativeContact?.email) {
    return {
      name: order.alternativeContact.name,
      email: order.alternativeContact.email,
      phone: order.alternativeContact.phone,
      whatsapp: order.alternativeContact.whatsapp,
    }
  }

  if (client.contacts.length === 1) {
    return client.contacts[0]
  }

  return null
}

export async function reconcileOrderContactReferences(
  findOrders: () => Promise<Array<Pick<Order, 'id' | 'contact' | 'alternativeContact'>>>,
  updateOrderContact: (orderId: string, contactId: string) => Promise<void>,
  contacts: NonNullable<Client['contacts']>,
) {
  const validContactIds = new Set(
    contacts.map((c) => c.id).filter((id): id is string => Boolean(id)),
  )

  const orders = await findOrders()

  for (const order of orders) {
    if (validContactIds.has(order.contact)) continue

    const byAltEmail = order.alternativeContact?.email
      ? contacts.find((c) => c.email === order.alternativeContact?.email)
      : undefined

    const replacementId =
      byAltEmail?.id ?? (contacts.length === 1 ? contacts[0].id : undefined)

    if (replacementId) {
      await updateOrderContact(order.id, replacementId)
    }
  }
}
