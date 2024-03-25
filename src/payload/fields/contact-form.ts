import { Field } from 'payload/types'

export const contactForm: Field[] = [
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
]
