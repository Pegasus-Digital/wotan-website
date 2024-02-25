import { Field } from 'payload/types'

export const navLink: Field[] = [
  {
    name: 'title',
    type: 'text',
  },
  {
    //todo: change to relation to page
    name: 'href',
    type: 'text',
  },
  {
    name: 'description',
    type: 'text',
  },
]
