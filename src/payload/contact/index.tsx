import { CollectionConfig } from 'payload/types'
import { contactForm } from '../fields/contact-form'

const Contact: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    group: 'Clients',
  },
  fields: [
    ...contactForm,
    {
      name: 'read',
      type: 'checkbox',
    },
    {
      name: 'contactedBy',
      relationTo: 'salespersons',
      type: 'relationship',
    },
  ],
  timestamps: true,
}

export { Contact }
