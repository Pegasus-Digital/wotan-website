import { CollectionConfig } from 'payload/types'
import { contactForm } from '../fields/contact-form'

const Contact: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    group: 'Clients',
  },
  fields: [
    // ...contactForm,
    {
      name: 'name',
      required: true,
      type: 'text',
    },
    {
      name: 'email',
      required: true,
      type: 'email',
    },
    {
      name: 'fone',
      required: true,
      type: 'text',
    },
    {
      name: 'cnpj',
      // required: true,
      type: 'text',
    },
    {
      name: 'message',
      required: true,
      type: 'textarea',
    },
    {
      name: 'acceptEmail',
      // required:true,
      type: 'checkbox',
    },
    {
      name: 'acceptPrivacy',
      required: true,
      type: 'checkbox',
    },
    {
      name: 'read',
      type: 'checkbox',
    },
    {
      name: 'contactedBy',
      relationTo: 'salespersons',
      type: 'relationship',
    },
    {
      name: 'archived',
      type: 'checkbox',
      defaultValue: false,
      required: true,
    },
  ],
  timestamps: true,
}

export { Contact }
